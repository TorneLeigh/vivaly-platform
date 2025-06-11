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
import { eq, and, or, desc, sql, gte, lte } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Experience methods
  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async createExperience(experienceData: InsertExperience): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(experienceData).returning();
    return experience;
  }

  async getExperiencesByCaregiver(caregiverId: number): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.caregiverId, caregiverId));
  }

  async searchExperiences(filters: {
    location?: string;
    serviceType?: string;
    ageRange?: string;
    maxPrice?: number;
  }): Promise<(Experience & { caregiver: User })[]> {
    let query = db.select({
      ...experiences,
      caregiver: users
    })
    .from(experiences)
    .leftJoin(users, eq(experiences.caregiverId, parseInt(users.id)));

    return await query;
  }

  async getFeaturedExperiences(): Promise<(Experience & { caregiver: User })[]> {
    return await db.select({
      ...experiences,
      caregiver: users
    })
    .from(experiences)
    .leftJoin(users, eq(experiences.caregiverId, parseInt(users.id)))
    .limit(6);
  }

  // Childcare Provider methods
  async getChildcareProvider(id: number): Promise<ChildcareProvider | undefined> {
    const [provider] = await db.select().from(childcareProviders).where(eq(childcareProviders.id, id));
    return provider || undefined;
  }

  async getChildcareProviderByUserId(userId: number): Promise<ChildcareProvider | undefined> {
    const [provider] = await db.select().from(childcareProviders).where(eq(childcareProviders.userId, userId));
    return provider || undefined;
  }

  async createChildcareProvider(providerData: InsertChildcareProvider): Promise<ChildcareProvider> {
    const [provider] = await db.insert(childcareProviders).values(providerData).returning();
    return provider;
  }

  async updateChildcareProvider(id: number, updates: Partial<ChildcareProvider>): Promise<ChildcareProvider | undefined> {
    const [provider] = await db.update(childcareProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(childcareProviders.id, id))
      .returning();
    return provider || undefined;
  }

  async searchChildcareProviders(filters: {
    suburb?: string;
    ageGroups?: string[];
    maxRate?: number;
    availableSpots?: boolean;
  }): Promise<any[]> {
    // Return empty array for now since childcare providers table structure needs to be defined
    return [];
  }

  async getFeaturedChildcareProviders(): Promise<any[]> {
    // Return example daycare center for now
    return [{
      id: 1,
      centerName: "Little Stars Early Learning Centre",
      description: "A nurturing family-owned childcare centre in the heart of Bondi, providing quality early childhood education for children aged 6 months to 5 years. Our experienced educators focus on play-based learning in a safe, stimulating environment with outdoor play areas and modern facilities.",
      suburb: "Bondi Beach",
      hourlyRate: "15.50",
      dailyRate: "125.00",
      weeklyRate: "550.00",
      totalCapacity: 35,
      currentEnrollments: 28,
      ageGroups: ["0-2 years", "2-3 years", "3-5 years"],
      operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "07:00",
      endTime: "18:00",
      rating: "4.8",
      reviewCount: 24,
      user: {
        firstName: "Sarah",
        lastName: "Johnson",
        profileImage: null
      }
    }];
  }

  // Childcare Enrollment methods
  async getChildcareEnrollment(id: number): Promise<ChildcareEnrollment | undefined> {
    const [enrollment] = await db.select().from(childcareEnrollments).where(eq(childcareEnrollments.id, id));
    return enrollment || undefined;
  }

  async createChildcareEnrollment(enrollmentData: InsertChildcareEnrollment): Promise<ChildcareEnrollment> {
    const [enrollment] = await db.insert(childcareEnrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async getEnrollmentsByProvider(providerId: number): Promise<(ChildcareEnrollment & { parent: User })[]> {
    return await db.select({
      ...childcareEnrollments,
      parent: users
    })
    .from(childcareEnrollments)
    .leftJoin(users, eq(childcareEnrollments.parentUserId, parseInt(users.id)))
    .where(eq(childcareEnrollments.providerId, providerId));
  }

  async getEnrollmentsByParent(parentId: number): Promise<(ChildcareEnrollment & { provider: ChildcareProvider })[]> {
    return await db.select({
      ...childcareEnrollments,
      provider: childcareProviders
    })
    .from(childcareEnrollments)
    .leftJoin(childcareProviders, eq(childcareEnrollments.providerId, childcareProviders.id))
    .where(eq(childcareEnrollments.parentUserId, parentId));
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<ChildcareEnrollment | undefined> {
    const [enrollment] = await db.update(childcareEnrollments)
      .set({ status })
      .where(eq(childcareEnrollments.id, id))
      .returning();
    return enrollment || undefined;
  }

  // Parent Profile methods
  async getParentProfile(userId: string): Promise<ParentProfile | undefined> {
    const [profile] = await db.select().from(parentProfiles).where(eq(parentProfiles.userId, userId));
    return profile || undefined;
  }

  async createOrUpdateParentProfile(profileData: InsertParentProfile): Promise<ParentProfile> {
    const existing = await this.getParentProfile(profileData.userId);
    
    if (existing) {
      const [profile] = await db.update(parentProfiles)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(parentProfiles.userId, profileData.userId))
        .returning();
      return profile;
    } else {
      const [profile] = await db.insert(parentProfiles).values(profileData).returning();
      return profile;
    }
  }

  // Admin methods
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllNannies(): Promise<Nanny[]> {
    return await db.select().from(nannies);
  }

  async getRecentBookingsWithDetails(): Promise<(Booking & { nanny: Nanny & { user: User }, parent: User })[]> {
    return await db.select({
      ...bookings,
      nanny: nannies,
      user: users,
      parent: users
    })
    .from(bookings)
    .leftJoin(nannies, eq(bookings.nannyId, nannies.id))
    .leftJoin(users, eq(nannies.userId, parseInt(users.id)))
    .orderBy(desc(bookings.createdAt))
    .limit(10) as any;
  }

  async getPendingCaregivers(): Promise<(Nanny & { user: User })[]> {
    return await db.select({
      ...nannies,
      user: users
    })
    .from(nannies)
    .leftJoin(users, eq(nannies.userId, parseInt(users.id)))
    .where(eq(nannies.verificationStatus, 'pending'));
  }

  async updateCaregiverVerification(id: number, approved: boolean, reason?: string): Promise<Nanny | undefined> {
    const status = approved ? 'verified' : 'rejected';
    const [nanny] = await db.update(nannies)
      .set({ 
        verificationStatus: status,
        verificationNotes: reason,
        updatedAt: new Date()
      })
      .where(eq(nannies.id, id))
      .returning();
    return nanny || undefined;
  }

  async getTodayBookingsByCaregiver(userId: number): Promise<(Booking & { parent: User })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db.select({
      ...bookings,
      parent: users
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.parentId, parseInt(users.id)))
    .where(
      and(
        gte(bookings.date, today),
        lte(bookings.date, tomorrow)
      )
    );
  }

  // Missing utility method
  async createUserSimple(userData: User): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  // Users
  async getUser(id: string): Promise<User | undefined> {
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
    try {
      const results = await db
        .select()
        .from(nannies)
        .innerJoin(users, eq(nannies.userId, users.id))
        .where(eq(nannies.isVerified, true))
        .orderBy(sql`${nannies.rating} DESC NULLS LAST`)
        .limit(12);

      return results.map(row => ({
        ...row.nannies,
        user: row.users,
      }));
    } catch (error) {
      console.error('Error fetching featured nannies:', error);
      return [];
    }
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