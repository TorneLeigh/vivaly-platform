import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertNannySchema, insertBookingSchema, 
  insertReviewSchema, insertMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Nannies routes
  app.get("/api/nannies/featured", async (req, res) => {
    try {
      const nannies = await storage.getFeaturedNannies();
      res.json(nannies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured nannies" });
    }
  });

  app.get("/api/nannies/search", async (req, res) => {
    try {
      const { location, serviceType, date, minRate, maxRate } = req.query;
      const filters = {
        location: location as string,
        serviceType: serviceType as string,
        date: date as string,
        minRate: minRate ? parseFloat(minRate as string) : undefined,
        maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
      };
      
      const nannies = await storage.searchNannies(filters);
      res.json(nannies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search nannies" });
    }
  });

  app.get("/api/nannies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const nanny = await storage.getNanny(id);
      
      if (!nanny) {
        return res.status(404).json({ message: "Nanny not found" });
      }

      const user = await storage.getUser(nanny.userId);
      const reviews = await storage.getReviewsByNanny(id);
      
      res.json({ ...nanny, user, reviews });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nanny profile" });
    }
  });

  app.post("/api/nannies", async (req, res) => {
    try {
      const nannyData = insertNannySchema.parse(req.body);
      const nanny = await storage.createNanny(nannyData);
      res.status(201).json(nanny);
    } catch (error) {
      res.status(400).json({ message: "Invalid nanny data" });
    }
  });

  // Users routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bookings routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/bookings/nanny/:nannyId", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.nannyId);
      const bookings = await storage.getBookingsByNanny(nannyId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/parent/:parentId", async (req, res) => {
    try {
      const parentId = parseInt(req.params.parentId);
      const bookings = await storage.getBookingsByParent(parentId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Reviews routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  app.get("/api/reviews/nanny/:nannyId", async (req, res) => {
    try {
      const nannyId = parseInt(req.params.nannyId);
      const reviews = await storage.getReviewsByNanny(nannyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages/conversation/:userId1/:userId2", async (req, res) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      const messages = await storage.getMessagesBetweenUsers(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
