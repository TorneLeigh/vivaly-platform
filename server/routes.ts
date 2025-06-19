import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { z } from "zod";
import { insertUserSchema, insertJobSchema, insertApplicationSchema, type InsertUser } from "@shared/schema";
import { requireAuth, requireRole } from "./auth-middleware";
import { sendPasswordResetEmail } from "./email-service";
import { sendEmail } from "./lib/sendEmail";
import { sendUserRegistrationNotification, sendDocumentSubmissionNotification, sendTestEmails } from "./email-notifications";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const upload = multer({ dest: "uploads/" });

  // Serve uploaded files statically
  const staticMiddleware = express.static("uploads");
  app.use("/uploads", staticMiddleware);

  // Video upload endpoint
  app.post("/api/upload-intro-video", requireAuth, upload.single("video"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No video uploaded" });

      const ext = path.extname(file.originalname);
      const newPath = path.join("uploads", `${file.filename}${ext}`);
      fs.renameSync(file.path, newPath);

      const videoUrl = `/uploads/${file.filename}${ext}`;

      return res.json({ url: videoUrl });
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Document upload endpoint for police check and WWCC
  app.post("/api/upload-document", requireAuth, upload.single("document"), async (req, res) => {
    try {
      const file = req.file;
      const { documentType } = req.body;
      
      if (!file) return res.status(400).json({ message: "No document uploaded" });
      if (!documentType || !['police_check', 'wwcc'].includes(documentType)) {
        return res.status(400).json({ message: "Invalid document type" });
      }

      const userId = req.session.userId;
      const user = await storage.getUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const ext = path.extname(file.originalname);
      const newPath = path.join("uploads", `${file.filename}${ext}`);
      fs.renameSync(file.path, newPath);

      const documentUrl = `/uploads/${file.filename}${ext}`;

      // Send admin notification for document submission
      try {
        await sendDocumentSubmissionNotification({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          documentType: documentType as 'police_check' | 'wwcc',
          submissionDate: new Date(),
          documentUrl: `${req.protocol}://${req.get('host')}${documentUrl}`
        });
      } catch (emailError) {
        console.warn("Failed to send document submission notification:", emailError);
      }

      return res.json({ url: documentUrl });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Photo upload endpoint for profile photos
  app.post("/api/upload-profile-photo", requireAuth, upload.single("photo"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No photo uploaded" });

      // Validate file type
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        fs.unlinkSync(file.path); // Clean up the uploaded file
        return res.status(400).json({ message: "Invalid file type. Only JPG, PNG, GIF, and WebP files are allowed." });
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
      }

      const newFilename = `${randomUUID()}${ext}`;
      const newPath = path.join("uploads", newFilename);
      fs.renameSync(file.path, newPath);

      const photoUrl = `/uploads/${newFilename}`;

      // Update user's profile photo in database
      const userId = req.session.userId;
      const user = await storage.getUserById(userId);
      if (user) {
        await storage.updateUserProfilePhoto(userId, photoUrl);
      }

      return res.json({ url: photoUrl, message: "Photo uploaded successfully" });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Get user profile photos
  app.get("/api/profile-photos", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user's profile photos (including main profile photo and any additional photos)
      const photos = [];
      if (user.profileImageUrl) {
        photos.push({
          id: 'main',
          url: user.profileImageUrl,
          isMain: true
        });
      }

      return res.json(photos);
    } catch (error) {
      console.error("Get profile photos error:", error);
      res.status(500).json({ message: "Failed to get profile photos" });
    }
  });

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      console.log("Registration body:", req.body);

      // Validate request body using the shared insertUserSchema
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.errors);
        return res.status(400).json({
          message: "Invalid input",
          details: validationResult.error.errors,
        });
      }

      const userData = validationResult.data;

      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        // Determine the role being requested
        const requestedRole = userData.isNanny ? "caregiver" : "parent";
        
        // Check if user already has this role
        const existingRoles = existingUser.roles || ["parent"];
        const hasRole = existingRoles.includes(requestedRole);
        
        if (hasRole) {
          // User already has this role, just log them in
          req.session.userId = existingUser.id;
          req.session.activeRole = requestedRole;
          
          await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          
          return res.json({
            message: `Welcome back! You already have a ${requestedRole} account.`,
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            roles: existingRoles,
            activeRole: requestedRole,
            isNanny: existingUser.isNanny
          });
        }
        
        // Add new role to existing user
        const updatedRoles = existingRoles.includes(requestedRole) 
          ? existingRoles 
          : [...existingRoles, requestedRole];
        const updatedUser = await storage.updateUserRoles(existingUser.id, updatedRoles);
        
        // Send admin notification for role addition
        if (!existingRoles.includes(requestedRole)) {
          try {
            const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'info@tornevelk.com';
            await sendEmail(
              adminEmail,
              `User Added ${requestedRole} Role on VIVALY`,
              `<h3>Existing User Added New Role</h3>
              <p><strong>Name:</strong> ${existingUser.firstName} ${existingUser.lastName}</p>
              <p><strong>Email:</strong> ${existingUser.email}</p>
              <p><strong>Added Role:</strong> ${requestedRole}</p>
              <p><strong>Previous Roles:</strong> ${existingRoles.join(', ')}</p>
              <p><strong>Current Roles:</strong> ${updatedRoles.join(', ')}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
              <p><strong>User ID:</strong> ${existingUser.id}</p>
              <hr>
              <p><small>Login to VIVALY admin to manage this user</small></p>`
            );
          } catch (emailError) {
            console.warn("Failed to send admin role addition notification:", emailError);
          }
        }
        
        // Set session for the user
        req.session.userId = existingUser.id;
        req.session.activeRole = requestedRole;
        
        // Ensure session persistence
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        return res.json({
          message: `Added ${requestedRole} role to your account.`,
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          roles: updatedRoles,
          activeRole: requestedRole,
          isNanny: existingUser.isNanny || requestedRole === "caregiver"
        });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Determine user roles based on isNanny flag
      const userRoles = userData.isNanny ? ["caregiver"] : ["parent"];
      
      const cleanUserData = {
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone,
        isNanny: userData.isNanny || false,
        roles: userRoles,
        allowCaregiverMessages: true,
      };

      const user = await storage.createUser(cleanUserData);

      req.session.userId = user.id;
      req.session.activeRole = userRoles[0]; // Set default active role

      // Send admin notification email for new user signup
      try {
        const role = userData.isNanny ? 'caregiver' : 'parent';
        await sendUserRegistrationNotification({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: role,
          registrationDate: new Date()
        });
      } catch (emailError) {
        console.warn("Failed to send admin notification email:", emailError);
      }

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
        activeRole: userRoles[0],
        isNanny: user.isNanny,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Account creation failed. Please try again." });
    }
  });

  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalizedEmail);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account exists, a reset email will be sent" });
      }

      // Generate reset token and expiry
      const resetToken = randomUUID();
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store reset token (in a real app, you'd store this in the database)
      // For now, we'll just send the email
      
      try {
        await sendEmail(
          normalizedEmail,
          'Reset Your VIVALY Password',
          `
          <h2>Reset Your Password</h2>
          <p>Hi ${user.firstName},</p>
          <p>You requested to reset your password for your VIVALY account.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" 
             style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
             Reset Password
          </a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The VIVALY Team</p>
          `
        );
      } catch (emailError) {
        console.warn("Failed to send password reset email:", emailError);
      }

      res.json({ message: "If an account exists, a reset email will be sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required" });
      }

      // Normalize email input
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await storage.getUserByEmail(normalizedEmail);
      if (!user || !user.password) {
        // Add small delay to slow brute-force attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        // Add small delay to slow brute-force attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get user roles (default to parent if no roles set)
      const userRoles = user.roles || ["parent"];
      
      // Check if user has the requested role
      if (!userRoles.includes(role)) {
        return res.status(403).json({ message: `User does not have role: ${role}` });
      }

      // Store user ID and active role in session
      req.session.userId = user.id;
      req.session.activeRole = role;

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Audit log successful login
      console.info(`User ${user.id} (${user.email}) logged in with role: ${role}`);

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
        activeRole: role,
        isNanny: user.isNanny
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
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

  // Get current user endpoint
  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      // `requireAuth` has already loaded the user onto req.user
      const user = (req as any).user;
      const activeRole = req.session.activeRole || user.roles?.[0] || 'parent';
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles || ['parent'],
        activeRole: activeRole,
        isNanny: user.isNanny || false,
      });
    } catch (err) {
      console.error('Error in /api/auth/user:', err);
      res.status(500).json({ message: 'Could not fetch user' });
    }
  });

  // Role switching route
  app.post('/api/auth/switch-role', async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      // Get user to verify role access
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userRoles = user.roles || ["parent"];
      
      // Check if user has requested role
      if (!userRoles.includes(role)) {
        return res.status(403).json({ message: `User does not have role: ${role}` });
      }

      // Update active role in session
      req.session.activeRole = role;

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Audit log successful role switch
      console.info(`User ${userId} (${user.email}) switched to role: ${role}`);

      const response = { 
        activeRole: role,
        roles: userRoles 
      };
      
      res.json(response);
    } catch (error) {
      console.error("Switch role error:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  // Password reset request with Resend
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalizedEmail);
      
      // Always return success to prevent email enumeration attacks
      if (!user) {
        return res.json({ message: "If an account exists, a reset email will be sent" });
      }

      // Generate reset token
      const resetToken = randomUUID();
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await storage.updateUserResetToken(user.id, resetToken, resetTokenExpires);

      // Create reset link - use current domain
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://vivaly.com.au' : `${req.protocol}://${req.get('host')}`;
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      try {
        await sendEmail(
          normalizedEmail,
          'Reset your VIVALY password',
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">Reset your VIVALY password</h2>
            <p>Hi ${user.firstName},</p>
            <p>You requested to reset your password for your VIVALY account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetLink}" style="color: #000; text-decoration: underline;">${resetLink}</a></p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The VIVALY Team</p>
          </div>`
        );
        
        console.log(`Password reset email sent to: ${normalizedEmail}`);
        res.json({ message: "If an account exists, a reset email will be sent" });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't reveal email sending failure to prevent enumeration
        res.json({ message: "If an account exists, a reset email will be sent" });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to process reset request" });
    }
  });

  // Password reset confirmation
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetTokenExpires || new Date() > user.resetTokenExpires) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearUserResetToken(user.id);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Get single job by ID (public endpoint for job details)
  app.get('/api/jobs/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get parent profile for the job
      const parentProfile = await storage.getUser(job.parentId);
      
      res.json({
        ...job,
        parentProfile: parentProfile ? {
          firstName: parentProfile.firstName,
          lastName: parentProfile.lastName,
          profilePhoto: parentProfile.profileImageUrl,
          suburb: null
        } : null
      });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Messages routes
  app.get('/api/messages', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post('/api/messages', requireAuth, async (req, res) => {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.session.userId;

      if (!receiverId || !content) {
        return res.status(400).json({ message: "Receiver ID and content required" });
      }

      const message = await storage.createMessage({
        senderId,
        receiverId,
        content
      });

      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Users routes
  app.get('/api/users', requireAuth, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isNanny: user.isNanny
      })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Job posting routes (parent-only)
  app.post('/api/postJob', requireRole('parent'), async (req, res) => {
    try {
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;
      const parentId = req.session.userId;

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jobId = randomUUID();
      
      const job = await storage.createJob({
        id: jobId,
        parentId,
        title,
        startDate,
        numChildren: parseInt(numChildren),
        rate: rate,
        hoursPerWeek: parseInt(hoursPerWeek),
        description,
        location: location || null,
        suburb: suburb || null
      });

      res.json({ success: true, message: "Job posted!", job });
    } catch (error) {
      console.error("Post job error:", error);
      res.status(500).json({ success: false, message: "Failed to post job" });
    }
  });

  // RESTful job creation endpoint
  app.post('/api/jobs', requireRole('parent'), async (req, res) => {
    try {
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;
      const parentId = req.session.userId;

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jobId = randomUUID();
      
      const job = await storage.createJob({
        id: jobId,
        parentId,
        title,
        startDate,
        numChildren: parseInt(numChildren),
        rate: rate,
        hoursPerWeek: parseInt(hoursPerWeek),
        description,
        location: location || null,
        suburb: suburb || null
      });

      res.json({ success: true, message: "Job posted!", job });
    } catch (error) {
      console.error("Post job error:", error);
      res.status(500).json({ success: false, message: "Failed to post job" });
    }
  });

  // Get all jobs - public endpoint for browsing
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.get('/api/jobs/my', requireAuth, async (req, res) => {
    try {
      const parentId = req.session.userId;
      const jobs = await storage.getJobsByParent(parentId);
      res.json(jobs);
    } catch (error) {
      console.error("Get my jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.post('/api/jobs/:jobId/apply', requireRole('caregiver'), async (req, res) => {
    try {
      const { jobId } = req.params;
      const caregiverId = req.session.userId;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get caregiver's profile information
      const caregiver = await storage.getUserById(caregiverId);
      const caregiverProfile = await storage.getCaregiverProfile(caregiverId);

      // Create the application
      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: null
      });

      // Automatically send a message to the parent with caregiver's profile (contact info filtered)
      const profileMessage = `Hi! I'm interested in your childcare position "${job.title}". Here's my profile:

👋 About Me: ${caregiver.firstName} ${caregiver.lastName}
📍 Location: ${caregiverProfile?.suburb || 'Sydney, NSW'}
💰 Rate: $${caregiverProfile?.hourlyRate || '35'}/hour
⭐ Rating: ${caregiverProfile?.rating || 'New'} (${caregiverProfile?.reviewCount || 0} reviews)
${caregiverProfile?.isVerified ? '✅ Verified profile' : ''}
${caregiverProfile?.hasPoliceCheck ? '🛡️ Police check completed' : ''}

📝 Experience: ${caregiverProfile?.experience || 'Passionate about childcare'}

${caregiverProfile?.bio || 'Looking forward to caring for your family!'}

I'd love to discuss this opportunity further through the platform messaging system. Contact details will be shared once a booking is confirmed and paid for security.`;

      // Send the automated message
      await storage.sendMessage({
        senderId: caregiverId,
        receiverId: job.parentId,
        content: profileMessage,
        timestamp: new Date()
      });

      res.json({ message: "Profile sent to family!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to contact family" });
    }
  });



  // Update job endpoint
  app.put('/api/jobs/:jobId', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const userId = req.session.userId;
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only allow parent who posted the job to update it
      if (job.parentId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this job" });
      }

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const updatedJob = await storage.updateJob(jobId, {
        title,
        startDate,
        numChildren,
        rate,
        hoursPerWeek,
        description,
        location: location || null,
        suburb: suburb || null
      });

      res.json(updatedJob);
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });



  // Delete job endpoint
  app.delete('/api/jobs/:jobId', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const userId = req.session.userId;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only allow parent who posted the job to delete it
      if (job.parentId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this job" });
      }

      await storage.deleteJob(jobId);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Delete job error:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  app.get('/api/jobs/:jobId/applications', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const applications = await storage.getApplicationsByJob(jobId);
      res.json(applications);
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  app.get('/api/applications/my', requireAuth, async (req, res) => {
    try {
      const caregiverId = req.session.userId;
      const applications = await storage.getApplicationsByCaregiver(caregiverId);
      res.json(applications);
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  // Additional job board routes
  app.get('/api/getJobs', async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.post('/api/applyToJob', requireAuth, async (req, res) => {
    try {
      const caregiverId = req.session.userId;
      const { jobId } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const caregiver = await storage.getUser(caregiverId);
      if (!caregiver) {
        return res.status(404).json({ message: "Caregiver not found" });
      }

      // Create application
      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: null
      });

      // Create automated message to parent with caregiver profile
      const profileMessage = `Hi, I'm interested in your job post titled "${job.title || 'Childcare Position'}".

Here's my profile:
👋 ${caregiver.firstName} ${caregiver.lastName}
📧 ${caregiver.email}
📱 ${caregiver.phone || 'Phone not provided'}

I'd love to discuss this opportunity with you. Please feel free to reach out!`;

      const message = await storage.createMessage({
        content: profileMessage,
        senderId: caregiverId,
        receiverId: job.parentId
      });

      res.json({ success: true, message: "Application sent!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  // Get caregiver bookings with enhanced data
  app.get('/api/caregiver/bookings', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const bookings = await storage.getUserBookings(userId);
      
      // Enhance bookings with job and parent details
      const enhancedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const job = await storage.getJob(booking.jobId);
          const parent = await storage.getUser(booking.parentId);
          
          return {
            ...booking,
            job: job ? {
              title: job.title,
              location: job.location,
              description: job.description,
              childrenAges: job.childrenAges || []
            } : null,
            parent: parent ? {
              firstName: parent.firstName,
              lastName: parent.lastName,
              phone: parent.phone,
              email: parent.email
            } : null
          };
        })
      );

      res.json(enhancedBookings);
    } catch (error) {
      console.error("Get caregiver bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.patch('/api/bookings/:bookingId/status', requireAuth, async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await storage.updateBookingStatus(bookingId, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Update booking status error:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Get caregiver's applications
  app.get("/api/applications/my", async (req, res) => {
    try {
      const caregiverId = req.session?.user?.id;
      if (!caregiverId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const applications = await storage.getApplicationsByCaregiver(caregiverId);
      res.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get messages between users
  app.get("/api/getMessages", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const otherUserId = req.query.otherUserId as string;

    if (!otherUserId) {
      return res.status(400).json({ message: "Missing otherUserId" });
    }

    try {
      const messages = await storage.getMessagesBetweenUsers(userId as string, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post("/api/sendMessage", requireAuth, async (req, res) => {
    const senderId = req.session.userId;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Missing receiverId or text" });
    }

    try {
      const message = await storage.sendMessage({
        senderId: senderId as string,
        receiverId,
        text,
        timestamp: new Date()
      });
      res.json({ success: true, message });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get conversations list
  app.get("/api/conversations", requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
      const conversations = await storage.getConversations(userId as string);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Parent's bookings
  app.get("/api/parent/bookings", requireAuth, async (req, res) => {
    const parentId = req.session.userId;
    try {
      const bookings = await storage.getParentBookings(parentId as string);
      res.json(bookings);
    } catch (error) {
      console.error("Get parent bookings error:", error);
      res.status(500).json({ message: "Failed to fetch parent bookings" });
    }
  });

  // Caregiver's bookings
  app.get("/api/caregiver/bookings", requireAuth, async (req, res) => {
    const caregiverId = req.session.userId;
    try {
      const bookings = await storage.getCaregiverBookings(caregiverId as string);
      res.json(bookings);
    } catch (error) {
      console.error("Get caregiver bookings error:", error);
      res.status(500).json({ message: "Failed to fetch caregiver bookings" });
    }
  });

  // Test all email notifications endpoint
  app.post("/api/test-notifications", async (req, res) => {
    try {
      const result = await sendTestEmails();
      res.json(result);
    } catch (error: any) {
      console.error("Test notifications failed:", error);
      console.error("SendGrid API key status:", process.env.SENDGRID_API_KEY ? "Present" : "Missing");
      
      // Log detailed SendGrid error
      if (error.response?.body) {
        console.error("SendGrid error body:", JSON.stringify(error.response.body, null, 2));
      }
      
      res.status(500).json({ 
        message: "Failed to send test notifications", 
        error: error.message,
        details: error.response?.body || "No additional details"
      });
    }
  });

  // Simple test endpoint to verify SendGrid configuration
  app.post("/api/test-sendgrid", async (req, res) => {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: 'info@tornevelk.com',
        from: 'info@tornevelk.com',
        subject: 'SendGrid Test',
        text: 'This is a test email to verify SendGrid configuration.',
        html: '<p>This is a test email to verify SendGrid configuration.</p>',
      };

      await sgMail.send(msg);
      res.json({ message: "SendGrid test email sent successfully" });
    } catch (error: any) {
      console.error("SendGrid test failed:", error);
      console.error("Error details:", error.response?.body);
      
      res.status(500).json({ 
        message: "SendGrid test failed", 
        error: error.message,
        details: error.response?.body || "No additional details"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}