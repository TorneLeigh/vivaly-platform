import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { registerRoutes } from "./routes";
import { startPaymentReleaseCron } from "./cron-jobs";
import { setupVite, serveStatic, log } from "./vite";
import "./types";

const app = express();

// Trust proxy for rate limiting in hosted environments
app.set('trust proxy', 1);

// CORS configuration - allow all origins in development, restricted in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        // Production: strict origin checking
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
          'https://vivaly.vercel.app',
          'https://vivaly.com.au',
          'https://www.vivaly.com.au',
          'https://vivaly-platform-o2ut.vercel.app',
        ];
        
        if (allowedOrigins.includes(origin) || 
            origin.includes('.vercel.app') || 
            origin.includes('.replit.dev')) {
          callback(null, true);
        } else {
          console.log('CORS blocked origin:', origin);
          callback(new Error('Not allowed by CORS'), false);
        }
      }
    : true, // Development: allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

// Sentry initialization for error monitoring
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

// Security headers with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["*", "'self'", "data:", "blob:"],
      scriptSrc: ["*", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["*", "'unsafe-inline'"],
      connectSrc: ["*"],
      imgSrc: ["*", "data:", "blob:"],
      mediaSrc: ["*", "blob:"],
      fontSrc: ["*", "data:"],
      frameSrc: ["*"],
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
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined
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
