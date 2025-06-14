import {
  users,
  messages,
  jobs,
  applications,
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
import { eq, or, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Password reset operations
  updateUserResetToken(userId: string, resetToken: string, expires: Date): Promise<void>;
  getUserByResetToken(resetToken: string): Promise<User | undefined>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  clearUserResetToken(userId: string): Promise<void>;
  
  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJobsByParent(parentId: string): Promise<Job[]>;
  getJob(jobId: string): Promise<Job | undefined>;
  
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
      .values(cleanUserData)
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

  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
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
}

export const storage = new DatabaseStorage();