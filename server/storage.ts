import { 
  users, nannies, bookings, reviews, messages, experiences, childcareProviders, childcareEnrollments,
  type User, type InsertUser,
  type Nanny, type InsertNanny,
  type Booking, type InsertBooking, 
  type Review, type InsertReview,
  type Message, type InsertMessage,
  type Experience, type InsertExperience,
  type ChildcareProvider, type InsertChildcareProvider,
  type ChildcareEnrollment, type InsertChildcareEnrollment,
  SERVICE_TYPES, CERTIFICATE_TYPES, SYDNEY_SUBURBS
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Nannies
  getNanny(id: number): Promise<Nanny | undefined>;
  getNannyByUserId(userId: number): Promise<Nanny | undefined>;
  createNanny(nanny: InsertNanny): Promise<Nanny>;
  updateNanny(id: number, updates: Partial<Nanny>): Promise<Nanny | undefined>;
  searchNannies(filters: {
    location?: string;
    serviceType?: string;
    date?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<(Nanny & { user: User })[]>;
  getFeaturedNannies(): Promise<(Nanny & { user: User })[]>;

  // Experiences
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  getExperiencesByCaregiver(caregiverId: number): Promise<Experience[]>;
  searchExperiences(filters: {
    location?: string;
    serviceType?: string;
    ageRange?: string;
    maxPrice?: number;
  }): Promise<(Experience & { caregiver: User })[]>;
  getFeaturedExperiences(): Promise<(Experience & { caregiver: User })[]>;

  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByNanny(nannyId: number): Promise<Booking[]>;
  getBookingsByParent(parentId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByNanny(nannyId: number): Promise<(Review & { reviewer: User })[]>;

  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<(Message & { sender: User, receiver: User })[]>;
  getConversations(userId: number): Promise<{ user: User, lastMessage: Message, unreadCount: number }[]>;

  // Childcare Providers
  getChildcareProvider(id: number): Promise<ChildcareProvider | undefined>;
  getChildcareProviderByUserId(userId: number): Promise<ChildcareProvider | undefined>;
  createChildcareProvider(provider: InsertChildcareProvider): Promise<ChildcareProvider>;
  updateChildcareProvider(id: number, updates: Partial<ChildcareProvider>): Promise<ChildcareProvider | undefined>;
  searchChildcareProviders(filters: {
    suburb?: string;
    ageGroups?: string[];
    maxRate?: number;
    availableSpots?: boolean;
  }): Promise<(ChildcareProvider & { user: User })[]>;
  getFeaturedChildcareProviders(): Promise<(ChildcareProvider & { user: User })[]>;

  // Childcare Enrollments
  getChildcareEnrollment(id: number): Promise<ChildcareEnrollment | undefined>;
  createChildcareEnrollment(enrollment: InsertChildcareEnrollment): Promise<ChildcareEnrollment>;
  getEnrollmentsByProvider(providerId: number): Promise<(ChildcareEnrollment & { parent: User })[]>;
  getEnrollmentsByParent(parentId: number): Promise<(ChildcareEnrollment & { provider: ChildcareProvider })[]>;
  updateEnrollmentStatus(id: number, status: string): Promise<ChildcareEnrollment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private nannies: Map<number, Nanny> = new Map();
  private experiences: Map<number, Experience> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private reviews: Map<number, Review> = new Map();
  private messages: Map<number, Message> = new Map();
  private childcareProviders: Map<number, ChildcareProvider> = new Map();
  private childcareEnrollments: Map<number, ChildcareEnrollment> = new Map();
  
  private currentUserId = 1;
  private currentNannyId = 1;
  private currentExperienceId = 1;
  private currentBookingId = 1;
  private currentReviewId = 1;
  private currentMessageId = 1;
  private currentChildcareProviderId = 1;
  private currentChildcareEnrollmentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users and nannies
    const sampleUsers = [
      { email: "sarah.m@email.com", password: "password", firstName: "Sarah", lastName: "Matthews", phone: "0412345678", isNanny: true },
      { email: "emma.k@email.com", password: "password", firstName: "Emma", lastName: "Kennedy", phone: "0423456789", isNanny: true },
      { email: "lisa.t@email.com", password: "password", firstName: "Lisa", lastName: "Thompson", phone: "0434567890", isNanny: true },
      { email: "rachel.d@email.com", password: "password", firstName: "Rachel", lastName: "Davis", phone: "0445678901", isNanny: true },
      { email: "maria.c@email.com", password: "password", firstName: "Maria", lastName: "Chen", phone: "0467890123", isNanny: true },
      { email: "sophie.w@email.com", password: "password", firstName: "Sophie", lastName: "Wilson", phone: "0478901234", isNanny: true },
      { email: "jessica.l@email.com", password: "password", firstName: "Jessica", lastName: "Lopez", phone: "0489012345", isNanny: true },
      { email: "amy.r@email.com", password: "password", firstName: "Amy", lastName: "Robinson", phone: "0490123456", isNanny: true },
      { email: "parent@email.com", password: "password", firstName: "Jane", lastName: "Smith", phone: "0456789012", isNanny: false },
    ];

    const serviceOptions = [
      [SERVICE_TYPES[0], SERVICE_TYPES[1]], // Traditional childcare
      [SERVICE_TYPES[0], SERVICE_TYPES[2]], // 1-on-1 Care + Group Play (Eastern Suburbs)
      [SERVICE_TYPES[4]], // Postpartum
      [SERVICE_TYPES[5], SERVICE_TYPES[4]], // Breastfeeding + postpartum
      [SERVICE_TYPES[6], SERVICE_TYPES[7]], // Birth education + postnatal
      [SERVICE_TYPES[0], SERVICE_TYPES[2]], // Mix of care types
      [SERVICE_TYPES[1], SERVICE_TYPES[3]], // Group services
      [SERVICE_TYPES[5], SERVICE_TYPES[7]], // Midwife services
      [SERVICE_TYPES[8]], // Elderly Companionship
      [SERVICE_TYPES[9]], // Elderly Care
      [SERVICE_TYPES[11], SERVICE_TYPES[12]], // Pet sitting + Dog walking
      [SERVICE_TYPES[13], SERVICE_TYPES[14]], // Pet boarding + grooming
      [SERVICE_TYPES[15], SERVICE_TYPES[16]], // Pet training + overnight care
    ];

    const certificateOptions = [
      [CERTIFICATE_TYPES[0], CERTIFICATE_TYPES[1], CERTIFICATE_TYPES[5]], // Basic childcare
      [CERTIFICATE_TYPES[2], CERTIFICATE_TYPES[3]], // Education focused
      [CERTIFICATE_TYPES[11], CERTIFICATE_TYPES[12]], // Midwife certs
      [CERTIFICATE_TYPES[13], CERTIFICATE_TYPES[14]], // Doula training
      [CERTIFICATE_TYPES[0], CERTIFICATE_TYPES[4]], // Montessori
      [CERTIFICATE_TYPES[1], CERTIFICATE_TYPES[2]], // CPR + Cert III
      [CERTIFICATE_TYPES[15], CERTIFICATE_TYPES[16]], // Aged care
      [CERTIFICATE_TYPES[17], CERTIFICATE_TYPES[0]], // Companion care
      [CERTIFICATE_TYPES[6], CERTIFICATE_TYPES[7]], // Pet care basic
      [CERTIFICATE_TYPES[8], CERTIFICATE_TYPES[9]], // Dog training + vet assistant
      [CERTIFICATE_TYPES[10], CERTIFICATE_TYPES[7]], // Animal behavior + pet first aid
    ];

    for (let i = 0; i < sampleUsers.length; i++) {
      const userData = sampleUsers[i];
      const user: User = { 
        ...userData, 
        id: this.currentUserId++, 
        profileImage: "", 
        createdAt: new Date(),
        phone: userData.phone || null,
        isNanny: userData.isNanny || false
      };
      this.users.set(user.id, user);

      if (user.isNanny) {
        let serviceSet = serviceOptions[i % serviceOptions.length];
        
        // Ensure each suburb has at least one "1-on-1 Care" provider
        if (i === 1) { // Emma Kennedy in Eastern Suburbs
          serviceSet = [SERVICE_TYPES[0], SERVICE_TYPES[2]]; // "1-on-1 Care" + "Group Play"
        }
        const certSet = certificateOptions[i % certificateOptions.length];
        
        const nannyData: Nanny = {
          id: this.currentNannyId++,
          userId: user.id,
          bio: `Experienced childcare provider with a passion for nurturing children's development.`,
          experience: Math.floor(Math.random() * 8) + 2,
          hourlyRate: (Math.floor(Math.random() * 15) + 20).toString(),
          location: "Sydney, NSW",
          suburb: ["Inner Sydney", "Eastern Suburbs", "Northern Beaches", "North Shore", "Western Sydney", "Southern Sydney", "Southwest Sydney", "Northwest Sydney"][i % 8],
          services: serviceSet,
          certificates: certSet,
          availability: {},
          isVerified: true,
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          reviewCount: Math.floor(Math.random() * 50) + 10,
        };
        this.nannies.set(nannyData.id, nannyData);
      }
    }

    // Add sample bookings for dashboard testing
    const sampleBookings = [
      {
        nannyId: 1,
        parentId: 9, // Parent user
        serviceType: "1-on-1 Care",
        date: new Date(), // Today
        startTime: "09:00",
        endTime: "17:00",
        status: "confirmed",
        totalAmount: "240.00",
        notes: "Please bring snacks for Emma"
      },
      {
        nannyId: 1,
        parentId: 9,
        serviceType: "Babysitting",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        startTime: "18:00",
        endTime: "22:00",
        status: "confirmed",
        totalAmount: "120.00",
        notes: "Date night sitting"
      },
      {
        nannyId: 1,
        parentId: 9,
        serviceType: "1-on-1 Care",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        startTime: "10:00",
        endTime: "16:00",
        status: "completed",
        totalAmount: "180.00",
        notes: "Great day at the park"
      },
      {
        nannyId: 1,
        parentId: 9,
        serviceType: "Group Care",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
        startTime: "14:00",
        endTime: "18:00",
        status: "completed",
        totalAmount: "160.00",
        notes: "Craft activities"
      }
    ];

    for (const bookingData of sampleBookings) {
      const booking: Booking = {
        ...bookingData,
        id: this.currentBookingId++,
        createdAt: new Date(),
      };
      this.bookings.set(booking.id, booking);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Nannies
  async getNanny(id: number): Promise<Nanny | undefined> {
    return this.nannies.get(id);
  }

  async getNannyByUserId(userId: number): Promise<Nanny | undefined> {
    return Array.from(this.nannies.values()).find(nanny => nanny.userId === userId);
  }

  async createNanny(nannyData: InsertNanny): Promise<Nanny> {
    const nanny: Nanny = {
      ...nannyData,
      id: this.currentNannyId++,
      rating: "0",
      reviewCount: 0,
    };
    this.nannies.set(nanny.id, nanny);
    return nanny;
  }

  async updateNanny(id: number, updates: Partial<Nanny>): Promise<Nanny | undefined> {
    const nanny = this.nannies.get(id);
    if (!nanny) return undefined;
    
    const updatedNanny = { ...nanny, ...updates };
    this.nannies.set(id, updatedNanny);
    return updatedNanny;
  }

  async searchNannies(filters: {
    location?: string;
    serviceType?: string;
    date?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<(Nanny & { user: User })[]> {
    let results = Array.from(this.nannies.values());
    
    if (filters.location && filters.location !== "All Sydney" && filters.location.trim() !== "") {
      const searchLocation = filters.location.toLowerCase().trim();
      results = results.filter(nanny => {
        const nannyLocation = nanny.location.toLowerCase();
        const nannySuburb = nanny.suburb.toLowerCase();
        
        return nannyLocation.includes(searchLocation) ||
               nannySuburb.includes(searchLocation) ||
               searchLocation.includes(nannySuburb) ||
               nannySuburb === searchLocation;
      });
    }

    if (filters.serviceType && filters.serviceType !== "All Services" && filters.serviceType.trim() !== "") {
      const searchServiceType = filters.serviceType.trim();
      results = results.filter(nanny => {
        if (!nanny.services) return false;
        return nanny.services.includes(searchServiceType);
      });
    }

    if (filters.minRate) {
      results = results.filter(nanny => parseFloat(nanny.hourlyRate!) >= filters.minRate!);
    }

    if (filters.maxRate) {
      results = results.filter(nanny => parseFloat(nanny.hourlyRate!) <= filters.maxRate!);
    }

    return results.map(nanny => ({
      ...nanny,
      user: this.users.get(nanny.userId)!
    }));
  }

  async getFeaturedNannies(): Promise<(Nanny & { user: User })[]> {
    const nannies = Array.from(this.nannies.values())
      .filter(nanny => nanny.isVerified)
      .sort((a, b) => parseFloat(b.rating!) - parseFloat(a.rating!))
      .slice(0, 4);

    return nannies.map(nanny => ({
      ...nanny,
      user: this.users.get(nanny.userId)!
    }));
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      ...bookingData,
      id: this.currentBookingId++,
      createdAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async getBookingsByNanny(nannyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.nannyId === nannyId);
  }

  async getBookingsByParent(parentId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.parentId === parentId);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    booking.status = status;
    this.bookings.set(id, booking);
    return booking;
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const review: Review = {
      ...reviewData,
      id: this.currentReviewId++,
      createdAt: new Date(),
    };
    this.reviews.set(review.id, review);
    return review;
  }

  async getReviewsByNanny(nannyId: number): Promise<(Review & { reviewer: User })[]> {
    const reviews = Array.from(this.reviews.values()).filter(review => review.revieweeId === nannyId);
    return reviews.map(review => ({
      ...review,
      reviewer: this.users.get(review.reviewerId)!
    }));
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    // Content filtering to prevent external contact sharing
    const blockedPatterns = [
      /\b\d{10,}\b/, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
      /whatsapp|telegram|signal|viber/i, // Messaging apps
      /facebook|instagram|twitter|snapchat/i, // Social media
    ];

    const isBlocked = blockedPatterns.some(pattern => pattern.test(messageData.content));

    const message: Message = {
      ...messageData,
      id: this.currentMessageId++,
      isBlocked,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<(Message & { sender: User, receiver: User })[]> {
    const messages = Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

    return messages.map(message => ({
      ...message,
      sender: this.users.get(message.senderId)!,
      receiver: this.users.get(message.receiverId)!
    }));
  }

  async getConversations(userId: number): Promise<{ user: User, lastMessage: Message, unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId);

    const conversations = new Map<number, { user: User, lastMessage: Message, unreadCount: number }>();

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = this.users.get(otherUserId)!;

      if (!conversations.has(otherUserId) || message.createdAt! > conversations.get(otherUserId)!.lastMessage.createdAt!) {
        conversations.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0 // Simplified for demo
        });
      }
    }

    return Array.from(conversations.values());
  }

  // Experience methods
  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(experienceData: InsertExperience): Promise<Experience> {
    const experience: Experience = {
      id: this.currentExperienceId++,
      caregiverId: experienceData.caregiverId,
      firstName: experienceData.firstName,
      lastName: experienceData.lastName,
      email: experienceData.email,
      phone: experienceData.phone,
      bio: experienceData.bio,
      title: experienceData.title,
      description: experienceData.description,
      serviceType: experienceData.serviceType,
      duration: experienceData.duration,
      isFree: experienceData.isFree || false,
      price: experienceData.price || null,
      maxParticipants: experienceData.maxParticipants,
      ageRange: experienceData.ageRange,
      location: experienceData.location,
      photos: experienceData.photos || [],
      inclusions: experienceData.inclusions || [],
      requirements: experienceData.requirements || [],
      availability: experienceData.availability || [],
      instantBook: experienceData.instantBook || false,
      isActive: experienceData.isActive ?? true,
      rating: "0",
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.experiences.set(experience.id, experience);
    return experience;
  }

  async getExperiencesByCaregiver(caregiverId: number): Promise<Experience[]> {
    return Array.from(this.experiences.values())
      .filter(experience => experience.caregiverId === caregiverId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchExperiences(filters: {
    location?: string;
    serviceType?: string;
    ageRange?: string;
    maxPrice?: number;
  }): Promise<(Experience & { caregiver: User })[]> {
    const experiences = Array.from(this.experiences.values()).filter(experience => {
      if (!experience.isActive) return false;
      if (filters.location && !experience.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.serviceType && experience.serviceType !== filters.serviceType) return false;
      if (filters.ageRange && experience.ageRange !== filters.ageRange) return false;
      if (filters.maxPrice && Number(experience.price) > filters.maxPrice) return false;
      return true;
    });

    return experiences.map(experience => {
      const caregiver = this.users.get(experience.caregiverId)!;
      return { ...experience, caregiver };
    }).sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  async getFeaturedExperiences(): Promise<(Experience & { caregiver: User })[]> {
    const featuredExperiences = Array.from(this.experiences.values())
      .filter(experience => experience.isActive)
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 6);

    return featuredExperiences.map(experience => {
      const caregiver = this.users.get(experience.caregiverId)!;
      return { ...experience, caregiver };
    });
  }

  // Childcare Provider methods
  async getChildcareProvider(id: number): Promise<ChildcareProvider | undefined> {
    return this.childcareProviders.get(id);
  }

  async getChildcareProviderByUserId(userId: number): Promise<ChildcareProvider | undefined> {
    for (const provider of this.childcareProviders.values()) {
      if (provider.userId === userId) {
        return provider;
      }
    }
    return undefined;
  }

  async createChildcareProvider(providerData: InsertChildcareProvider): Promise<ChildcareProvider> {
    const provider: ChildcareProvider = {
      ...providerData,
      id: this.currentChildcareProviderId++,
      currentEnrollments: 0,
      currentBabies: 0,
      verificationStatus: "pending",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.childcareProviders.set(provider.id, provider);
    return provider;
  }

  async updateChildcareProvider(id: number, updates: Partial<ChildcareProvider>): Promise<ChildcareProvider | undefined> {
    const provider = this.childcareProviders.get(id);
    if (!provider) return undefined;

    const updatedProvider = { ...provider, ...updates, updatedAt: new Date() };
    this.childcareProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  async searchChildcareProviders(filters: {
    suburb?: string;
    ageGroups?: string[];
    maxRate?: number;
    availableSpots?: boolean;
  }): Promise<(ChildcareProvider & { user: User })[]> {
    const results: (ChildcareProvider & { user: User })[] = [];

    for (const provider of this.childcareProviders.values()) {
      const user = this.users.get(provider.userId);
      if (!user) continue;

      // Apply filters
      if (filters.suburb && provider.suburb !== filters.suburb) continue;
      if (filters.maxRate && parseFloat(provider.hourlyRate) > filters.maxRate) continue;
      if (filters.availableSpots && provider.currentEnrollments >= provider.totalCapacity) continue;
      if (filters.ageGroups && filters.ageGroups.length > 0) {
        const hasMatchingAgeGroup = filters.ageGroups.some(age => 
          provider.ageGroups.includes(age)
        );
        if (!hasMatchingAgeGroup) continue;
      }

      results.push({ ...provider, user });
    }

    return results;
  }

  async getFeaturedChildcareProviders(): Promise<(ChildcareProvider & { user: User })[]> {
    const results: (ChildcareProvider & { user: User })[] = [];

    for (const provider of this.childcareProviders.values()) {
      const user = this.users.get(provider.userId);
      if (!user || !provider.isActive) continue;

      results.push({ ...provider, user });
    }

    return results.slice(0, 6);
  }

  // Childcare Enrollment methods
  async getChildcareEnrollment(id: number): Promise<ChildcareEnrollment | undefined> {
    return this.childcareEnrollments.get(id);
  }

  async createChildcareEnrollment(enrollmentData: InsertChildcareEnrollment): Promise<ChildcareEnrollment> {
    const enrollment: ChildcareEnrollment = {
      ...enrollmentData,
      id: this.currentChildcareEnrollmentId++,
      status: "pending",
      applicationDate: new Date(),
      createdAt: new Date(),
    };
    this.childcareEnrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async getEnrollmentsByProvider(providerId: number): Promise<(ChildcareEnrollment & { parent: User })[]> {
    const results: (ChildcareEnrollment & { parent: User })[] = [];

    for (const enrollment of this.childcareEnrollments.values()) {
      if (enrollment.providerId === providerId) {
        const parent = this.users.get(enrollment.parentUserId);
        if (parent) {
          results.push({ ...enrollment, parent });
        }
      }
    }

    return results;
  }

  async getEnrollmentsByParent(parentId: number): Promise<(ChildcareEnrollment & { provider: ChildcareProvider })[]> {
    const results: (ChildcareEnrollment & { provider: ChildcareProvider })[] = [];

    for (const enrollment of this.childcareEnrollments.values()) {
      if (enrollment.parentUserId === parentId) {
        const provider = this.childcareProviders.get(enrollment.providerId);
        if (provider) {
          results.push({ ...enrollment, provider });
        }
      }
    }

    return results;
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<ChildcareEnrollment | undefined> {
    const enrollment = this.childcareEnrollments.get(id);
    if (!enrollment) return undefined;

    const updatedEnrollment = { ...enrollment, status };
    this.childcareEnrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }
}

// Keep memory storage for now while we ensure authentication works properly
// Switch to database storage after testing authentication flow
export const storage = new MemStorage();
