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

  // TEST route to confirm server is working
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

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

  // Registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      console.log("Registration body:", req.body);

      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.errors);
        return res.status(400).json({
          message: "Invalid input",
          details: validationResult.error.errors,
        });
      }

      const { email, password, firstName, lastName, phone, isNanny, isCaregiver } = validationResult.data;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if user exists
      const existingUser = await storage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Determine user roles based on registration
      let roles = ["parent"]; // Default role
      if (isNanny || isCaregiver) {
        roles = ["caregiver"];
      }

      // Create new user
      const newUser: InsertUser = {
        id: randomUUID(),
        email: normalizedEmail,
        firstName,
        lastName,
        phone: phone || null,
        password: hashedPassword,
        roles,
        activeRole: roles[0],
        isNanny: isNanny || false,
      };

      const user = await storage.createUser(newUser);
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
        req.session.activeRole = user.activeRole || "parent";
      }

      console.log("User created successfully:", { id: user.id, email: user.email });

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          activeRole: user.activeRole,
          isNanny: user.isNanny,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error during registration" });
    }
  });

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      if (!user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      if (req.session) {
        req.session.userId = user.id;
        req.session.activeRole = user.activeRole || "parent";
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          roles: user.roles,
          activeRole: user.activeRole,
          isNanny: user.isNanny,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error during login" });
    }
  });

  // Get current user
  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        roles: user.roles,
        activeRole: user.activeRole,
        isNanny: user.isNanny,
        phone: user.phone,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie('vivaly.sid');
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });

  const server = createServer(app);
  return server;
}
