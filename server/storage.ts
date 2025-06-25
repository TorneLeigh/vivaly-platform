import {
  users,
  messages,
  jobs,
  applications,
  bookings,
  nannies,
  nannyShares,
  nannyShareApplications,
  type User,
  type InsertUser,
  type Message,
  type InsertMessage,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type NannyShare,
  type InsertNannyShare,
  type NannyShareApplication,
  type InsertNannyShareApplication,
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
  updateUserActiveRole(userId: string, activeRole: string): Promise<User>;
  
  // Profile photo operations
  updateUserProfilePhoto(userId: string, photoUrl: string): Promise<User>;
  getUserById(userId: string): Promise<User | undefined>;
  addUserPhotos(userId: string, photos: any[]): Promise<void>;
  getUserPhotos(userId: string): Promise<any[]>;
  deleteUserPhoto(userId: string, photoId: string): Promise<void>;
  setMainPhoto(userId: string, photoId: string): Promise<void>;
  
  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  
  // Booking operations
  createBooking(booking: any): Promise<any>;
  getBooking(id: string): Promise<any>;
  updateBooking(id: string, booking: any): Promise<any>;
  getAllBookings(): Promise<any[]>;
  getBookingsByParent(parentId: string): Promise<any[]>;
  getBookingsByCaregiver(caregiverId: string): Promise<any[]>;
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
  
  // Caregiver operations
  getFeaturedNannies(): Promise<any[]>;
  getNannies(): Promise<any[]>;
  getNannyByUserId(userId: string): Promise<any>;
  createNanny(nannyData: any): Promise<any>;
  updateNanny(nannyId: number, nannyData: any): Promise<any>;
  updateCaregiverProfileSection(userId: string, section: string, data: any): Promise<void>;
  getCaregiverProfile(userId: string): Promise<any>;
  
  // Nanny Share operations
  createNannyShare(nannyShare: InsertNannyShare): Promise<NannyShare>;
  getNannyShares(): Promise<NannyShare[]>;
  getNannyShare(shareId: string): Promise<NannyShare | undefined>;
  updateNannyShare(shareId: string, updates: Partial<NannyShare>): Promise<NannyShare>;
  joinNannyShare(shareId: string, parentId: string): Promise<NannyShare>;
  assignNannyToShare(shareId: string, nannyId: string): Promise<NannyShare>;
  getNannySharesByParent(parentId: string): Promise<NannyShare[]>;
  createNannyShareApplication(application: InsertNannyShareApplication): Promise<NannyShareApplication>;
  getNannyShareApplications(shareId: string): Promise<NannyShareApplication[]>;
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

  async updateUserActiveRole(userId: string, activeRole: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ activeRole })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async updateUserProfilePhoto(userId: string, photoUrl: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ profileImageUrl: photoUrl })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Photo operations
  async addUserPhotos(userId: string, photos: any[]): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const existingPhotos = user.photos ? JSON.parse(user.photos) : [];
    const updatedPhotos = [...existingPhotos, ...photos];

    await db
      .update(users)
      .set({ photos: JSON.stringify(updatedPhotos) })
      .where(eq(users.id, userId));
  }

  async getUserPhotos(userId: string): Promise<any[]> {
    const user = await this.getUserById(userId);
    if (!user || !user.photos) return [];
    
    try {
      return JSON.parse(user.photos);
    } catch {
      return [];
    }
  }

  async deleteUserPhoto(userId: string, photoId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const existingPhotos = user.photos ? JSON.parse(user.photos) : [];
    const filteredPhotos = existingPhotos.filter((photo: any) => photo.id !== photoId);

    await db
      .update(users)
      .set({ photos: JSON.stringify(filteredPhotos) })
      .where(eq(users.id, userId));
  }

  async setMainPhoto(userId: string, photoId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const existingPhotos = user.photos ? JSON.parse(user.photos) : [];
    const updatedPhotos = existingPhotos.map((photo: any) => ({
      ...photo,
      isMain: photo.id === photoId
    }));

    // Update main profile image URL
    const mainPhoto = updatedPhotos.find((photo: any) => photo.id === photoId);
    if (mainPhoto) {
      await db
        .update(users)
        .set({ 
          photos: JSON.stringify(updatedPhotos),
          profileImageUrl: mainPhoto.url
        })
        .where(eq(users.id, userId));
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async upsertParentProfile(profileData: any): Promise<any> {
    // For now, we'll store parent profile data in user table extensions
    // In future, this could use a dedicated parent_profiles table
    return await this.updateUser(profileData.userId, profileData);
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
        // Parent info as separate columns
        parentFirstName: users.firstName,
        parentLastName: users.lastName,
        parentProfileImageUrl: users.profileImageUrl,
        parentSuburb: jobs.suburb
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.parentId, users.id))
      .orderBy(jobs.createdAt);
    
    // Transform the flat structure to include nested parentProfile
    return jobsWithParents.map(job => ({
      ...job,
      parentProfile: {
        firstName: job.parentFirstName,
        lastName: job.parentLastName,
        profilePhoto: job.parentProfileImageUrl,
        suburb: job.parentSuburb
      }
    }));
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
        content: messageData.text || "Application submitted",
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
        .where(eq(bookings.nannyId, parseInt(caregiverId)))
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
        .where(or(
          eq(bookings.parentId, userId),
          eq(bookings.nannyId, parseInt(userId))
        ))
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
        .set({ status })
        .where(eq(bookings.id, bookingId))
        .returning();
      
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }

  // Enhanced booking operations for Stripe integration
  async createBooking(booking: any): Promise<any> {
    try {
      // Store booking data in a JSON field or extend the bookings table
      const bookingData = {
        id: booking.id,
        parentId: booking.parentId,
        nannyId: parseInt(booking.caregiverId),
        serviceType: booking.serviceType || 'childcare',
        date: booking.startDate,
        startTime: booking.startTime || '09:00',
        endTime: booking.endTime || '17:00',
        totalAmount: booking.totalAmount.toString(),
        status: booking.status,
        notes: booking.notes || '',
        paymentStatus: booking.paymentStatus || 'unpaid',
        stripeSessionId: booking.stripeSessionId || null,
        stripePaymentIntentId: booking.stripePaymentIntentId || null,
        serviceFee: booking.serviceFee || 0,
        caregiverAmount: booking.caregiverAmount || 0,
        personalDetailsVisible: booking.personalDetailsVisible || false
      };

      const [newBooking] = await db
        .insert(bookings)
        .values(bookingData)
        .returning();
      
      return { ...newBooking, ...booking };
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async getBooking(id: string): Promise<any> {
    try {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);
      
      return booking;
    } catch (error) {
      console.error("Error getting booking:", error);
      return null;
    }
  }

  async updateBooking(id: string, booking: any): Promise<any> {
    try {
      const [updatedBooking] = await db
        .update(bookings)
        .set({
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          stripeSessionId: booking.stripeSessionId,
          stripePaymentIntentId: booking.stripePaymentIntentId,
          personalDetailsVisible: booking.personalDetailsVisible,
          notes: booking.notes
        })
        .where(eq(bookings.id, id))
        .returning();
      
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  async getAllBookings(): Promise<any[]> {
    try {
      const allBookings = await db
        .select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt));
      
      return allBookings;
    } catch (error) {
      console.error("Error getting all bookings:", error);
      return [];
    }
  }

  async getBookingsByParent(parentId: string): Promise<any[]> {
    try {
      const parentBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.parentId, parentId))
        .orderBy(desc(bookings.createdAt));
      
      return parentBookings;
    } catch (error) {
      console.error("Error getting parent bookings:", error);
      return [];
    }
  }

  async getBookingsByCaregiver(caregiverId: string): Promise<any[]> {
    try {
      const caregiverBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.nannyId, parseInt(caregiverId)))
        .orderBy(desc(bookings.createdAt));
      
      return caregiverBookings;
    } catch (error) {
      console.error("Error getting caregiver bookings:", error);
      return [];
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<any> {
    try {
      const [updatedBooking] = await db
        .update(bookings)
        .set({ status })
        .where(eq(bookings.id, parseInt(bookingId)))
        .returning();
      
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }

  async getCaregiverProfile(userId: string): Promise<any> {
    try {
      const [caregiverProfile] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      return caregiverProfile || {};
    } catch (error) {
      console.error("Error fetching caregiver profile:", error);
      return {};
    }
  }

  async getFeaturedNannies(): Promise<any[]> {
    try {
      const result = await db.execute(`
        SELECT 
          n.id, n.user_id as "userId", n.bio, n.experience, n.hourly_rate as "hourlyRate", 
          n.location, n.suburb, n.rating, n.review_count as "reviewCount", 
          n.services, n.certificates, n.is_verified as "isVerified",
          u.first_name as "firstName", u.last_name as "lastName", 
          u.email, u.profile_image_url as "profileImageUrl"
        FROM nannies n 
        LEFT JOIN users u ON n.user_id::text = u.id 
        WHERE n.is_verified = true 
        ORDER BY n.rating DESC 
        LIMIT 6
      `);
      return result.rows || [];
    } catch (error) {
      console.error("Get featured nannies error:", error);
      return [];
    }
  }

  async getNannies(): Promise<any[]> {
    try {
      const result = await db.execute(`
        SELECT 
          n.id, n.user_id as "userId", n.bio, n.experience, n.hourly_rate as "hourlyRate", 
          n.location, n.suburb, n.rating, n.review_count as "reviewCount", 
          n.services, n.certificates, n.is_verified as "isVerified",
          u.first_name as "firstName", u.last_name as "lastName", 
          u.email, u.profile_image_url as "profileImageUrl"
        FROM nannies n 
        LEFT JOIN users u ON n.user_id::text = u.id 
        WHERE n.is_verified = true 
        ORDER BY n.rating DESC
      `);
      return result.rows || [];
    } catch (error) {
      console.error("Get nannies error:", error);
      return [];
    }
  }

  async getNannyByUserId(userId: string): Promise<any> {
    try {
      const [nanny] = await db.select().from(nannies).where(eq(nannies.userId, parseInt(userId)));
      return nanny;
    } catch (error) {
      console.error("Get nanny by user ID error:", error);
      return null;
    }
  }

  async createNanny(nannyData: any): Promise<any> {
    try {
      const [nanny] = await db.insert(nannies).values(nannyData).returning();
      return nanny;
    } catch (error) {
      console.error("Create nanny error:", error);
      throw error;
    }
  }

  async updateNanny(nannyId: number, nannyData: any): Promise<any> {
    try {
      // Filter out undefined values and prepare data for database
      const filteredData: any = {};
      
      Object.keys(nannyData).forEach(key => {
        if (nannyData[key] !== undefined) {
          // Handle specific field mappings
          if (key === 'hourlyRate') {
            filteredData.hourly_rate = nannyData[key];
          } else if (key === 'hasFirstAid') {
            filteredData.has_first_aid = nannyData[key];
          } else if (key === 'hasWwcc') {
            filteredData.has_wwcc = nannyData[key];
          } else if (key === 'hasPoliceCheck') {
            filteredData.has_police_check = nannyData[key];
          } else if (key === 'hasReferences') {
            filteredData.has_references = nannyData[key];
          } else if (key === 'reviewCount') {
            filteredData.review_count = nannyData[key];
          } else if (key === 'isVerified') {
            filteredData.is_verified = nannyData[key];
          } else {
            filteredData[key] = nannyData[key];
          }
        }
      });

      if (Object.keys(filteredData).length === 0) {
        // Get current nanny for return
        const [currentNanny] = await db.select().from(nannies).where(eq(nannies.id, nannyId));
        return currentNanny;
      }

      const [nanny] = await db
        .update(nannies)
        .set(filteredData)
        .where(eq(nannies.id, nannyId))
        .returning();
      return nanny;
    } catch (error) {
      console.error("Update nanny error:", error);
      throw error;
    }
  }

  async updateCaregiverProfileSection(userId: string, section: string, data: any): Promise<void> {
    try {
      // Get or create nanny profile
      let nannyProfile = await this.getNannyByUserId(userId);
      
      if (!nannyProfile) {
        // Create new nanny profile with defaults
        nannyProfile = await this.createNanny({
          userId: parseInt(userId),
          bio: "",
          experience: 0,
          hourlyRate: "0",
          location: "",
          suburb: "",
          services: [],
          certificates: [],
          availability: {},
          isVerified: false,
          hasPoliceCheck: false,
          rating: "0",
          reviewCount: 0
        });
      }

      // Update nanny profile based on section
      const updateData: any = {};
      
      switch (section) {
        case 'basic':
          if (data.bio !== undefined) updateData.bio = data.bio;
          if (data.experience !== undefined) updateData.experience = parseInt(data.experience) || 0;
          if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate?.toString();
          if (data.location !== undefined) updateData.location = data.location;
          if (data.suburb !== undefined) updateData.suburb = data.suburb;
          break;
          
        case 'certifications':
          if (data.hasFirstAid !== undefined) updateData.hasFirstAid = data.hasFirstAid;
          if (data.hasWwcc !== undefined) updateData.hasWwcc = data.hasWwcc;
          if (data.hasPoliceCheck !== undefined) updateData.hasPoliceCheck = data.hasPoliceCheck;
          if (data.hasReferences !== undefined) updateData.hasReferences = data.hasReferences;
          if (data.certifications !== undefined) updateData.certificates = data.certifications;
          break;
          
        case 'services':
          if (data.servicesOffered !== undefined) updateData.services = data.servicesOffered;
          break;
          
        case 'availability':
          if (data.availableDays !== undefined || data.preferredStartTime !== undefined) {
            updateData.availability = {
              days: data.availableDays || [],
              startTime: data.preferredStartTime || "",
              endTime: data.preferredEndTime || "",
              minimumHours: data.minimumHours || "",
              maximumHours: data.maximumHours || ""
            };
          }
          break;
          
        case 'personal':
          if (data.personalityDescription !== undefined) updateData.personalityDescription = data.personalityDescription;
          if (data.approach !== undefined) updateData.approach = data.approach;
          if (data.specialInstructions !== undefined) updateData.specialInstructions = data.specialInstructions;
          break;
      }

      // Update the nanny profile if there are changes
      if (Object.keys(updateData).length > 0) {
        await this.updateNanny(nannyProfile.id, updateData);
      }
      
      // Also update user basic info if needed
      if (section === 'basic') {
        const userUpdateData: any = {};
        if (data.firstName !== undefined) userUpdateData.firstName = data.firstName;
        if (data.lastName !== undefined) userUpdateData.lastName = data.lastName;
        if (data.phone !== undefined) userUpdateData.phone = data.phone;
        
        if (Object.keys(userUpdateData).length > 0) {
          await this.updateUser(userId, userUpdateData);
        }
      }
    } catch (error) {
      console.error("Update caregiver profile section error:", error);
      throw error;
    }
  }

  // Nanny Share operations
  async createNannyShare(nannyShareData: InsertNannyShare): Promise<NannyShare> {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const shareToInsert = {
      ...nannyShareData,
      id: shareId,
      participants: [nannyShareData.creatorId], // Creator is automatically a participant
    };

    const [nannyShare] = await db
      .insert(nannyShares)
      .values(shareToInsert)
      .returning();
    return nannyShare;
  }

  async getNannyShares(): Promise<NannyShare[]> {
    const shares = await db
      .select({
        id: nannyShares.id,
        creatorId: nannyShares.creatorId,
        title: nannyShares.title,
        location: nannyShares.location,
        suburb: nannyShares.suburb,
        rate: nannyShares.rate,
        schedule: nannyShares.schedule,
        startDate: nannyShares.startDate,
        endDate: nannyShares.endDate,
        maxFamilies: nannyShares.maxFamilies,
        childrenDetails: nannyShares.childrenDetails,
        requirements: nannyShares.requirements,
        nannyId: nannyShares.nannyId,
        status: nannyShares.status,
        participants: nannyShares.participants,
        createdAt: nannyShares.createdAt,
        updatedAt: nannyShares.updatedAt,
        // Creator info
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
        creatorProfileImageUrl: users.profileImageUrl,
      })
      .from(nannyShares)
      .leftJoin(users, eq(nannyShares.creatorId, users.id))
      .orderBy(desc(nannyShares.createdAt));

    return shares.map(share => ({
      ...share,
      creatorProfile: {
        firstName: share.creatorFirstName,
        lastName: share.creatorLastName,
        profileImageUrl: share.creatorProfileImageUrl,
      }
    }));
  }

  async getNannyShare(shareId: string): Promise<NannyShare | undefined> {
    const [share] = await db.select().from(nannyShares).where(eq(nannyShares.id, shareId));
    return share;
  }

  async updateNannyShare(shareId: string, updates: Partial<NannyShare>): Promise<NannyShare> {
    const [updatedShare] = await db
      .update(nannyShares)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(nannyShares.id, shareId))
      .returning();
    return updatedShare;
  }

  async joinNannyShare(shareId: string, parentId: string): Promise<NannyShare> {
    const share = await this.getNannyShare(shareId);
    if (!share) throw new Error("Share not found");

    const currentParticipants = Array.isArray(share.participants) ? share.participants : [];
    
    if (!currentParticipants.includes(parentId) && currentParticipants.length < (share.maxFamilies || 2)) {
      const updatedParticipants = [...currentParticipants, parentId];
      const status = updatedParticipants.length >= (share.maxFamilies || 2) ? "full" : "open";
      
      return await this.updateNannyShare(shareId, { 
        participants: updatedParticipants,
        status 
      });
    }
    
    return share;
  }

  async assignNannyToShare(shareId: string, nannyId: string): Promise<NannyShare> {
    return await this.updateNannyShare(shareId, { 
      nannyId, 
      status: "active" 
    });
  }

  async getNannySharesByParent(parentId: string): Promise<NannyShare[]> {
    const shares = await db
      .select()
      .from(nannyShares)
      .where(or(
        eq(nannyShares.creatorId, parentId)
      ))
      .orderBy(desc(nannyShares.createdAt));
    
    // Filter shares where parent is a participant
    return shares.filter(share => 
      share.creatorId === parentId || 
      (Array.isArray(share.participants) && share.participants.includes(parentId))
    );
  }

  async createNannyShareApplication(applicationData: InsertNannyShareApplication): Promise<NannyShareApplication> {
    const [application] = await db
      .insert(nannyShareApplications)
      .values(applicationData)
      .returning();
    return application;
  }

  async getNannyShareApplications(shareId: string): Promise<NannyShareApplication[]> {
    return await db
      .select()
      .from(nannyShareApplications)
      .where(eq(nannyShareApplications.shareId, shareId))
      .orderBy(nannyShareApplications.appliedAt);
  }
}

export const storage = new DatabaseStorage();