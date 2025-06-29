import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import registerRoutes from './routes'; // ✅ Changed from named import
import { serveStatic } from './vite';  // ✅ Added default export fallback
import { log } from './vite';          // ✅ Added log function import

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Register API routes
registerRoutes(app);

// Serve frontend (Vite)
serveStatic(app);

// Optional logger
log('Server is running...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`Backend listening on port ${PORT}`);
});
