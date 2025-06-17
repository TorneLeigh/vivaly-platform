# VIVALY Complete Server Code Export

This document contains all the backend server code for the VIVALY platform. Send this entire content to ChatGPT to help debug the navigation and routing issues.

## Issues to Fix:
1. Mobile job board navigation returns blank page for caregivers
2. Browse jobs page shows empty content
3. Caregiver schedule page doesn't display calendar properly
4. Mobile header navigation not working correctly

---

## File Structure
```
server/
├── index.ts
├── routes.ts
├── storage.ts
├── auth-middleware.ts
├── email-service.ts
├── lib/
│   └── sendEmail.ts
└── vite.ts
```

---

## 1. SERVER ENTRY POINT (server/index.ts)

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

app.set('trust proxy', 1);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);
app.use('/api/auth/switch-role', authLimiter);

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/attached_assets', express.static('attached_assets'));
app.use('/images', express.static('public/images'));
app.use(express.static('public'));

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
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  },
  rolling: true
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

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

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

---

## 2. EMAIL SERVICE (server/lib/sendEmail.ts)

```typescript
import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Resend as fallback
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`Attempting to send email to: ${to} - Subject: ${subject}`);
  
  // Try SendGrid first (primary service)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to,
        from: 'noreply@vivaly.com.au',
        subject,
        html,
      };
      
      const response = await sgMail.send(msg);
      console.log('Email sent via SendGrid to:', to, '- Subject:', subject);
      console.log('SendGrid response:', response[0].statusCode);
      return { success: true, service: 'SendGrid', response };
    } catch (error) {
      console.error('SendGrid email failed:', error);
      // Continue to try Resend as fallback
    }
  }
  
  // Fallback to Resend
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'noreply@vivaly.com.au',
        to,
        subject,
        html,
      });
      
      console.log('Email sent via Resend to:', to, '- Subject:', subject);
      console.log('Resend response:', response);
      return { success: true, service: 'Resend', response };
    } catch (error) {
      console.error('Resend email failed:', error);
      throw new Error(`Failed to send email via both SendGrid and Resend: ${error}`);
    }
  }
  
  throw new Error('No email service configured');
}
```

---

## 3. AUTHENTICATION MIDDLEWARE (server/auth-middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.session.activeRole !== role) {
      return res.status(403).json({ message: `${role} role required` });
    }
    
    next();
  };
}
```

---

## 4. MAIN ROUTES FILE (server/routes.ts) - COMPLETE

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
  // Create uploads directory
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const upload = multer({ dest: "uploads/" });
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

      const userData = validationResult.data;
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        const requestedRole = userData.isNanny ? "caregiver" : "parent";
        const existingRoles = existingUser.roles || ["parent"];
        const hasRole = existingRoles.includes(requestedRole);
        
        if (hasRole) {
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
        
        const updatedRoles = [...existingRoles, requestedRole];
        await storage.updateUserRoles(existingUser.id, updatedRoles);
        
        req.session.userId = existingUser.id;
        req.session.activeRole = requestedRole;
        
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
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
              <li><strong>Date:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</li>
            </ul>`
          );
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

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userRole = userData.isNanny ? "caregiver" : "parent";
      
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

      const user = await storage.createUser(cleanUserData);

      req.session.userId = user.id;
      req.session.activeRole = userRole;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

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
          </ul>`
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

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password || '');
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userRoles = user.roles || ["parent"];
      const activeRole = userRoles[0];

      req.session.userId = user.id;
      req.session.activeRole = activeRole;
      
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
        activeRole: activeRole,
        isNanny: user.isNanny
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User info endpoint
  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles || ["parent"],
        activeRole: req.session.activeRole || (user.roles && user.roles[0]) || "parent",
        isNanny: user.isNanny,
        profileImageUrl: user.profileImageUrl,
        phone: user.phone
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Role switching endpoint
  app.post("/api/auth/switch-role", requireAuth, async (req, res) => {
    try {
      const { role } = req.body;
      const user = await storage.getUserById(req.session.userId as string);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userRoles = user.roles || ["parent"];
      if (!userRoles.includes(role)) {
        return res.status(400).json({ message: "Role not available for this user" });
      }

      req.session.activeRole = role;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.json({ activeRole: role });
    } catch (error) {
      console.error("Role switch error:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Job creation endpoint
  app.post("/api/jobs", requireAuth, async (req, res) => {
    try {
      const validationResult = insertJobSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid job data",
          details: validationResult.error.errors,
        });
      }

      const jobData = {
        ...validationResult.data,
        id: `job_${Date.now()}_${randomUUID().slice(0, 6)}`,
        parentId: req.session.userId as string,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error("Job creation error:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Get all jobs (for browsing)
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get user's jobs
  app.get("/api/jobs/my", requireAuth, async (req, res) => {
    try {
      const jobs = await storage.getJobsByParentId(req.session.userId as string);
      res.json(jobs);
    } catch (error) {
      console.error("Get my jobs error:", error);
      res.status(500).json({ message: "Failed to fetch your jobs" });
    }
  });

  // Job application endpoint
  app.post("/api/jobs/:jobId/apply", requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const { message } = req.body;

      const existingApplication = await storage.getApplicationByJobAndUser(jobId, req.session.userId as string);
      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied to this job" });
      }

      const applicationData = {
        id: `app_${Date.now()}_${randomUUID().slice(0, 6)}`,
        jobId,
        caregiverId: req.session.userId as string,
        message: message || "",
        status: "pending" as const,
        appliedAt: new Date(),
      };

      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      console.error("Job application error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  // Get applications for a job
  app.get("/api/jobs/:jobId/applications", requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const applications = await storage.getApplicationsByJobId(jobId);
      res.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get user's applications
  app.get("/api/applications/my", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getApplicationsByUserId(req.session.userId as string);
      res.json(applications);
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ message: "Failed to fetch your applications" });
    }
  });

  // Update application status
  app.patch("/api/applications/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const application = await storage.updateApplicationStatus(id, status);
      res.json(application);
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Get featured nannies
  app.get("/api/nannies/featured", async (req, res) => {
    try {
      const nannies = await storage.getFeaturedNannies();
      res.json(nannies);
    } catch (error) {
      console.error("Get featured nannies error:", error);
      res.status(500).json({ message: "Failed to fetch featured nannies" });
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

  // Test email endpoint
  app.post("/api/test-email", async (req, res) => {
    try {
      await sendEmail(
        "info@tornevelk.com",
        "VIVALY Email System Test",
        `<h3>Email System Test</h3>
        <p>This is a test email to verify the VIVALY notification system is working properly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
        <p><strong>System:</strong> Email notifications are operational</p>`
      );
      res.json({ message: "Test email sent successfully" });
    } catch (error) {
      console.error("Test email failed:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

---

## ISSUES SUMMARY

The main navigation problems are:

1. **Mobile header role toggle** - TypeScript errors with RoleToggle component props
2. **Browse jobs route** - App.tsx routing conflicts for caregivers  
3. **Caregiver bookings** - API endpoint exists but frontend may have query issues
4. **Empty job board** - Role-based routing not working correctly

## DEBUGGING STEPS

1. Check if `/browse-jobs` route is properly registered in App.tsx
2. Verify RoleToggle component interface matches usage in new-header.tsx
3. Test caregiver bookings API endpoint directly
4. Fix role-based routing logic in job board navigation

Please use this complete server code to help debug and fix the navigation issues.