# VIVALY - Complete Backend Code Export

## Server Structure
```
server/
├── index.ts          # Main server entry point
├── routes.ts          # All API routes and endpoints
├── storage.ts         # Database storage interface
├── lib/
│   ├── sendEmail.ts   # Email service configuration
│   └── auth.ts        # Authentication utilities
└── vite.ts           # Vite development server
```

## 1. Server Entry Point - server/index.ts

```typescript
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import "./types";

const app = express();

// Trust proxy for rate limiting in hosted environments
app.set('trust proxy', 1);

// Sentry initialization for error monitoring
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com", "https://replit.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:", "https://api.stripe.com"],
      fontSrc: ["'self'", "data:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
}));

// Body parsers and cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to authentication routes
app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);
app.use('/api/auth/switch-role', authLimiter);

// Health check endpoint (before session middleware to avoid session overhead)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve uploaded assets
app.use('/attached_assets', express.static('attached_assets'));

// Serve public images
app.use('/images', express.static('public/images'));

// Serve public static files (including logo)
app.use(express.static('public'));

// Session configuration with PostgreSQL store
const PgSession = connectPg(session);
const pgStore = new PgSession({
  conString: process.env.DATABASE_URL,
  tableName: 'sessions',
  createTableIfMissing: true
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  store: pgStore,
  resave: false,
  saveUninitialized: false,
  name: 'vivaly.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax'
  },
  rolling: true // Extend session on activity
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Sentry error handler would go here if using correct Sentry version
  // app.use(Sentry.Handlers.errorHandler());

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
```

## 2. Main Routes File - server/routes.ts (Part 1/3)

```typescript
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
        const updatedRoles = [...existingRoles, requestedRole];
        await storage.updateUserRoles(existingUser.id, updatedRoles);
        
        // Log them in with the new role
        req.session.userId = existingUser.id;
        req.session.activeRole = requestedRole;
        
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        // Send email notification
        try {
          const roleType = requestedRole === 'caregiver' ? 'Caregiver' : 'Parent';
          await sendEmail(
            "info@tornevelk.com",
            `New ${roleType} Role Added on VIVALY`,
            `<h3>Role Addition Notification</h3>
            <p>An existing user has added a new role to their VIVALY account:</p>
            <ul>
              <li><strong>Name:</strong> ${existingUser.firstName} ${existingUser.lastName}</li>
              <li><strong>Email:</strong> ${existingUser.email}</li>
              <li><strong>New Role:</strong> ${roleType}</li>
              <li><strong>Existing Roles:</strong> ${existingRoles.join(', ')}</li>
              <li><strong>All Roles:</strong> ${updatedRoles.join(', ')}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</li>
            </ul>
            <hr>
            <p><small>VIVALY Platform - Australia's trusted childcare marketplace</small></p>`
          );
          console.log(`Email sent via SendGrid to: info@tornevelk.com - Subject: New ${roleType} Role Added on VIVALY`);
        } catch (emailError) {
          console.error("Failed to send role addition notification email:", emailError);
        }
        
        return res.json({
          message: `${requestedRole} role added successfully!`,
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          roles: updatedRoles,
          activeRole: requestedRole,
          isNanny: userData.isNanny
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Determine user role
      const userRole = userData.isNanny ? "caregiver" : "parent";
      
      // Create new user with properly structured data
      const cleanUserData: InsertUser = {
        id: `user_${Date.now()}_${randomUUID().slice(0, 6)}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        password: hashedPassword,
        roles: [userRole],
        isNanny: userData.isNanny || false,
        allowCaregiverMessages: true,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Inserting user with clean data:", {
        ...cleanUserData,
        password: '[HIDDEN]'
      });

      const user = await storage.createUser(cleanUserData);

      // Set session
      req.session.userId = user.id;
      req.session.activeRole = userRole;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Send email notification
      try {
        const roleType = userRole === 'caregiver' ? 'Caregiver' : 'Parent';
        await sendEmail(
          "info@tornevelk.com",
          `New ${roleType} Signup on VIVALY`,
          `<h3>New User Registration</h3>
          <p>A new ${roleType.toLowerCase()} has signed up on VIVALY:</p>
          <ul>
            <li><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.phone || 'Not provided'}</li>
            <li><strong>Role:</strong> ${roleType}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</li>
          </ul>
          <hr>
          <p><small>VIVALY Platform - Australia's trusted childcare marketplace</small></p>`
        );
        console.log(`Email sent via SendGrid to: info@tornevelk.com - Subject: New ${roleType} Signup on VIVALY`);
      } catch (emailError) {
        console.error("Failed to send signup notification email:", emailError);
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: [userRole],
        activeRole: userRole,
        isNanny: user.isNanny
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
```