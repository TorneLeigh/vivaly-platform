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

      // Send admin notification email for new caregiver signup
      try {
        const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'info@tornevelk.com';
        await sendEmail(
          adminEmail,
          'New Caregiver Signup on VIVALY',
          `<h3>New Caregiver Registration</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>User ID:</strong> ${user.id}</p>`
        );
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

  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userRoles = user.roles || ["parent"];
      const activeRole = req.session.activeRole || userRoles[0];

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
        activeRole: activeRole,
        isNanny: user.isNanny
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
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

  app.get('/api/jobs', requireAuth, async (req, res) => {
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
      const { caregiverProfile } = req.body;
      const caregiverId = req.session.userId;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: caregiverProfile || null
      });

      res.json({ message: "Application submitted!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  // Get single job endpoint
  app.get('/api/jobs/:jobId', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await storage.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ message: "Failed to get job" });
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

  const httpServer = createServer(app);
  return httpServer;
}