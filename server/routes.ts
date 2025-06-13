import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { insertUserSchema, insertJobSchema, insertApplicationSchema, type InsertUser } from "@shared/schema";
import { requireAuth } from "./auth-middleware";

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
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

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

  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

  // Job posting routes
  app.post('/api/postJob', requireAuth, async (req, res) => {
    try {
      const { startDate, numChildren, rate, hoursPerWeek, description } = req.body;
      const parentId = req.session.userId;

      if (!startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jobId = randomUUID();
      
      const job = await storage.createJob({
        id: jobId,
        parentId,
        startDate,
        numChildren: parseInt(numChildren),
        rate: parseFloat(rate),
        hoursPerWeek: parseInt(hoursPerWeek),
        description
      });

      res.json({ message: "Job posted!", job });
    } catch (error) {
      console.error("Post job error:", error);
      res.status(500).json({ message: "Failed to post job" });
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

  app.post('/api/jobs/:jobId/apply', requireAuth, async (req, res) => {
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
      const { jobId, caregiverProfile } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: caregiverProfile || null
      });

      res.json({ message: "Application sent!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}