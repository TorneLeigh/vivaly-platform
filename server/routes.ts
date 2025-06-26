import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Dummy in-memory user data for testing
const users = [
  {
    id: 1,
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "parent",
  },
];

// ✅ TEST route to confirm server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ LOGIN route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "7d" },
  );

  res.json({ token, user });
});

// ✅ Start the server for Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
