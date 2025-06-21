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
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: text("phone"),
  password: text("password"), // For backwards compatibility with existing accounts
  roles: json("roles").$type<string[]>().default(["parent"]), // Available roles for the user
  isNanny: boolean("is_nanny").default(false),
  allowCaregiverMessages: boolean("allow_caregiver_messages").default(false),
  resetToken: varchar("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  
  // Parent profile fields
  homeAddress: text("home_address"),
  suburb: text("suburb"),
  bio: text("bio"),
  numberOfChildren: integer("number_of_children"),
  languagesSpoken: text("languages_spoken"),
  pets: text("pets"),
  children: json("children").$type<Array<{name: string, age: string, grade: string}>>().default([]),
  allergies: text("allergies"),
  medications: text("medications"),
  emergencyContact: text("emergency_contact"),
  essentialRequirements: json("essential_requirements").$type<string[]>().default([]),
  positionType: text("position_type"),
  schedule: text("schedule"),
  startDate: text("start_date"),
  responsibilities: json("responsibilities").$type<string[]>().default([]),
  caregiverPreferences: text("caregiver_preferences"),
  householdRules: text("household_rules"),
  emergencyProcedures: text("emergency_procedures"),
  personalMessage: text("personal_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const parentProfiles = pgTable("parent_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  // Basic Information
  address: text("address"),
  suburb: text("suburb"),
  
  // Family Information
  familySize: text("family_size"),
  numberOfChildren: text("number_of_children"),
  childrenAges: json("children_ages").$type<string[]>().default([]),
  
  // Detailed Children Information
  childrenNames: json("children_names").$type<string[]>().default([]),
  childrenGenders: json("children_genders").$type<string[]>().default([]),
  childrenPersonalities: json("children_personalities").$type<string[]>().default([]),
  childrenInterests: json("children_interests").$type<string[]>().default([]),
  childrenBehavioralNotes: json("children_behavioral_notes").$type<string[]>().default([]),
  napSchedules: json("nap_schedules").$type<string[]>().default([]),
  mealPreferences: json("meal_preferences").$type<string[]>().default([]),
  pottyTrainingStatus: json("potty_training_status").$type<string[]>().default([]),
  schoolSchedules: json("school_schedules").$type<string[]>().default([]),
  extracurricularActivities: json("extracurricular_activities").$type<string[]>().default([]),
  bedtimeRoutines: json("bedtime_routines").$type<string[]>().default([]),
  comfortItems: json("comfort_items").$type<string[]>().default([]),
  favoriteActivities: json("favorite_activities").$type<string[]>().default([]),
  
  // Health & Allergies
  foodAllergies: text("food_allergies"),
  dietaryRestrictions: json("dietary_restrictions").$type<string[]>().default([]),
  medicationRequirements: text("medication_requirements"),
  medicalConditions: json("medical_conditions").$type<string[]>().default([]),
  doctorContactInfo: text("doctor_contact_info"),
  hospitalPreference: text("hospital_preference"),
  
  // Emergency Contacts
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  emergencyContact2Name: text("emergency_contact_2_name"),
  emergencyContact2Phone: text("emergency_contact_2_phone"),
  emergencyContact2Relation: text("emergency_contact_2_relation"),
  
  // Elderly Care Information
  elderlyInHome: boolean("elderly_in_home").default(false),
  elderlyName: text("elderly_name"),
  elderlyAge: integer("elderly_age"),
  elderlyRelationship: text("elderly_relationship"),
  elderlyMedicalConditions: json("elderly_medical_conditions").$type<string[]>().default([]),
  elderlyMedicationSchedule: text("elderly_medication_schedule"),
  elderlyMobilityNeeds: text("elderly_mobility_needs"),
  elderlyCarePreferences: text("elderly_care_preferences"),
  elderlyDoctorInfo: text("elderly_doctor_info"),
  elderlyDietaryNeeds: text("elderly_dietary_needs"),
  elderlyPersonalityNotes: text("elderly_personality_notes"),
  elderlyPreferredActivities: json("elderly_preferred_activities").$type<string[]>().default([]),
  elderlyEmergencyInfo: text("elderly_emergency_info"),
  
  // Pet Care Information
  petsInHome: json("pets_in_home").$type<string[]>().default([]),
  petNames: json("pet_names").$type<string[]>().default([]),
  petTypes: json("pet_types").$type<string[]>().default([]),
  petBreeds: json("pet_breeds").$type<string[]>().default([]),
  petAges: json("pet_ages").$type<string[]>().default([]),
  petPersonalities: json("pet_personalities").$type<string[]>().default([]),
  petMedicalNeeds: json("pet_medical_needs").$type<string[]>().default([]),
  petFeedingSchedule: text("pet_feeding_schedule"),
  petWalkingRequirements: text("pet_walking_requirements"),
  petGroomingNeeds: text("pet_grooming_needs"),
  vetContactInfo: text("vet_contact_info"),
  petEmergencyInfo: text("pet_emergency_info"),
  petBehavioralNotes: text("pet_behavioral_notes"),
  petPreferredTreats: json("pet_preferred_treats").$type<string[]>().default([]),
  
  // Caregiver Requirements & Preferences
  minimumAge: text("minimum_age").default("18"),
  preferredCaregiverGender: text("preferred_caregiver_gender").default("no-preference"),
  languagePreferences: json("language_preferences").$type<string[]>().default(["English"]),
  caregiverExperienceLevel: text("caregiver_experience_level").default("some-experience"),
  specialSkillsRequired: json("special_skills_required").$type<string[]>().default([]),
  
  // Essential Requirements (Australian childcare compliance)
  mustHaveWWCC: boolean("must_have_wwcc").default(true),
  mustHaveFirstAid: boolean("must_have_first_aid").default(false),
  mustHaveCPR: boolean("must_have_cpr").default(false),
  mustHaveReferences: boolean("must_have_references").default(true),
  mustBeNonSmoker: boolean("must_be_non_smoker").default(true),
  mustHaveDriversLicense: boolean("must_have_drivers_license").default(false),
  mustHaveOwnCar: boolean("must_have_own_car").default(false),
  mustHaveAustralianLicense: boolean("must_have_australian_license").default(false),
  experienceWithToddlers: boolean("experience_with_toddlers").default(false),
  experienceWithSchoolAge: boolean("experience_with_school_age").default(false),
  experienceWithNewborns: boolean("experience_with_newborns").default(false),
  
  // Position Details
  positionType: text("position_type").default("casual"),
  startDate: text("start_date"),
  preferredStartTime: text("preferred_start_time"),
  preferredEndTime: text("preferred_end_time"),
  daysPerWeek: json("days_per_week").$type<string[]>().default([]),
  hoursPerDay: text("hours_per_day"),
  
  // Responsibilities Required
  childSupervision: boolean("child_supervision").default(true),
  schoolPickupDropoff: boolean("school_pickup_dropoff").default(false),
  afterSchoolActivities: boolean("after_school_activities").default(false),
  mealPreparation: boolean("meal_preparation").default(false),
  lightHousework: boolean("light_housework").default(false),
  laundryFolding: boolean("laundry_folding").default(false),
  lunchboxPrep: boolean("lunchbox_prep").default(false),
  bathTimeHelp: boolean("bath_time_help").default(false),
  bedtimeRoutine: boolean("bedtime_routine").default(false),
  homeworkHelp: boolean("homework_help").default(false),
  playAndEngagement: boolean("play_and_engagement").default(true),
  
  // Care Requirements
  typicalCareHours: text("typical_care_hours").default("part-time"),
  careFrequency: text("care_frequency").default("weekly"),
  transportationNeeds: text("transportation_needs").default("none"),
  householdChores: boolean("household_chores").default(false),
  
  // Household Rules & Preferences
  smokingPolicy: text("smoking_policy").default("no-smoking"),
  screenTimePolicy: text("screen_time_policy").default("limited"),
  disciplineStyle: text("discipline_style").default("positive"),
  outdoorActivities: boolean("outdoor_activities").default(true),
  
  // Safety & Verification
  backgroundCheckRequired: boolean("background_check_required").default(true),
  referencesRequired: boolean("references_required").default(true),
  policeCheckRequired: boolean("police_check_required").default(true),
  
  // Additional Information
  specialInstructions: text("special_instructions"),
  familyValues: text("family_values"),
  communicationPreferences: text("communication_preferences").default("text"),
  
  // Personal Touch Questions
  myLoveLanguage: text("my_love_language"),
  littleAboutMe: text("little_about_me"),
  imProudOf: text("im_proud_of"),
  myFamilyIsSpecialBecause: text("my_family_is_special_because"),
  onePerfectDay: text("one_perfect_day"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const nannies = pgTable("nannies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bio: text("bio"),
  experience: integer("experience"), // years
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: text("location").notNull(),
  suburb: text("suburb").notNull(),
  introVideo: text("intro_video"), // URL to intro video
  profilePhoto: text("profile_photo"), // URL to profile photo
  yearsOfExperience: integer("years_of_experience").default(0),
  reviewCount: integer("review_count").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
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
  senderId: varchar("sender_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  content: text("content").notNull(),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().notNull(),
  parentId: varchar("parent_id").notNull(),
  title: varchar("title").notNull(),
  startDate: varchar("start_date").notNull(),
  numChildren: integer("num_children").notNull(),
  rate: varchar("rate").notNull(), // Store as string for flexibility (e.g., "$30/hr", "$600/week")
  hoursPerWeek: integer("hours_per_week").notNull(),
  description: text("description").notNull(),
  location: varchar("location"),
  suburb: varchar("suburb"),
  status: varchar("status").default("active"), // active, filled, expired
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: varchar("job_id").notNull(),
  caregiverId: varchar("caregiver_id").notNull(),
  caregiverProfile: text("caregiver_profile"), // URL or text profile
  status: varchar("status").default("pending"), // pending, accepted, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
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
  
  // Personal Touch Questions
  myLoveLanguage: text("my_love_language"),
  littleAboutMe: text("little_about_me"),
  imProudOf: text("im_proud_of"),
  whatMakesMe: text("what_makes_me"),
  onePerfectDay: text("one_perfect_day"),
  mySuperpowerIs: text("my_superpower_is"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Childcare Providers - Licensed childcare centers
export const childcareProviders = pgTable("childcare_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  centerName: text("center_name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  suburb: text("suburb").notNull(),
  postcode: text("postcode").notNull(),
  state: text("state").notNull(),
  
  // Capacity and age groups
  totalCapacity: integer("total_capacity").notNull().default(7),
  babyCapacity: integer("baby_capacity").notNull().default(4),
  currentEnrollments: integer("current_enrollments").default(0),
  currentBabies: integer("current_babies").default(0),
  ageGroups: json("age_groups").$type<string[]>().default([]),
  
  // Operating details
  operatingDays: json("operating_days").$type<string[]>().default([]),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  
  // Rates
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }).notNull(),
  
  // Verification
  wwccNumber: text("wwcc_number").notNull(),
  verificationStatus: text("verification_status").default("pending"),
  isActive: boolean("is_active").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Childcare Enrollments - Applications from families
export const childcareEnrollments = pgTable("childcare_enrollments", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  parentUserId: integer("parent_user_id").notNull(),
  
  // Child details
  childName: text("child_name").notNull(),
  childAge: integer("child_age").notNull(),
  childDateOfBirth: timestamp("child_date_of_birth").notNull(),
  
  // Enrollment details
  enrollmentType: text("enrollment_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  preferredDays: json("preferred_days").$type<string[]>().default([]),
  
  // Special requirements
  allergies: text("allergies"),
  medicalConditions: text("medical_conditions"),
  emergencyContact: json("emergency_contact").$type<{
    name: string;
    relationship: string;
    phone: string;
  }>(),
  
  // Application status
  status: text("status").default("pending"),
  applicationDate: timestamp("application_date").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  isNanny: z.boolean().optional(),
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

export const insertJobSchema = createInsertSchema(jobs).omit({
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
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

export const insertChildcareProviderSchema = createInsertSchema(childcareProviders).omit({
  id: true,
  currentEnrollments: true,
  currentBabies: true,
  verificationStatus: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChildcareEnrollmentSchema = createInsertSchema(childcareEnrollments).omit({
  id: true,
  status: true,
  applicationDate: true,
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

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type FamilyDayCareEnrollment = typeof familyDayCareEnrollments.$inferSelect;
export type InsertFamilyDayCareEnrollment = z.infer<typeof insertFamilyDayCareEnrollmentSchema>;

export type ChildcareProvider = typeof childcareProviders.$inferSelect;
export type InsertChildcareProvider = z.infer<typeof insertChildcareProviderSchema>;

export type ChildcareEnrollment = typeof childcareEnrollments.$inferSelect;
export type InsertChildcareEnrollment = z.infer<typeof insertChildcareEnrollmentSchema>;

// Service types
export const SERVICE_TYPES = [
  "Babysitting",
  "Childcare",
  "Drop and dash",
  "1-2 hours group care",
  "Overnight care",
  "Newborn support",
  "School pickup/dropoff",
  "Holiday care",
  "Weekend care"
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
  "Bondi Junction", 
  "Coogee",
  "Bronte",
  "Tamarama",
  "Double Bay",
  "Rose Bay",
  "Vaucluse",
  "Woollahra",
  "Paddington",
  "Surry Hills",
  "Darlinghurst",
  "Potts Point",
  "Kings Cross",
  "Newtown",
  "Glebe",
  "Leichhardt",
  "Balmain",
  "Rozelle",
  "Manly",
  "Neutral Bay",
  "North Sydney",
  "Mosman",
  "Lane Cove",
  "Chatswood",
  "St Leonards",
  "Crows Nest",
  "McMahons Point",
  "Milsons Point",
  "Kirribilli",
  "Redfern",
  "Alexandria",
  "Erskineville",
  "Marrickville",
  "Dulwich Hill",
  "Lewisham",
  "Summer Hill",
  "Ashfield",
  "Randwick",
  "Kensington",
  "Maroubra",
  "Mascot",
  "Zetland",
  "Rosebery",
  "Chippendale",
  "Ultimo",
  "Pyrmont",
  "The Rocks",
  "Circular Quay"
] as const;

// Parent Profile Schema Types
export const insertParentProfileSchema = createInsertSchema(parentProfiles);
export type InsertParentProfile = z.infer<typeof insertParentProfileSchema>;
export type ParentProfile = typeof parentProfiles.$inferSelect;
