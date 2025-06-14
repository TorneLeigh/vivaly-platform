import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { insertUserSchema, insertJobSchema, insertApplicationSchema, type InsertUser } from "@shared/schema";
import { requireAuth, requireRole } from "./auth-middleware";
import { sendPasswordResetEmail } from "./email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      console.log("Registration body:", req.body);

      // Validate request body using Zod schema
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.errors);
        return res.status(400).json({ 
          message: "Invalid input", 
          details: validationResult.error.errors 
        });
      }

      const userData = validationResult.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create new user with validated data
      const cleanUserData = {
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone || null,
        isNanny: userData.isNanny || false,
        allowCaregiverMessages: true
      };

      const user = await storage.createUser(cleanUserData);

      // Store user ID in session
      req.session.userId = user.id;

      res.json({ 
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isNanny: user.isNanny
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Account creation failed. Please try again." });
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

  // Password reset request
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account with this email exists, a reset link has been sent." });
      }

      // Generate reset token
      const resetToken = randomUUID();
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await storage.updateUserResetToken(user.id, resetToken, resetTokenExpires);

      // Send reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (!emailSent) {
        console.error("Failed to send password reset email to:", email);
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.json({ message: "If an account with this email exists, a reset link has been sent." });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
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

      // Create automated message to parent
      const message = await storage.createMessage({
        fromUserId: caregiverId,
        toUserId: job.parentId,
        message: `Hi, I'm interested in your job post titled "${job.title || 'Childcare Position'}". Here's my profile.`,
        jobId: jobId
      });

      res.json({ success: true, message: "Application sent!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}