import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "body-parser";
import registerRoutes from "./routes";
import { serveStatic } from "./vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "vivaly_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ✅ Register all your app routes
registerRoutes(app);

// ✅ Serve the frontend from Vite
serveStatic(app);

app.listen(PORT, () => {
  console.log(`✅ VIVALY backend running on port ${PORT}`);
});
