import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { requireAuth } from "./auth-middleware";
import { 
  insertUserSchema, insertNannySchema, insertBookingSchema, 
  insertReviewSchema, insertMessageSchema, insertExperienceSchema 
} from "@shared/schema";
import { sendNannyWelcomeSequence, sendBookingConfirmation, sendNewNannyAlert } from "./email-service";
import { wwccVerificationService } from "./wwcc-verification-service";
import { voucherService } from "./voucher-service";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get('/api/auth/user', async (req, res) => {
    // Check session for authenticated user
    const userId = req.session?.userId;
    if (userId) {
      try {
        const user = await storage.getUser(userId);
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
      }
    } else {
      res.json(null);
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    try {
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
      
      // Store user ID in session
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login error" });
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

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
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

  const httpServer = createServer(app);
  return httpServer;
}
