import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import registerRoutes from "./routes";
import { serveStatic } from "./vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using https
  })
);

// Routes
registerRoutes(app);

// Static Frontend
serveStatic(app);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
