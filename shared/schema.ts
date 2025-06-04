import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

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
  // Document verification fields
  hasPhotoId: boolean("has_photo_id").default(false),
  hasWwcc: boolean("has_wwcc").default(false),
  hasPoliceCheck: boolean("has_police_check").default(false),
  hasFirstAid: boolean("has_first_aid").default(false),
  hasReferences: boolean("has_references").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, in_review, approved, rejected
  verificationDate: timestamp("verification_date"),
  backgroundCheckId: text("background_check_id"),
  backgroundCheckStatus: text("background_check_status").default("pending"),
  services: json("services").$type<string[]>().default([]),
  certificates: json("certificates").$type<string[]>().default([]),
  availability: json("availability").$type<Record<string, boolean>>().default({}),
  isVerified: boolean("is_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  // Family Day Care specific fields
  isFamilyDayCare: boolean("is_family_day_care").default(false),
  maxCapacity: integer("max_capacity").default(7),
  currentEnrollment: integer("current_enrollment").default(0),
  maxBabies: integer("max_babies").default(4),
  currentBabies: integer("current_babies").default(0),
  hasEducatorCertificate: boolean("has_educator_certificate").default(false),
  hasInsurance: boolean("has_insurance").default(false),
  hasSafetyAssessment: boolean("has_safety_assessment").default(false),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
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
  // Family Day Care specific fields
  bookingType: text("booking_type").default("hourly"), // hourly, weekly, monthly
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  childAge: text("child_age"), // baby (0-2), preschool (3-5), school-age (6+)
  isRecurring: boolean("is_recurring").default(false),
});

// Family Day Care enrollments for ongoing weekly/monthly arrangements
export const familyDayCareEnrollments = pgTable("family_day_care_enrollments", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(), // references nannies.id
  parentId: integer("parent_id").notNull(), // references users.id
  childName: text("child_name").notNull(),
  childAge: text("child_age").notNull(), // baby (0-2), preschool (3-5), school-age (6+)
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  enrollmentType: text("enrollment_type").notNull(), // weekly, monthly
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  daysPerWeek: json("days_per_week").$type<string[]>().default([]), // ["monday", "tuesday", etc.]
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").default("pending"), // pending, active, completed, cancelled
  specialRequirements: text("special_requirements"),
  emergencyContact: json("emergency_contact").$type<{name: string, phone: string, relationship: string}>(),
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

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  caregiverId: integer("caregiver_id").notNull(),
  // Personal details
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bio: text("bio").notNull(),
  // Experience details
  title: text("title").notNull(),
  description: text("description").notNull(),
  serviceType: text("service_type").notNull(),
  duration: integer("duration").notNull(), // in minutes
  // Pricing
  isFree: boolean("is_free").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  // Participants
  maxParticipants: integer("max_participants").notNull(),
  ageRange: text("age_range").notNull(), // e.g., "0-2", "3-5", "6-12"
  location: text("location").notNull(),
  photos: text("photos").array(), // Array of photo URLs
  inclusions: text("inclusions").array(), // What's included
  requirements: text("requirements").array(), // What families need to bring/know
  availability: text("availability").array(), // Available days/times
  instantBook: boolean("instant_book").default(false),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  isCaregiver: z.boolean().optional(),
  agreeToTerms: z.boolean().optional(),
  confirmPassword: z.string().optional(),
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

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyDayCareEnrollmentSchema = createInsertSchema(familyDayCareEnrollments).omit({
  id: true,
  createdAt: true,
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

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type FamilyDayCareEnrollment = typeof familyDayCareEnrollments.$inferSelect;
export type InsertFamilyDayCareEnrollment = z.infer<typeof insertFamilyDayCareEnrollmentSchema>;

// Service types
export const SERVICE_TYPES = [
  "1-on-1 care",
  "Group care",
  "Family Day Care",
  "Drop and dash",
  "Midwife services",
  "Breastfeeding support",
  "Birth education",
  "Newborn support",
  "Pregnancy assistance",
  "Postnatal care",
  "Pet sitting",
  "Elderly care",
  "Elderly companionship"
] as const;

// Certificate types
export const CERTIFICATE_TYPES = [
  "First Aid",
  "CPR",
  "Cert III Childcare",
  "Early Childhood Education",
  "Montessori",
  "Working with Children Check",
  "Animal Care Certificate",
  "Pet First Aid",
  "Dog Training Certification",
  "Veterinary Assistant",
  "Animal Behavior Certificate",
  "Midwifery Certification",
  "Lactation Consultant",
  "Birth Doula Training",
  "Postnatal Doula Training",
  "Aged Care Certificate",
  "Personal Care Assistant",
  "Companion Care Training"
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
