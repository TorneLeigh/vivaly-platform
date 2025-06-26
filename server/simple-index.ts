import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";

const app = express();

// Updated CORS config
const allowedOrigins = [
  "https://vivaly.com.au",
  "https://www.vivaly.com.au",
  "https://vivaly-platform-o2ut.vercel.app",
  "http://localhost:5173"
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Register all API routes
registerRoutes(app);

// Fallback route for 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Correct port setup for Replit + Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});