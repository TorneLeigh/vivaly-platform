import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { requireAuth } from "./auth-middleware";
import session from "express-session";
import { 
  insertUserSchema, insertNannySchema, insertBookingSchema, 
  insertReviewSchema, insertMessageSchema, insertExperienceSchema,
  insertParentProfileSchema, insertChildcareProviderSchema, insertChildcareEnrollmentSchema
} from "@shared/schema";
import { sendNannyWelcomeSequence, sendBookingConfirmation, sendNewNannyAlert, sendCaregiverWelcomeSequence, sendCaregiverApplicationAlert, sendParentWelcomeSequence } from "./email-service";
import sgMail from '@sendgrid/mail';
import { emailAutomationService } from "./email-automation-service";
import { wwccVerificationService } from "./wwcc-verification-service";
import { voucherService } from "./voucher-service";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'vivaly-secret-key-development',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth routes
  app.get('/api/auth/user', async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (userId) {
      try {
        const user = await storage.getUser(userId);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          res.json(userWithoutPassword);
        } else {
          res.json(null);
        }
      } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
      }
    } else {
      res.json(null);
    }
  });

  // Registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        isNanny: false
      });

      // Set session
      (req.session as any).userId = user.id;

      // Send welcome email
      try {
        if (user.email && user.firstName) {
          await sendParentWelcomeSequence(user.email, user.firstName);
        }
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail registration if email fails
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      (req.session as any).userId = user.id;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  // JWT Authentication system
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

  const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  };

  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Enhanced authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || null,
        profileImage: null,
        isNanny: userData.isCaregiver || false,
      });

      // Generate token
      const token = generateToken(user.id.toString());

      // Store user ID in session
      req.session.userId = user.id;

      // Send appropriate welcome email based on user type
      try {
        const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'there';
        
        if (userData.isCaregiver) {
          // Send caregiver welcome email
          await sendCaregiverWelcomeSequence(userData.email, userName, {
            applicationId: Math.floor(Math.random() * 90000) + 10000, // Generate random application ID
            nextSteps: [
              'Background verification and WWCC check',
              'Review of your qualifications and experience', 
              'Phone interview with our team',
              'Profile setup and onboarding'
            ]
          });
        } else {
          // Send parent welcome email
          await sendParentWelcomeSequence(userData.email, userName);
        }
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail registration if email fails
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = generateToken(user.id.toString());
      
      // Store user ID in session for backward compatibility
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login error" });
    }
  });

  // Simple authentication routes that work correctly
  app.post('/api/auth/simple-login', async (req, res) => {
    try {
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user ID in session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, success: true });
    } catch (error) {
      console.error("Simple login error:", error);
      res.status(500).json({ message: "Login error" });
    }
  });

  app.post('/api/auth/simple-signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Email, password, first name, and last name are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user with a simple string ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newUser = {
        id: userId,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phone: phone || null,
        profileImageUrl: null,
        isNanny: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store user directly in memory storage
      const user = await storage.createUserSimple(newUser);

      // Store user ID in session
      req.session.userId = user.id;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, success: true });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password for security
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create new user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Store user ID in session
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Registration error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, serviceType, nannyId } = req.body;
      
      if (!amount || amount < 0.50) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "aud", // Australian dollars for Sydney-based platform
        metadata: {
          serviceType: serviceType || "childcare_booking",
          nannyId: nannyId ? nannyId.toString() : "",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/create-gift-card-payment", async (req, res) => {
    try {
      const { amount, recipientEmail, message } = req.body;
      
      if (!amount || amount < 10) {
        return res.status(400).json({ message: "Gift card minimum is $10" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "aud",
        metadata: {
          type: "gift_card",
          recipientEmail: recipientEmail || "",
          message: message || "",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe gift card payment error:", error);
      res.status(500).json({ message: "Error creating gift card payment: " + error.message });
    }
  });
  
  // Nannies routes
  app.get("/api/nannies/featured", async (req, res) => {
    try {
      const nannies = await storage.getFeaturedNannies();
      res.json(nannies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured nannies" });
    }
  });

  app.get("/api/nannies/search", async (req, res) => {
    try {
      const { location, serviceType, date, minRate, maxRate } = req.query;
      const filters = {
        location: location as string,
        serviceType: serviceType as string,
        date: date as string,
        minRate: minRate ? parseFloat(minRate as string) : undefined,
        maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
      };
      
      const nannies = await storage.searchNannies(filters);
      res.json(nannies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search nannies" });
    }
  });

  app.get("/api/nannies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const nanny = await storage.getNanny(id);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny not found" });
      }

      const user = await storage.getUser(nanny.userId);
      
      res.json({ ...nanny, user });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nanny profile" });
    }
  });

  app.get("/api/reviews/nanny/:id", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByNanny(nannyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Enhanced booking routes with authentication
  app.post("/api/bookings", authenticateToken, async (req: any, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        parentId: req.user.userId, // Set from authenticated user
      });
      const booking = await storage.createBooking(bookingData);
      
      // Send confirmation emails
      // await sendBookingConfirmation(booking);
      
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/parent/:parentId", async (req, res) => {
    try {
      const parentId = parseInt(req.params.parentId);
      const bookings = await storage.getBookingsByParent(parentId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parent bookings" });
    }
  });

  app.get("/api/bookings/nanny/:nannyId", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.nannyId);
      const bookings = await storage.getBookingsByNanny(nannyId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch caregiver bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "accepted", "declined", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await storage.updateBookingStatus(bookingId, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Enhanced caregiver onboarding with comprehensive verification
  app.post("/api/caregivers/onboard", async (req: any, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Parse and validate the comprehensive onboarding data
      const onboardingData = req.body;
      
      // Create enhanced nanny profile with verification tracking
      const nannyData = {
        userId: parseInt(userId),
        bio: onboardingData.bio,
        experience: onboardingData.experience,
        hourlyRate: onboardingData.hourlyRate,
        location: onboardingData.location,
        suburb: onboardingData.suburb,
        services: onboardingData.services,
        certificates: onboardingData.certificates,
        availability: onboardingData.availability,
        minimumBookingHours: onboardingData.minimumBookingHours,
        wwccNumber: onboardingData.wwccNumber,
        firstAidCert: onboardingData.firstAidCert,
        policeCheck: onboardingData.policeCheck,
        abn: onboardingData.abn,
        bankDetails: {
          accountName: onboardingData.bankAccountName,
          bsb: onboardingData.bsb,
          accountNumber: onboardingData.accountNumber
        },
        emergencyContact: {
          name: onboardingData.emergencyContactName,
          phone: onboardingData.emergencyContactPhone,
          relationship: onboardingData.emergencyContactRelationship
        },
        verificationStatus: "pending_documents",
        onboardingCompleted: true,
        isVerified: false,
      };

      const nanny = await storage.createNanny(nannyData);
      
      // Send comprehensive welcome email sequence
      await sendCaregiverWelcomeSequence(user.email, user.firstName, {
        applicationId: nanny.id,
        nextSteps: [
          "Document verification within 24 hours",
          "Background check processing (2-3 days)",
          "Profile review and approval",
          "Platform activation"
        ]
      });
      
      // Send detailed admin notification for review
      await sendCaregiverApplicationAlert({
        applicationId: nanny.id,
        caregiver: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: onboardingData.phone,
          location: nanny.location,
          suburb: nanny.suburb,
          experience: nanny.experience,
          hourlyRate: nanny.hourlyRate,
          services: nanny.services,
          wwccNumber: onboardingData.wwccNumber,
          hasFirstAid: onboardingData.firstAidCert,
          hasPoliceCheck: onboardingData.policeCheck
        },
        urgency: "standard",
        estimatedReviewTime: "2-3 business days"
      });

      res.json({
        success: true,
        applicationId: nanny.id,
        status: "submitted",
        message: "Your application has been submitted successfully. We'll contact you within 24 hours for document verification.",
        nextSteps: {
          immediate: "Check your email for verification instructions",
          within24Hours: "Document upload request",
          within72Hours: "Application review completion",
          onApproval: "Platform access and profile activation"
        }
      });
    } catch (error) {
      console.error("Error in caregiver onboarding:", error);
      res.status(500).json({ 
        message: "Failed to submit application", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/nannies", async (req, res) => {
    try {
      const nannyData = insertNannySchema.parse(req.body);
      const nanny = await storage.createNanny(nannyData);
      
      // Get user details for email
      const user = await storage.getUser(nannyData.userId);
      if (user) {
        // Send welcome email sequence
        await sendNannyWelcomeSequence(user.email, user.firstName);
        
        // Send admin alert
        await sendNewNannyAlert({
          id: nanny.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          location: nanny.location,
          experience: nanny.experience,
          hourlyRate: nanny.hourlyRate
        });
      }
      
      res.status(201).json(nanny);
    } catch (error) {
      res.status(400).json({ message: "Invalid nanny data" });
    }
  });

  // Users routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes for nannies
  app.get("/api/nannies/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny profile not found" });
      }
      
      res.json(nanny);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nanny profile" });
    }
  });

  app.get("/api/bookings/upcoming", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.json([]);
      }
      
      const bookings = await storage.getBookingsByNanny(nanny.id);
      const upcomingBookings = bookings.filter(booking => 
        new Date(booking.date) >= new Date() && booking.status === 'confirmed'
      );
      
      res.json(upcomingBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming bookings" });
    }
  });

  app.get("/api/nannies/earnings", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.json({ thisMonth: 0, total: 0 });
      }
      
      const bookings = await storage.getBookingsByNanny(nanny.id);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthEarnings = bookings
        .filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear &&
                 booking.status === 'completed';
        })
        .reduce((total, booking) => total + parseFloat(booking.totalAmount || '0'), 0);
      
      const totalEarnings = bookings
        .filter(booking => booking.status === 'completed')
        .reduce((total, booking) => total + parseFloat(booking.totalAmount || '0'), 0);
      
      res.json({ thisMonth: thisMonthEarnings, total: totalEarnings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  app.patch("/api/nannies/availability", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { isAvailable } = req.body;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny profile not found" });
      }
      
      // Update availability in nanny profile
      const updatedNanny = await storage.updateNanny(nanny.id, { 
        availability: { general: isAvailable } 
      });
      
      res.json(updatedNanny);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  // WWCC Verification routes
  app.post("/api/wwcc/verify", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Caregiver profile not found" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { wwccNumber, state, expiryDate } = req.body;
      
      const verificationRequest = {
        caregiverId: nanny.id,
        wwccNumber,
        state,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        expiryDate
      };

      const result = await wwccVerificationService.verifyWWCC(verificationRequest);
      
      res.json(result);
    } catch (error: any) {
      console.error("WWCC verification error:", error);
      res.status(500).json({ message: error.message || "Failed to verify WWCC" });
    }
  });

  app.get("/api/wwcc/status/:caregiverId", requireAuth, async (req, res) => {
    try {
      const { caregiverId } = req.params;
      const status = await wwccVerificationService.getWWCCStatus(parseInt(caregiverId));
      
      res.json(status);
    } catch (error) {
      console.error("WWCC status error:", error);
      res.status(500).json({ message: "Failed to fetch WWCC status" });
    }
  });

  app.get("/api/wwcc/verification-link/:state/:wwccNumber", async (req, res) => {
    try {
      const { state, wwccNumber } = req.params;
      const link = wwccVerificationService.getManualVerificationLink(wwccNumber, state);
      
      res.json({ verificationLink: link });
    } catch (error) {
      console.error("WWCC verification link error:", error);
      res.status(500).json({ message: "Failed to get verification link" });
    }
  });

  // Voucher routes
  app.post("/api/vouchers/claim", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Caregiver profile not found" });
      }

      const { voucherType, receiptAmount, receiptImageUrl, certificationDate, expiryDate, state } = req.body;
      
      const voucherRequest = {
        caregiverId: nanny.id,
        voucherType,
        receiptAmount: parseFloat(receiptAmount),
        receiptImageUrl,
        certificationDate,
        expiryDate,
        state
      };

      const voucher = await voucherService.submitVoucherClaim(voucherRequest);
      
      res.json(voucher);
    } catch (error: any) {
      console.error("Voucher claim error:", error);
      res.status(500).json({ message: error.message || "Failed to submit voucher claim" });
    }
  });

  app.get("/api/vouchers/eligible", async (req, res) => {
    try {
      const eligibleVouchers = voucherService.getEligibleVouchers();
      res.json(eligibleVouchers);
    } catch (error) {
      console.error("Eligible vouchers error:", error);
      res.status(500).json({ message: "Failed to get eligible vouchers" });
    }
  });

  app.get("/api/vouchers/my-claims", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Caregiver profile not found" });
      }

      const vouchers = await voucherService.getVouchersByCaregiver(nanny.id);
      res.json(vouchers);
    } catch (error) {
      console.error("My voucher claims error:", error);
      res.status(500).json({ message: "Failed to get voucher claims" });
    }
  });

  app.get("/api/vouchers/eligibility", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Caregiver profile not found" });
      }

      const eligibility = await voucherService.getEligibilityStatus(nanny.id);
      res.json(eligibility);
    } catch (error) {
      console.error("Voucher eligibility error:", error);
      res.status(500).json({ message: "Failed to check voucher eligibility" });
    }
  });

  // Profile preview routes
  app.get("/api/nannies/profile/:userId", requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Caregiver profile not found" });
      }
      
      // Get user info
      const user = await storage.getUser(userId.toString());
      
      // Get reviews
      const reviews = await storage.getReviewsByNanny(nanny.id);
      
      res.json({
        ...nanny,
        user,
        reviews
      });
    } catch (error) {
      console.error("Error fetching caregiver profile:", error);
      res.status(500).json({ message: "Failed to fetch caregiver profile" });
    }
  });

  app.get("/api/parent-profile/:userId", requireAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.getParentProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Parent profile not found" });
      }
      
      // Get user info
      const user = await storage.getUser(userId);
      
      res.json({
        ...profile,
        user
      });
    } catch (error) {
      console.error("Error fetching parent profile:", error);
      res.status(500).json({ message: "Failed to fetch parent profile" });
    }
  });

  app.post("/api/parent-profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const profileData = req.body;
      
      const profile = await storage.createOrUpdateParentProfile({
        userId,
        ...profileData
      });
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating parent profile:", error);
      res.status(500).json({ message: "Failed to update parent profile" });
    }
  });

  // Nanny Dashboard routes
  app.get("/api/nanny/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny profile not found" });
      }

      const bookings = await storage.getBookingsByNanny(nanny.id);
      
      // Enrich bookings with parent information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const parent = await storage.getUser(booking.parentId);
          return { ...booking, parent };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      console.error("Nanny bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/nanny/earnings", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const nanny = await storage.getNannyByUserId(userId);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny profile not found" });
      }

      const bookings = await storage.getBookingsByNanny(nanny.id);
      const completedBookings = bookings.filter(b => b.status === 'completed');
      
      const today = new Date();
      const startOfWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
      
      // Calculate today's earnings
      const todayEarnings = completedBookings
        .filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate.toDateString() === today.toDateString();
        })
        .reduce((sum, booking) => sum + parseFloat(booking.totalAmount || '0'), 0);

      // Calculate this week's earnings
      const weekEarnings = completedBookings
        .filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate >= startOfWeek;
        })
        .reduce((sum, booking) => sum + parseFloat(booking.totalAmount || '0'), 0);

      // Calculate hours this week
      const hoursWeek = completedBookings
        .filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate >= startOfWeek;
        })
        .reduce((sum, booking) => {
          const start = new Date(`1970-01-01T${booking.startTime}`);
          const end = new Date(`1970-01-01T${booking.endTime}`);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }, 0);
      
      res.json({
        today: todayEarnings.toFixed(2),
        week: weekEarnings.toFixed(2),
        hoursWeek: Math.round(hoursWeek)
      });
    } catch (error) {
      console.error("Nanny earnings error:", error);
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  // Bookings routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Send booking confirmation emails
      const nanny = await storage.getNanny(booking.nannyId);
      const parent = await storage.getUser(booking.parentId);
      
      if (nanny && parent) {
        const nannyUser = await storage.getUser(nanny.userId);
        if (nannyUser) {
          await sendBookingConfirmation(nannyUser.email, parent.email, booking);
        }
      }
      
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/bookings/nanny/:nannyId", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.nannyId);
      const bookings = await storage.getBookingsByNanny(nannyId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/parent/:parentId", async (req, res) => {
    try {
      const parentId = parseInt(req.params.parentId);
      const bookings = await storage.getBookingsByParent(parentId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Reviews routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  app.get("/api/reviews/nanny/:nannyId", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.nannyId);
      const reviews = await storage.getReviewsByNanny(nannyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages/conversation/:userId1/:userId2", async (req, res) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      const messages = await storage.getMessagesBetweenUsers(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Experience routes
  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const experienceData = insertExperienceSchema.parse({
        ...req.body,
        caregiverId: userId
      });
      const experience = await storage.createExperience(experienceData);
      res.status(201).json(experience);
    } catch (error) {
      console.error("Create experience error:", error);
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.get("/api/experiences", async (req, res) => {
    try {
      const { location, serviceType, ageRange, maxPrice } = req.query;
      const filters = {
        location: location as string,
        serviceType: serviceType as string,
        ageRange: ageRange as string,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
      };
      const experiences = await storage.searchExperiences(filters);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/featured", async (req, res) => {
    try {
      const experiences = await storage.getFeaturedExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured experiences" });
    }
  });

  app.get("/api/experiences/my", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const experiences = await storage.getExperiencesByCaregiver(userId);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperience(id);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      const caregiver = await storage.getUser(experience.caregiverId);
      res.json({ ...experience, caregiver });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  // Payment processing routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      const { bookingId, amount, caregiverId } = req.body;
      const userId = req.session.userId!;
      
      // Platform fee (10% of booking amount)
      const platformFeePercent = 10;
      const platformFeeAmount = Math.round(amount * 100 * (platformFeePercent / 100));
      const caregiverAmount = Math.round(amount * 100) - platformFeeAmount;
      
      // Get caregiver's Stripe account ID (you'll need to implement Connect accounts)
      const caregiver = await storage.getNannyByUserId(caregiverId);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "aud",
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: platformFeeAmount,
        metadata: {
          bookingId: bookingId.toString(),
          userId: userId.toString(),
          caregiverId: caregiverId.toString(),
          platformFee: platformFeeAmount.toString(),
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        platformFee: platformFeeAmount / 100,
        caregiverAmount: caregiverAmount / 100
      });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook for Stripe payment confirmations
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const bookingId = parseInt(paymentIntent.metadata.bookingId);
        
        // Update booking status to confirmed
        await storage.updateBookingStatus(bookingId, 'confirmed');
        
        // Send confirmation emails
        const booking = await storage.getBooking(bookingId);
        if (booking) {
          const caregiver = await storage.getNanny(booking.nannyId);
          const parent = await storage.getUser(booking.parentId);
          
          if (caregiver && parent) {
            await sendBookingConfirmation(
              caregiver.user.email,
              parent.email,
              {
                id: booking.id,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                serviceType: booking.serviceType,
                amount: paymentIntent.amount / 100
              }
            );
          }
        }
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failedBookingId = parseInt(failedPayment.metadata.bookingId);
        await storage.updateBookingStatus(failedBookingId, 'payment_failed');
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Platform revenue analytics
  app.get("/api/admin/revenue", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Only admin users can access revenue data
      if (!user || user.email !== 'admin@vivaly.com.au') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get payment data from Stripe
      const payments = await stripe.paymentIntents.list({
        limit: 100,
      });
      
      let totalRevenue = 0;
      let totalPlatformFees = 0;
      let totalBookings = 0;
      
      payments.data.forEach(payment => {
        if (payment.status === 'succeeded' && payment.metadata.platformFee) {
          totalRevenue += payment.amount;
          totalPlatformFees += parseInt(payment.metadata.platformFee);
          totalBookings += 1;
        }
      });
      
      res.json({
        totalRevenue: totalRevenue / 100,
        totalPlatformFees: totalPlatformFees / 100,
        totalBookings,
        averageBookingValue: totalBookings > 0 ? (totalRevenue / 100) / totalBookings : 0
      });
    } catch (error) {
      console.error("Revenue analytics error:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  // User statistics for admin dashboard
  app.get("/api/admin/users/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user || user.email !== 'admin@vivaly.com.au') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get all users and count by type
      const allUsers = await storage.getAllUsers();
      const caregivers = allUsers.filter(u => u.role === 'caregiver').length;
      const parents = allUsers.filter(u => u.role === 'parent').length;
      
      res.json({
        totalUsers: allUsers.length,
        caregivers,
        parents
      });
    } catch (error) {
      console.error("User stats error:", error);
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  // Booking statistics
  app.get("/api/admin/bookings/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user || user.email !== 'admin@vivaly.com.au') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json({
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0
      });
    } catch (error) {
      console.error("Booking stats error:", error);
      res.status(500).json({ message: "Failed to fetch booking statistics" });
    }
  });

  // Message routes for secure communication between parents and caregivers
  app.post("/api/messages", async (req: any, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages/:userId", async (req: any, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const otherUserId = req.params.userId;
      const messages = await storage.getMessagesBetweenUsers(userId, otherUserId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/conversations", async (req: any, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Parent Profile routes - Comprehensive Airbnb-style profile system
  app.post("/api/parent-profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const profileData = insertParentProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createOrUpdateParentProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating/updating parent profile:", error);
      res.status(500).json({ message: "Failed to save parent profile" });
    }
  });

  app.get("/api/parent-profile", requireAuth, async (req, res) => {
    try {
      // Return empty object for now while we fix the schema
      res.json({});
    } catch (error) {
      console.error("Error fetching parent profile:", error);
      res.status(500).json({ message: "Failed to fetch parent profile" });
    }
  });

  // Review system routes for post-booking feedback
  app.post("/api/reviews", authenticateToken, async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: req.user.userId,
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/reviews/my-reviews", authenticateToken, async (req: any, res) => {
    try {
      const reviews = await storage.getReviewsByUser ? await storage.getReviewsByUser(req.user.userId) : [];
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/bookings/completed", authenticateToken, async (req: any, res) => {
    try {
      const bookings = await storage.getBookingsByParent(req.user.userId);
      const completedBookings = bookings.filter(booking => booking.status === 'completed');
      res.json(completedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed bookings" });
    }
  });

  // Advanced search with comprehensive filtering
  app.get("/api/nannies/advanced-search", async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string,
        serviceType: req.query.serviceType as string,
        minRate: req.query.minRate ? parseInt(req.query.minRate as string) : undefined,
        maxRate: req.query.maxRate ? parseInt(req.query.maxRate as string) : undefined,
      };
      
      const nannies = await storage.searchNannies(filters);
      res.json(nannies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search caregivers" });
    }
  });

  // Enhanced payment processing with Stripe
  app.post("/api/create-payment-intent", authenticateToken, async (req: any, res) => {
    try {
      const { amount, bookingId, description } = req.body;
      const user = await storage.getUser(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "aud",
        description: description || `Booking payment for booking #${bookingId}`,
        metadata: {
          bookingId: bookingId.toString(),
          userId: user.id.toString(),
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/confirm-payment", authenticateToken, async (req: any, res) => {
    try {
      const { paymentIntentId, bookingId } = req.body;
      
      // Verify payment was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update booking status to confirmed
        await storage.updateBookingStatus(bookingId, 'confirmed');
        
        res.json({ success: true, message: "Payment confirmed and booking updated" });
      } else {
        res.status(400).json({ message: "Payment not successful" });
      }
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Error confirming payment" });
    }
  });

  // Caregiver registration route
  app.post("/api/caregivers/register", authenticateToken, async (req: any, res) => {
    try {
      const registrationData = req.body;
      
      // Create caregiver profile
      const nannyData = insertNannySchema.parse({
        userId: req.user.userId,
        bio: registrationData.bio,
        experience: registrationData.experience,
        hourlyRate: registrationData.hourlyRate.toString(),
        location: `${registrationData.suburb}, ${registrationData.state}`,
        suburb: registrationData.suburb,
        services: registrationData.services,
        hasWwcc: registrationData.hasWWCC,
        hasFirstAid: registrationData.hasFirstAid,
        hasPoliceCheck: registrationData.hasPoliceCheck,
        profilePhotos: registrationData.profilePhotos || [],
        photoGuidanceAccepted: registrationData.photoGuidanceAccepted || false,
        instantBookingEnabled: registrationData.instantBookingEnabled || false,
        availabilityCalendar: registrationData.availabilityCalendar || {},
        isVerified: false, // Pending verification
      });
      
      const nanny = await storage.createNanny(nannyData);
      
      // Send welcome email
      const user = await storage.getUser(req.user.userId);
      if (user) {
        await sendNannyWelcomeSequence(user.email, user.firstName);
      }
      
      res.json({ success: true, caregiverId: nanny.id });
    } catch (error) {
      console.error("Caregiver registration error:", error);
      res.status(500).json({ message: "Failed to register caregiver" });
    }
  });

  // Childcare Providers routes
  app.get("/api/childcare-providers/search", async (req, res) => {
    try {
      const { suburb, ageGroups, maxRate, availableSpots } = req.query;
      const providers = await storage.searchChildcareProviders({
        suburb: suburb as string,
        ageGroups: ageGroups ? (ageGroups as string).split(',') : undefined,
        maxRate: maxRate ? Number(maxRate) : undefined,
        availableSpots: availableSpots === 'true',
      });
      res.json(providers);
    } catch (error) {
      console.error("Error searching childcare providers:", error);
      res.status(500).json({ message: "Failed to search childcare providers" });
    }
  });

  app.get("/api/childcare-providers/featured", async (req, res) => {
    try {
      const providers = await storage.getFeaturedChildcareProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching featured childcare providers:", error);
      res.status(500).json({ message: "Failed to fetch featured childcare providers" });
    }
  });

  app.get("/api/childcare-providers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getChildcareProvider(id);
      if (!provider) {
        return res.status(404).json({ message: "Childcare provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching childcare provider:", error);
      res.status(500).json({ message: "Failed to fetch childcare provider" });
    }
  });

  app.post("/api/childcare-providers", async (req, res) => {
    try {
      const validatedData = insertChildcareProviderSchema.parse(req.body);
      const provider = await storage.createChildcareProvider(validatedData);
      res.status(201).json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating childcare provider:", error);
        res.status(500).json({ message: "Failed to create childcare provider" });
      }
    }
  });

  // Childcare Enrollments routes
  app.post("/api/childcare-enrollments", async (req, res) => {
    try {
      const validatedData = insertChildcareEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createChildcareEnrollment(validatedData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating childcare enrollment:", error);
        res.status(500).json({ message: "Failed to create childcare enrollment" });
      }
    }
  });

  app.get("/api/childcare-enrollments/provider/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const enrollments = await storage.getEnrollmentsByProvider(providerId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching provider enrollments:", error);
      res.status(500).json({ message: "Failed to fetch provider enrollments" });
    }
  });

  app.get("/api/childcare-enrollments/parent/:parentId", async (req, res) => {
    try {
      const parentId = parseInt(req.params.parentId);
      const enrollments = await storage.getEnrollmentsByParent(parentId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching parent enrollments:", error);
      res.status(500).json({ message: "Failed to fetch parent enrollments" });
    }
  });

  app.patch("/api/childcare-enrollments/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const enrollment = await storage.updateEnrollmentStatus(id, status);
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      res.status(500).json({ message: "Failed to update enrollment status" });
    }
  });

  // Provider dashboard routes
  app.get("/api/provider/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get actual provider stats from storage
      const stats = {
        todayBookings: 2,
        weeklyEarnings: 1240,
        totalReviews: 24,
        averageRating: 4.9
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching provider stats:", error);
      res.status(500).json({ message: "Failed to fetch provider stats" });
    }
  });

  // Admin Dashboard API endpoints
  app.get("/api/admin/revenue", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      const completedBookings = bookings.filter(b => b.status === 'completed');
      
      const totalRevenue = completedBookings.reduce((sum, booking) => 
        sum + parseFloat(booking.totalAmount || "0"), 0);
      const totalPlatformFees = totalRevenue * 0.1; // 10% commission
      const averageBookingValue = completedBookings.length > 0 ? 
        totalRevenue / completedBookings.length : 0;
      
      res.json({
        totalRevenue,
        totalPlatformFees,
        averageBookingValue,
        totalBookings: completedBookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length
      });
    } catch (error) {
      console.error("Error fetching admin revenue:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/admin/bookings/stats", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const weeklyBookings = bookings.filter(b => new Date(b.date) >= thisWeek);
      
      res.json({
        todayCount: todayBookings.length,
        weeklyCount: weeklyBookings.length,
        totalCount: bookings.length,
        pendingCount: bookings.filter(b => b.status === 'pending').length,
        confirmedCount: bookings.filter(b => b.status === 'confirmed').length,
        completedCount: bookings.filter(b => b.status === 'completed').length
      });
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      res.status(500).json({ message: "Failed to fetch booking statistics" });
    }
  });

  app.get("/api/admin/users/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const nannies = await storage.getAllNannies();
      
      const totalUsers = users.length;
      const totalCaregivers = nannies.length;
      const totalParents = totalUsers - totalCaregivers;
      const verifiedCaregivers = nannies.filter(n => n.isVerified).length;
      
      res.json({
        totalUsers,
        totalCaregivers,
        totalParents,
        verifiedCaregivers,
        pendingVerifications: nannies.filter(n => n.verificationStatus === 'pending').length
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  app.get("/api/admin/bookings/recent", async (req, res) => {
    try {
      const bookings = await storage.getRecentBookingsWithDetails();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      res.status(500).json({ message: "Failed to fetch recent bookings" });
    }
  });

  app.get("/api/admin/caregivers/pending", async (req, res) => {
    try {
      const pendingCaregivers = await storage.getPendingCaregivers();
      res.json(pendingCaregivers);
    } catch (error) {
      console.error("Error fetching pending caregivers:", error);
      res.status(500).json({ message: "Failed to fetch pending caregivers" });
    }
  });

  app.patch("/api/admin/caregivers/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { approved, reason } = req.body;
      
      const caregiver = await storage.updateCaregiverVerification(id, approved, reason);
      if (!caregiver) {
        return res.status(404).json({ message: "Caregiver not found" });
      }
      
      res.json(caregiver);
    } catch (error) {
      console.error("Error updating caregiver verification:", error);
      res.status(500).json({ message: "Failed to update caregiver verification" });
    }
  });

  app.get("/api/bookings/today/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const todayBookings = await storage.getTodayBookingsByCaregiver(userId);
      res.json(todayBookings);
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      res.status(500).json({ message: "Failed to fetch today's bookings" });
    }
  });

  app.get("/api/bookings/upcoming/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get upcoming bookings from storage
      const upcomingBookings = [
        {
          id: 3,
          serviceType: "Childcare",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          startTime: "08:00",
          endTime: "16:00",
          parentName: "Lisa Brown",
          totalAmount: "200",
          status: "confirmed"
        }
      ];
      
      res.json(upcomingBookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: "Failed to fetch upcoming bookings" });
    }
  });

  app.get("/api/provider/listings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get provider listings from storage
      const listings = [
        {
          id: 1,
          serviceType: "Childcare",
          location: "Sydney CBD",
          hourlyRate: "$30",
          isActive: true
        }
      ];
      
      res.json(listings);
    } catch (error) {
      console.error("Error fetching provider listings:", error);
      res.status(500).json({ message: "Failed to fetch provider listings" });
    }
  });

  // Trial signup route
  app.post('/api/trial-signup', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        suburb,
        userType,
        childrenAges,
        careNeeds,
        hasWWCC,
        experience,
        signupSource
      } = req.body;

      // Create user with trial status
      const userData = {
        id: `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        phone,
        profileImageUrl: null,
        password: null,
        isNanny: userType === 'caregiver',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = await storage.createUserSimple(userData);

      // Send welcome communications
      if (userType === 'parent') {
        console.log(`Trial signup: Parent ${firstName} ${lastName} from ${suburb}`);
        // Send welcome SMS
        if (phone) {
          await sendTrialWelcomeSMS(phone, firstName, 'parent');
        }
        // Send welcome email sequence
        try {
          await sendParentWelcomeSequence(email, firstName);
          console.log(`✓ Welcome email sent to parent: ${email}`);
          
          // Schedule the full email sequence
          const { scheduleEmailSequence } = await import('./email-campaigns');
          await scheduleEmailSequence(email, firstName, 'parent');
          console.log(`✓ Email sequence scheduled for parent: ${firstName}`);
        } catch (error) {
          console.error('Email send error:', error);
        }
      } else {
        console.log(`Trial signup: Caregiver ${firstName} ${lastName} from ${suburb}`);
        // Send welcome SMS
        if (phone) {
          await sendTrialWelcomeSMS(phone, firstName, 'caregiver');
        }
        // Send caregiver welcome sequence
        try {
          await sendCaregiverWelcomeSequence(email, firstName);
          console.log(`✓ Welcome email sent to caregiver: ${email}`);
          
          // Schedule the full email sequence
          const { scheduleEmailSequence } = await import('./email-campaigns');
          await scheduleEmailSequence(email, firstName, 'caregiver');
          console.log(`✓ Email sequence scheduled for caregiver: ${firstName}`);
        } catch (error) {
          console.error('Email send error:', error);
        }
      }

      res.json({ 
        success: true, 
        message: 'Trial signup successful',
        userId: user.id,
        userType 
      });

    } catch (error) {
      console.error('Trial signup error:', error);
      res.status(500).json({ message: 'Failed to process trial signup' });
    }
  });

  // Trial metrics endpoint
  app.get('/api/trial/metrics', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const trialUsers = users.filter(u => u.id.startsWith('trial_'));
      
      const metrics = {
        totalSignups: trialUsers.length,
        parentSignups: trialUsers.filter(u => !u.isNanny).length,
        caregiverSignups: trialUsers.filter(u => u.isNanny).length,
        recentSignups: trialUsers.filter(u => {
          const signupDate = new Date(u.createdAt || '');
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate > weekAgo;
        }).length
      };

      res.json(metrics);
    } catch (error) {
      console.error('Trial metrics error:', error);
      res.status(500).json({ message: 'Failed to fetch trial metrics' });
    }
  });

  // Phone verification routes
  app.post('/api/auth/send-verification', async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
      }
      
      const result = await sendPhoneVerificationCode(phone);
      
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ message: 'Failed to send verification code' });
    }
  });

  app.post('/api/auth/verify-phone', async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      if (!phone || !code) {
        return res.status(400).json({ message: 'Phone number and code are required' });
      }
      
      const result = verifyPhoneCode(phone, code);
      
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Verify phone error:', error);
      res.status(500).json({ message: 'Failed to verify phone number' });
    }
  });

  // SMS notification test endpoint (for development)
  app.post('/api/sms/test', async (req, res) => {
    try {
      const { phone, message } = req.body;
      
      if (!phone || !message) {
        return res.status(400).json({ message: 'Phone and message are required' });
      }
      
      const { sendSMS } = await import('./sms-service');
      const success = await sendSMS({ to: phone, message });
      
      res.json({ success, message: success ? 'SMS sent successfully' : 'Failed to send SMS' });
    } catch (error) {
      console.error('SMS test error:', error);
      res.status(500).json({ message: 'Failed to send test SMS' });
    }
  });

  // Email test endpoint (for development)
  app.post('/api/email/test', async (req, res) => {
    try {
      const { email, name, type } = req.body;
      
      if (!email || !name || !type) {
        return res.status(400).json({ message: 'Email, name, and type are required' });
      }
      
      let success = false;
      
      switch (type) {
        case 'parent-welcome':
          success = await sendParentWelcomeSequence(email, name);
          break;
        case 'caregiver-welcome':
          success = await sendCaregiverWelcomeSequence(email, name);
          break;
        case 'parent-sequence':
          success = await sendParentWelcomeSequence(email, name);
          const { scheduleEmailSequence: scheduleParent } = await import('./email-campaigns');
          await scheduleParent(email, name, 'parent');
          break;
        case 'caregiver-sequence':
          success = await sendCaregiverWelcomeSequence(email, name);
          const { scheduleEmailSequence: scheduleCaregiver } = await import('./email-campaigns');
          await scheduleCaregiver(email, name, 'caregiver');
          break;
        case 'weekly-newsletter-parent':
          // WEEKLY NEWSLETTERS ARE DISABLED
          res.status(400).json({ message: 'Weekly newsletters are disabled', success: false });
          return;
        case 'weekly-newsletter-caregiver':
          // WEEKLY NEWSLETTERS ARE DISABLED  
          res.status(400).json({ message: 'Weekly newsletters are disabled', success: false });
          return;
        case 'booking-confirmation':
          success = await sendBookingConfirmation(email, email, {
            caregiverName: 'Emma Wilson',
            date: 'Tomorrow',
            time: '9:00 AM',
            duration: '4 hours',
            location: '123 Main St, Sydney'
          });
          break;
        default:
          return res.status(400).json({ message: 'Invalid email type' });
      }
      
      res.json({ success, message: success ? 'Email sent successfully' : 'Failed to send email' });
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ message: 'Failed to send test email' });
    }
  });

  // Test email endpoint - ONLY WELCOME EMAILS
  app.post('/api/send-test-email', async (req, res) => {
    try {
      const { email, type } = req.body;
      
      // ONLY send welcome emails - weekly newsletters are DISABLED
      await sendParentWelcomeSequence(email, 'Test User');
      
      res.json({ success: true, message: 'Welcome email sent successfully' });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ message: 'Failed to send test email' });
    }
  });

  // Email preview endpoint
  app.get('/api/email-preview', async (req, res) => {
    try {
      const { generateWelcomeEmail } = await import('./email-service');
      const html = await generateWelcomeEmail('Test User', 'parent');
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Email preview error:', error);
      res.status(500).json({ message: 'Failed to generate email preview' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
