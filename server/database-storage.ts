import {
  users,
  nannies,
  experiences,
  bookings,
  reviews,
  messages,
  childcareProviders,
  childcareEnrollments,
  parentProfiles,
  type User,
  type InsertUser,
  type Nanny,
  type InsertNanny,
  type Experience,
  type InsertExperience,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Message,
  type InsertMessage,
  type ChildcareProvider,
  type InsertChildcareProvider,
  type ChildcareEnrollment,
  type InsertChildcareEnrollment,
  type ParentProfile,
  type InsertParentProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql, count } from "drizzle-orm";
import type { IStorage } from "./storage";
import { nanoid } from "nanoid";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const userId = nanoid();
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        phone: userData.phone || null,
        password: userData.password || null,
        isNanny: userData.isNanny || false,
        allowCaregiverMessages: userData.allowCaregiverMessages || false,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const existingUser = await this.getUser(userData.id);
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return user;
    } else {
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return user;
    }
  }

  // Nanny operations
  async getNannies(): Promise<Nanny[]> {
    return await db.select().from(nannies);
  }

  async getFeaturedNannies(): Promise<(Nanny & { user: User })[]> {
    // Get nannies first
    const nannyList = await db.select().from(nannies).limit(6);
    
    // Then get the users for those nannies
    const results: (Nanny & { user: User })[] = [];
    
    for (const nanny of nannyList) {
      const [user] = await db.select().from(users).where(eq(users.id, nanny.userId.toString()));
      if (user) {
        results.push({
          ...nanny,
          user,
        });
      }
    }
    
    return results;
  }

  async getNanny(id: number): Promise<Nanny | undefined> {
    const [nanny] = await db.select().from(nannies).where(eq(nannies.id, id));
    return nanny;
  }

  async getNannyByUserId(userId: string): Promise<Nanny | undefined> {
    const [nanny] = await db.select().from(nannies).where(eq(nannies.userId, userId));
    return nanny;
  }

  async createNanny(nannyData: InsertNanny): Promise<Nanny> {
    const [nanny] = await db.insert(nannies).values(nannyData).returning();
    return nanny;
  }

  async updateNanny(id: number, nannyData: Partial<InsertNanny>): Promise<Nanny | undefined> {
    const [nanny] = await db
      .update(nannies)
      .set(nannyData)
      .where(eq(nannies.id, id))
      .returning();
    return nanny;
  }

  // Experience operations
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience;
  }

  async createExperience(experienceData: InsertExperience): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(experienceData).returning();
    return experience;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  async updateBooking(id: number, bookingData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set(bookingData)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async getUserBookings(userId: string): Promise<(Booking & { nanny: User; parent: User })[]> {
    const result = await db
      .select()
      .from(bookings)
      .innerJoin(users, eq(bookings.nannyId, sql`${users.id}::integer`))
      .innerJoin(users, eq(bookings.parentId, sql`${users.id}::integer`))
      .where(or(eq(bookings.nannyId, parseInt(userId)), eq(bookings.parentId, parseInt(userId))));
    
    return result.map(row => ({
      ...row.bookings,
      nanny: row.users,
      parent: row.users,
    }));
  }

  // Review operations
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getConversations(userId: string): Promise<any[]> {
    // Simple implementation - would need more complex logic for real conversations
    return [];
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  // Childcare provider operations
  async getChildcareProviders(): Promise<ChildcareProvider[]> {
    return await db.select().from(childcareProviders);
  }

  async getChildcareProvider(id: number): Promise<ChildcareProvider | undefined> {
    const [provider] = await db.select().from(childcareProviders).where(eq(childcareProviders.id, id));
    return provider;
  }

  async createChildcareProvider(providerData: InsertChildcareProvider): Promise<ChildcareProvider> {
    const [provider] = await db.insert(childcareProviders).values(providerData).returning();
    return provider;
  }

  // Childcare enrollment operations
  async getChildcareEnrollments(): Promise<ChildcareEnrollment[]> {
    return await db.select().from(childcareEnrollments);
  }

  async getChildcareEnrollment(id: number): Promise<ChildcareEnrollment | undefined> {
    const [enrollment] = await db.select().from(childcareEnrollments).where(eq(childcareEnrollments.id, id));
    return enrollment;
  }

  async createChildcareEnrollment(enrollmentData: InsertChildcareEnrollment): Promise<ChildcareEnrollment> {
    const [enrollment] = await db.insert(childcareEnrollments).values(enrollmentData).returning();
    return enrollment;
  }

  // Parent profile operations
  async getParentProfile(userId: string): Promise<ParentProfile | undefined> {
    const [profile] = await db.select().from(parentProfiles).where(eq(parentProfiles.userId, userId));
    return profile;
  }

  async createParentProfile(profileData: InsertParentProfile): Promise<ParentProfile> {
    const [profile] = await db.insert(parentProfiles).values(profileData).returning();
    return profile;
  }

 async updateParentProfile(userId: string, profileData: Partial<InsertParentProfile>): Promise<ParentProfile | undefined> {
  // Fix for childrenAges mismatch
  if (Array.isArray(profileData.childrenAges)) {
    profileData.childrenAges = profileData.childrenAges.map((age, index) => ({
      [index]: age,
    })) as any; // safely cast as any to bypass the DB mismatch
  }

  const [profile] = await db
    .update(parentProfiles)
    .set(profileData)
    .where(eq(parentProfiles.userId, userId))
    .returning();
  return profile;
}


  // Placeholder implementations for missing methods
  async getPendingCaregivers(): Promise<(Nanny & { user: User })[]> {
    return [];
  }

  async updateCaregiverVerification(id: number, approved: boolean, reason?: string): Promise<Nanny | undefined> {
    return undefined;
  }

  async getTodayBookingsByCaregiver(userId: number): Promise<(Booking & { parent: User })[]> {
    return [];
  }
} 