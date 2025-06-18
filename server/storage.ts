import {
  users,
  messages,
  jobs,
  applications,
  bookings,
  nannies,
  type User,
  type InsertUser,
  type Message,
  type InsertMessage,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, or, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserProfile(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Password reset operations
  updateUserResetToken(userId: string, resetToken: string, expires: Date): Promise<void>;
  getUserByResetToken(resetToken: string): Promise<User | undefined>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  clearUserResetToken(userId: string): Promise<void>;
  
  // Role management operations
  updateUserRoles(userId: string, roles: string[]): Promise<User>;
  
  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  sendMessage(message: { senderId: string; receiverId: string; text: string; timestamp: Date }): Promise<Message>;
  getConversations(userId: string): Promise<any[]>;
  
  // Booking operations
  getParentBookings(parentId: string): Promise<any[]>;
  getCaregiverBookings(caregiverId: string): Promise<any[]>;
  getUserBookings(userId: string): Promise<any[]>;
  updateBookingStatus(bookingId: string, status: string): Promise<any>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<any[]>;
  getJobsByParent(parentId: string): Promise<Job[]>;
  getJob(jobId: string): Promise<Job | undefined>;
  updateJob(jobId: string, updates: Partial<Job>): Promise<Job>;
  deleteJob(jobId: string): Promise<void>;
  
  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByJob(jobId: string): Promise<Application[]>;
  getApplicationsByCaregiver(caregiverId: string): Promise<Application[]>;
}

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

  async getUserProfile(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Generate a simple unique ID for the user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Create clean user data, excluding form-only fields
    const cleanUserData = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      password: userData.password,
      roles: userData.roles || ["parent"], // Include roles field
      isNanny: userData.isNanny || false,
      allowCaregiverMessages: userData.allowCaregiverMessages || true,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Inserting user with clean data:", { ...cleanUserData, password: "[HIDDEN]" });
    
    const [user] = await db
      .insert(users)
      .values([cleanUserData])
      .returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Password reset operations
  async updateUserResetToken(userId: string, resetToken: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({
        resetToken: resetToken,
        resetTokenExpires: expires
      })
      .where(eq(users.id, userId));
  }

  async getUserByResetToken(resetToken: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, resetToken));
    return user;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async clearUserResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        resetToken: null,
        resetTokenExpires: null
      })
      .where(eq(users.id, userId));
  }

  async updateUserRoles(userId: string, roles: string[]): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        roles: roles
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Message operations
  async getMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  // Job operations
  async createJob(jobData: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(jobData)
      .returning();
    return job;
  }

  async getJobs(): Promise<any[]> {
    const jobsWithParents = await db
      .select({
        id: jobs.id,
        parentId: jobs.parentId,
        title: jobs.title,
        startDate: jobs.startDate,
        numChildren: jobs.numChildren,
        rate: jobs.rate,
        hoursPerWeek: jobs.hoursPerWeek,
        description: jobs.description,
        location: jobs.location,
        suburb: jobs.suburb,
        status: jobs.status,
        createdAt: jobs.createdAt,
        parentProfile: {
          firstName: users.firstName,
          lastName: users.lastName,
          profilePhoto: users.profileImageUrl,
          suburb: jobs.suburb
        }
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.parentId, users.id))
      .orderBy(jobs.createdAt);
    
    return jobsWithParents;
  }

  async getJobsByParent(parentId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.parentId, parentId))
      .orderBy(jobs.createdAt);
  }

  async getJob(jobId: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job;
  }

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, jobId))
      .returning();
    return updatedJob;
  }

  async deleteJob(jobId: string): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, jobId));
  }

  // Application operations
  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(applicationData)
      .returning();
    return application;
  }

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(applications.appliedAt);
  }

  async getApplicationsByCaregiver(caregiverId: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.caregiverId, caregiverId))
      .orderBy(applications.appliedAt);
  }

  // Messaging operations
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async sendMessage(messageData: { senderId: string; receiverId: string; text: string; timestamp: Date }): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.text,
        isBlocked: false
      })
      .returning();
    return message;
  }

  async getConversations(userId: string): Promise<any[]> {
    // Get all unique conversation partners with their latest messages
    const conversations = await db
      .select({
        partnerId: users.id,
        partnerName: users.firstName,
        partnerLastName: users.lastName,
        lastMessage: messages.content,
        lastMessageTime: messages.createdAt,
        isBlocked: messages.isBlocked
      })
      .from(messages)
      .leftJoin(users, or(
        and(eq(messages.senderId, users.id), eq(messages.receiverId, userId)),
        and(eq(messages.receiverId, users.id), eq(messages.senderId, userId))
      ))
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(messages.createdAt);

    // Group by partner and get latest message
    const conversationMap = new Map();
    
    conversations.forEach(conv => {
      if (conv.partnerId && conv.partnerId !== userId) {
        const key = conv.partnerId;
        if (!conversationMap.has(key) || 
            (conv.lastMessageTime && conv.lastMessageTime > conversationMap.get(key).lastMessageTime)) {
          conversationMap.set(key, {
            id: conv.partnerId,
            participantId: conv.partnerId,
            participantName: `${conv.partnerName || ''} ${conv.partnerLastName || ''}`.trim(),
            lastMessage: conv.lastMessage || '',
            lastMessageTime: conv.lastMessageTime || new Date(),
            unreadCount: 0,
            online: Math.random() > 0.5
          });
        }
      }
    });

    return Array.from(conversationMap.values());
  }

  // Booking operations
  async getParentBookings(parentId: string): Promise<any[]> {
    // For now, return empty array until we have actual booking data
    // The booking system will show empty state with calendar interface
    return [];
  }

  async getCaregiverBookings(caregiverId: string): Promise<any[]> {
    try {
      const userBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.caregiverId, caregiverId))
        .orderBy(desc(bookings.createdAt));
      
      return userBookings;
    } catch (error) {
      console.error("Error fetching caregiver bookings:", error);
      return [];
    }
  }

  async getUserBookings(userId: string): Promise<any[]> {
    try {
      const userBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.caregiverId, userId))
        .orderBy(desc(bookings.createdAt));
      
      return userBookings;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<any> {
    try {
      const [updatedBooking] = await db
        .update(bookings)
        .set({ status, updatedAt: new Date() })
        .where(eq(bookings.id, bookingId))
        .returning();
      
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking status:", error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();