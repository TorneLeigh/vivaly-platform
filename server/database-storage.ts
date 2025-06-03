import {
  users,
  nannies,
  bookings,
  reviews,
  messages,
  type User,
  type InsertUser,
  type Nanny,
  type InsertNanny,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        phone: userData.phone || null,
        profileImage: userData.profileImage || null,
        isNanny: userData.isNanny || null,
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  // Nannies
  async getNanny(id: number): Promise<Nanny | undefined> {
    const [nanny] = await db.select().from(nannies).where(eq(nannies.id, id));
    return nanny;
  }

  async getNannyByUserId(userId: number): Promise<Nanny | undefined> {
    const [nanny] = await db.select().from(nannies).where(eq(nannies.userId, userId));
    return nanny;
  }

  async createNanny(nannyData: InsertNanny): Promise<Nanny> {
    const [nanny] = await db
      .insert(nannies)
      .values({
        userId: nannyData.userId,
        location: nannyData.location,
        suburb: nannyData.suburb,
        services: nannyData.services,
        bio: nannyData.bio || null,
        experience: nannyData.experience || null,
        hourlyRate: nannyData.hourlyRate || null,
        hasPhotoId: nannyData.hasPhotoId || null,
        hasWwcc: nannyData.hasWwcc || null,
        hasPoliceCheck: nannyData.hasPoliceCheck || null,
        hasFirstAid: nannyData.hasFirstAid || null,
        availability: nannyData.availability || null,
        certificates: nannyData.certificates || null,
        isVerified: nannyData.isVerified || null,
        createdAt: new Date(),
      })
      .returning();
    return nanny;
  }

  async updateNanny(id: number, updates: Partial<Nanny>): Promise<Nanny | undefined> {
    const [nanny] = await db
      .update(nannies)
      .set(updates)
      .where(eq(nannies.id, id))
      .returning();
    return nanny;
  }

  async searchNannies(filters: {
    location?: string;
    serviceType?: string;
    date?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<(Nanny & { user: User })[]> {
    const query = db
      .select()
      .from(nannies)
      .innerJoin(users, eq(nannies.userId, users.id));

    const results = await query;
    return results.map(row => ({
      ...row.nannies,
      user: row.users,
    }));
  }

  async getFeaturedNannies(): Promise<(Nanny & { user: User })[]> {
    const results = await db
      .select()
      .from(nannies)
      .innerJoin(users, eq(nannies.userId, users.id))
      .limit(12);

    return results.map(row => ({
      ...row.nannies,
      user: row.users,
    }));
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        status: bookingData.status || null,
        totalAmount: bookingData.totalAmount || null,
        notes: bookingData.notes || null,
        createdAt: new Date(),
      })
      .returning();
    return booking;
  }

  async getBookingsByNanny(nannyId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.nannyId, nannyId));
  }

  async getBookingsByParent(parentId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.parentId, parentId));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({
        ...reviewData,
        comment: reviewData.comment || null,
        createdAt: new Date(),
      })
      .returning();
    return review;
  }

  async getReviewsByNanny(nannyId: number): Promise<(Review & { reviewer: User })[]> {
    const results = await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, nannyId));

    return results.map(row => ({
      ...row.reviews,
      reviewer: row.users,
    }));
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...messageData,
        createdAt: new Date(),
      })
      .returning();
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<(Message & { sender: User, receiver: User })[]> {
    const results = await db
      .select({
        message: messages,
        sender: users,
        receiver: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(desc(messages.createdAt));

    return results.map(row => ({
      ...row.message,
      sender: row.sender,
      receiver: row.receiver,
    }));
  }

  async getConversations(userId: number): Promise<{ user: User, lastMessage: Message, unreadCount: number }[]> {
    // This is a simplified implementation
    // In production, you'd want to optimize this with proper SQL joins
    const userMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversations = new Map<number, { user: User, lastMessage: Message, unreadCount: number }>();
    
    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversations.has(otherUserId)) {
        const [otherUser] = await db.select().from(users).where(eq(users.id, otherUserId));
        if (otherUser) {
          conversations.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
            unreadCount: 0, // Simplified for now
          });
        }
      }
    }

    return Array.from(conversations.values());
  }
}