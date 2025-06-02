import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  isNanny: boolean("is_nanny").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nannies = pgTable("nannies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bio: text("bio"),
  experience: integer("experience"), // years
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: text("location").notNull(),
  suburb: text("suburb").notNull(),
  services: json("services").$type<string[]>().default([]),
  certificates: json("certificates").$type<string[]>().default([]),
  availability: json("availability").$type<Record<string, boolean>>().default({}),
  isVerified: boolean("is_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  nannyId: integer("nanny_id").notNull(),
  parentId: integer("parent_id").notNull(),
  serviceType: text("service_type").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  revieweeId: integer("reviewee_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertNannySchema = createInsertSchema(nannies).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isBlocked: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Nanny = typeof nannies.$inferSelect;
export type InsertNanny = z.infer<typeof insertNannySchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Service types
export const SERVICE_TYPES = [
  "1-on-1 Care",
  "Group Care", 
  "Group Play",
  "Drop & Dash",
  "Postpartum Support",
  "Breastfeeding Support",
  "Birth Education",
  "Postnatal Care"
] as const;

// Certificate types
export const CERTIFICATE_TYPES = [
  "First Aid",
  "CPR",
  "Cert III Childcare",
  "Early Childhood Education",
  "Montessori",
  "Working with Children Check",
  "Midwifery Certification",
  "Lactation Consultant",
  "Birth Doula Training",
  "Postnatal Doula Training"
] as const;

// Sydney suburbs
export const SYDNEY_SUBURBS = [
  "Bondi Beach",
  "Surry Hills", 
  "Manly",
  "Newtown",
  "Paddington",
  "Darlinghurst",
  "Potts Point",
  "Circular Quay",
  "The Rocks",
  "Glebe"
] as const;
