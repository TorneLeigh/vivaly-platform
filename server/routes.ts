import express from "express";
import type { Request, Response } from "express";
import type { IStorage } from "./storage";
import { sendAdminNewUserAlert } from "./email-automation-service";

export default function registerRoutes(app: express.Express, storage: IStorage) {
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const user = await storage.createUser(req.body);
      await sendAdminNewUserAlert(user.id);
      res.json(user);
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.user = user;
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) return res.status(401).json({ error: "Not logged in" });
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
}
