import express from "express";
import { requireAuth } from "./auth-middleware";
import { storage } from "./storage";
import { sendSignupNotification } from "./email-automation-service";

const router = express.Router();

// ✅ User registration route
router.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = await storage.createUser({ fullName, email, password, role });
    await sendSignupNotification(newUser.id);

    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// ✅ Get authenticated user
router.get("/api/auth/user", requireAuth, async (req, res) => {
  try {
    const user = await storage.getUser(req.user.id);
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ Other example authenticated route
router.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: "Access granted", userId: req.user.id });
});

export default router;
