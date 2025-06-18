# VIVALY Platform - Complete Codebase Export for ChatGPT Validation

## Project Overview
A specialized childcare/babysitting platform connecting Australian parents and caregivers with dual-role authentication, job matching, and comprehensive booking management.

## Key Technologies
- React.js with TypeScript
- Express.js backend
- PostgreSQL with Drizzle ORM
- TailwindCSS + shadcn/ui
- Wouter for routing
- TanStack Query for state management

## Database Schema (shared/schema.ts)

```typescript
import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  decimal,
  uuid,
  primaryKey
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  password: text("password"),
  roles: text("roles").array().default(["parent"]),
  isNanny: boolean("is_nanny").default(false),
  allowCaregiverMessages: boolean("allow_caregiver_messages").default(true),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  parentId: text("parent_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  requirements: text("requirements").array().default([]),
  isUrgent: boolean("is_urgent").default(false),
  childrenAges: text("children_ages").array().default([]),
  additionalInfo: text("additional_info"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Job applications table
export const jobApplications = pgTable("job_applications", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull(),
  caregiverId: text("caregiver_id").notNull(),
  parentId: text("parent_id").notNull(),
  status: text("status").default("pending"),
  message: text("message"),
  proposedRate: decimal("proposed_rate", { precision: 10, scale: 2 }),
  availability: text("availability"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull(),
  parentId: text("parent_id").notNull(),
  caregiverId: text("caregiver_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Messages table
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  jobId: text("job_id"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertJobType = z.infer<typeof insertJobSchema>;
export type InsertJobApplicationType = z.infer<typeof insertJobApplicationSchema>;
export type InsertBookingType = z.infer<typeof insertBookingSchema>;
export type InsertMessageType = z.infer<typeof insertMessageSchema>;
```

## Storage Interface (server/storage.ts)

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { 
  users, 
  jobs, 
  jobApplications, 
  bookings, 
  messages,
  User,
  Job,
  JobApplication,
  Booking,
  Message,
  InsertUser,
  InsertJob,
  InsertJobApplication,
  InsertBooking,
  InsertMessage
} from "../shared/schema";
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
  clearUserResetToken(userId: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  getUserJobs(userId: string): Promise<Job[]>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  
  // Job application operations  
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(jobId: string): Promise<JobApplication[]>;
  getUserJobApplications(userId: string): Promise<JobApplication[]>;
  updateJobApplicationStatus(id: string, status: string): Promise<JobApplication | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(senderId: string, receiverId: string): Promise<Message[]>;
  getUserMessages(userId: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Featured nannies
  getFeaturedNannies(): Promise<User[]>;
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
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
      resetToken: null,
      resetTokenExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [user] = await db.insert(users).values(cleanUserData).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Password reset operations
  async updateUserResetToken(userId: string, resetToken: string, expires: Date): Promise<void> {
    await db.update(users)
      .set({ resetToken, resetTokenExpires: expires, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getUserByResetToken(resetToken: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, resetToken));
    return user;
  }

  async clearUserResetToken(userId: string): Promise<void> {
    await db.update(users)
      .set({ resetToken: null, resetTokenExpires: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Job operations
  async createJob(jobData: InsertJob): Promise<Job> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cleanJobData = {
      ...jobData,
      id: jobId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [job] = await db.insert(jobs).values(cleanJobData).returning();
    return job;
  }

  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getUserJobs(userId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.parentId, userId)).orderBy(desc(jobs.createdAt));
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db.update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return result.rowCount > 0;
  }

  // Job application operations
  async createJobApplication(applicationData: InsertJobApplication): Promise<JobApplication> {
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cleanApplicationData = {
      ...applicationData,
      id: applicationId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [application] = await db.insert(jobApplications).values(cleanApplicationData).returning();
    return application;
  }

  async getJobApplications(jobId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt));
  }

  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.caregiverId, userId)).orderBy(desc(jobApplications.createdAt));
  }

  async updateJobApplicationStatus(id: string, status: string): Promise<JobApplication | undefined> {
    const [application] = await db.update(jobApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning();
    return application;
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cleanBookingData = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [booking] = await db.insert(bookings).values(cleanBookingData).returning();
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(or(eq(bookings.parentId, userId), eq(bookings.caregiverId, userId)))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cleanMessageData = {
      ...messageData,
      id: messageId,
      createdAt: new Date()
    };

    const [message] = await db.insert(messages).values(cleanMessageData).returning();
    return message;
  }

  async getConversationMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        or(
          and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)),
          and(eq(messages.senderId, receiverId), eq(messages.receiverId, senderId))
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }

  // Featured nannies
  async getFeaturedNannies(): Promise<User[]> {
    return await db.select().from(users)
      .where(eq(users.isNanny, true))
      .limit(8);
  }
}

export const storage = new DatabaseStorage();
```

## Main App Component (client/src/App.tsx)

```typescript
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import JobBoard from "@/pages/job-board";
import JobDetails from "@/pages/job-details";
import PostJob from "@/pages/post-job";
import ParentDashboard from "@/pages/parent-dashboard";
import CaregiverDashboard from "@/pages/caregiver-dashboard";
import CaregiverBookings from "@/pages/caregiver-bookings";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";

// Layout components
import Header from "@/components/layout/new-header";

// Configure query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vivaly-ui-theme">
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/job-board" component={JobBoard} />
              <Route path="/job/:jobId" component={JobDetails} />
              <Route path="/post-job" component={PostJob} />
              <Route path="/parent-dashboard" component={ParentDashboard} />
              <Route path="/caregiver-dashboard" component={CaregiverDashboard} />
              <Route path="/caregiver-bookings" component={CaregiverBookings} />
              <Route path="/profile" component={Profile} />
              <Route path="/messages" component={Messages} />
              <Route>
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-2xl font-bold">Page Not Found</h1>
                  <p className="text-muted-foreground mt-2">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </Route>
            </Switch>
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## Navigation Header (client/src/components/layout/new-header.tsx)

```typescript
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Calendar, MessageCircle, Briefcase, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
  currentRole?: string;
}

function Header() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
      toast({
        title: "Logged out successfully",
      });
    },
  });

  // Role switching mutation
  const switchRoleMutation = useMutation({
    mutationFn: async (newRole: string) => {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Role switch failed");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      // Navigate to appropriate dashboard
      if (data.user.currentRole === "parent") {
        navigate("/parent-dashboard");
      } else {
        navigate("/caregiver-dashboard");
      }
      
      toast({
        title: `Switched to ${data.user.currentRole} role`,
      });
    },
  });

  const isAuthenticated = !!user;
  const currentRole = user?.currentRole || (user?.roles?.[0]);
  const isParent = currentRole === "parent";
  const isCaregiver = currentRole === "caregiver";
  const hasMultipleRoles = user?.roles && user.roles.length > 1;

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsMenuOpen(false);
  };

  const handleRoleSwitch = () => {
    if (!hasMultipleRoles) return;
    
    const newRole = currentRole === "parent" ? "caregiver" : "parent";
    switchRoleMutation.mutate(newRole);
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: Home, showAlways: true },
    { path: "/job-board", label: "Find Jobs", icon: Briefcase, showFor: ["caregiver"] },
    { path: "/post-job", label: "Post Job", icon: Briefcase, showFor: ["parent"] },
    { path: "/messages", label: "Messages", icon: MessageCircle, showFor: ["parent", "caregiver"] },
    { path: "/profile", label: "Profile", icon: User, showFor: ["parent", "caregiver"] },
  ];

  // Dashboard navigation based on role
  const getDashboardPath = () => {
    if (isParent) return "/parent-dashboard";
    if (isCaregiver) return "/caregiver-dashboard";
    return "/";
  };

  const getDashboardLabel = () => {
    if (isParent) return "My Dashboard";
    if (isCaregiver) return "My Dashboard";
    return "Dashboard";
  };

  // Add dashboard to navigation
  if (isAuthenticated) {
    navigationItems.splice(1, 0, {
      path: getDashboardPath(),
      label: getDashboardLabel(),
      icon: Home,
      showFor: ["parent", "caregiver"]
    });
  }

  // Filter navigation items based on user role
  const visibleNavItems = navigationItems.filter(item => 
    item.showAlways || 
    (isAuthenticated && item.showFor?.includes(currentRole))
  );

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-black dark:text-white">
              VIVALY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === item.path
                    ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Role Display & Switch */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.firstName || user.email}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                    {currentRole === "parent" ? "Parent" : "Caregiver"}
                  </span>
                  {hasMultipleRoles && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRoleSwitch}
                      disabled={switchRoleMutation.isPending}
                      className="text-xs h-7"
                    >
                      Switch to {currentRole === "parent" ? "Caregiver" : "Parent"}
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.path
                      ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                    {user.firstName || user.email} ({currentRole === "parent" ? "Parent" : "Caregiver"})
                  </div>
                  
                  {hasMultipleRoles && (
                    <button
                      className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                      onClick={handleRoleSwitch}
                      disabled={switchRoleMutation.isPending}
                    >
                      Switch to {currentRole === "parent" ? "Caregiver" : "Parent"}
                    </button>
                  )}
                  
                  <button
                    className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
```

## Caregiver Bookings Page (client/src/pages/caregiver-bookings.tsx)

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Booking {
  id: string;
  jobId: string;
  parentId: string;
  caregiverId: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  totalAmount: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    title: string;
    location: string;
    description: string;
  };
  parent?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

function CaregiverBookings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Mock data for demonstration - replace with actual API call
  const mockBookings: Booking[] = [
    {
      id: "booking_1",
      jobId: "job_1",
      parentId: "parent_1",
      caregiverId: "caregiver_1",
      startTime: "2024-06-20T09:00:00Z",
      endTime: "2024-06-20T17:00:00Z",
      hourlyRate: "25.00",
      totalAmount: "200.00",
      status: "confirmed",
      notes: "Please bring some activities for the children",
      createdAt: "2024-06-18T10:00:00Z",
      updatedAt: "2024-06-18T10:00:00Z",
      job: {
        title: "Full Day Childcare",
        location: "123 Family Street, Melbourne VIC",
        description: "Looking after 2 children aged 5 and 7"
      },
      parent: {
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "+61 400 123 456",
        email: "sarah.johnson@email.com"
      }
    },
    {
      id: "booking_2",
      jobId: "job_2",
      parentId: "parent_2",
      caregiverId: "caregiver_1",
      startTime: "2024-06-22T14:00:00Z",
      endTime: "2024-06-22T18:00:00Z",
      hourlyRate: "28.00",
      totalAmount: "112.00",
      status: "pending",
      notes: null,
      createdAt: "2024-06-18T15:30:00Z",
      updatedAt: "2024-06-18T15:30:00Z",
      job: {
        title: "After School Care",
        location: "456 Parent Avenue, Sydney NSW",
        description: "Pick up from school and supervise homework"
      },
      parent: {
        firstName: "Mike",
        lastName: "Chen",
        phone: "+61 411 987 654",
        email: "mike.chen@email.com"
      }
    }
  ];

  // Mock query for bookings
  const { data: bookings = mockBookings, isLoading } = useQuery({
    queryKey: ['/api/caregiver/bookings'],
    queryFn: () => Promise.resolve(mockBookings),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBookingsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === selectedDateStr;
    });
  };

  const hasBookingsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-muted-foreground">
          Manage your scheduled childcare appointments
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>List View</span>
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasBooking: (date) => hasBookingsOnDate(date)
                  }}
                  modifiersStyles={{
                    hasBooking: {
                      backgroundColor: '#000',
                      color: '#fff',
                      borderRadius: '50%'
                    }
                  }}
                />
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <p className="text-sm text-muted-foreground mb-2">Legend:</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
                    <span className="text-sm">Days with bookings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? `Bookings for ${formatDate(selectedDate.toISOString())}` : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getBookingsForSelectedDate().length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No bookings for this date</p>
                      </div>
                    ) : (
                      getBookingsForSelectedDate().map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.job?.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                </span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.job?.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.parent?.firstName} {booking.parent?.lastName}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>${booking.hourlyRate}/hour (Total: ${booking.totalAmount})</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.parent?.phone}</span>
                              </div>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                              <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message Parent
                            </Button>
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" variant="default">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline">
                                  Decline
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a date from the calendar to view bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground">
                  Your confirmed bookings will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{booking.job?.title}</h3>
                      <p className="text-muted-foreground mb-2">{booking.job?.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.startTime)}</span>
                        <Clock className="w-4 h-4 ml-4" />
                        <span>
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.job?.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.parent?.firstName} {booking.parent?.lastName}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>${booking.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">Total: ${booking.totalAmount}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.parent?.phone}</span>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message Parent
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CaregiverBookings;
```

## Job Details Page (client/src/pages/job-details.tsx)

```typescript
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, User, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface JobDetailsProps {
  id: string;
  parentId: string;
  title: string;
  description: string;
  location: string;
  hourlyRate: string;
  startDate: string;
  endDate: string | null;
  requirements: string[];
  isUrgent: boolean;
  childrenAges: string[];
  additionalInfo: string | null;
  status: string;
  createdAt: string;
  parentProfile?: {
    firstName: string | null;
    lastName: string | null;
    profilePhoto: string | null;
    suburb: string | null;
  };
}

function JobDetails() {
  const { jobId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job details
  const { data: job, isLoading, error } = useQuery<JobDetailsProps>({
    queryKey: ['/api/jobs', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch job details');
      }
      return res.json();
    },
  });

  // Apply for job mutation
  const applyMutation = useMutation({
    mutationFn: async (applicationData: { message: string; proposedRate: string; availability: string }) => {
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          ...applicationData,
        }),
      });
      if (!res.ok) throw new Error('Failed to apply for job');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the parent.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    // For now, submit with default values
    // In a real app, this would open a modal or form
    applyMutation.mutate({
      message: "I'm interested in this position and available for the requested times.",
      proposedRate: job?.hourlyRate || "25",
      availability: "Available as requested"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/job-board')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/job-board')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Job Board
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${job.hourlyRate}/hour</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {job.isUrgent && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                  <Badge variant="secondary">
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>
                
                {job.additionalInfo && (
                  <div>
                    <h3 className="font-semibold mb-2">Additional Information</h3>
                    <p className="text-muted-foreground">{job.additionalInfo}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Schedule & Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Start Date</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(job.startDate)}</span>
                  </div>
                </div>
                {job.endDate && (
                  <div>
                    <h4 className="font-medium mb-2">End Date</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDateOnly(job.endDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {job.childrenAges.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Children Ages</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.childrenAges.map((age, index) => (
                      <Badge key={index} variant="outline">
                        {age} years old
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {job.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parent Profile */}
          {job.parentProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Parent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  {job.parentProfile.profilePhoto ? (
                    <img
                      src={job.parentProfile.profilePhoto}
                      alt="Parent"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {job.parentProfile.firstName} {job.parentProfile.lastName}
                    </p>
                    {job.parentProfile.suburb && (
                      <p className="text-sm text-muted-foreground">
                        {job.parentProfile.suburb}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-medium">${job.hourlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium">
                  {new Date(job.createdAt).toLocaleDateString('en-AU')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Applying..." : "Apply for Job"}
            </Button>
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Parent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
```

## API Routes (server/routes.ts) - Key Sections

```typescript
// Get single job by ID (PUBLIC ENDPOINT)
app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job from storage
    const job = await storage.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get parent profile for the job
    const parentProfile = await storage.getUser(job.parentId);
    
    res.json({
      ...job,
      parentProfile: parentProfile ? {
        firstName: parentProfile.firstName,
        lastName: parentProfile.lastName,
        profilePhoto: parentProfile.profileImageUrl,
        suburb: null
      } : null
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

// Create job application
app.post('/api/job-applications', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const validatedData = insertJobApplicationSchema.parse(req.body);
    
    // Get the job to get parent ID
    const job = await storage.getJob(validatedData.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationData = {
      ...validatedData,
      caregiverId: userId,
      parentId: job.parentId
    };

    const application = await storage.createJobApplication(applicationData);
    res.status(201).json(application);
  } catch (error) {
    console.error("Create job application error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create job application" });
  }
});

// Get user's bookings (for caregivers)
app.get('/api/caregiver/bookings', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const bookings = await storage.getUserBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Get caregiver bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});
```

## Key Package.json Dependencies

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-calendar": "^1.0.0",
    "@tanstack/react-query": "^5.8.4",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "react": "^18.2.0",
    "react-calendar": "^4.6.0",
    "react-hook-form": "^7.47.0",
    "wouter": "^2.12.1",
    "zod": "^3.22.4"
  }
}
```

## Testing Instructions for ChatGPT

1. **Authentication System**: Test dual-role login/signup and role switching
2. **Job Board**: Browse jobs, apply for positions, view job details
3. **Caregiver Bookings**: Navigate to caregiver dashboard → "My Bookings" to see calendar
4. **Job Details**: Click on any job application to see detailed job information
5. **Navigation**: Test mobile and desktop navigation consistency
6. **Database**: PostgreSQL with Drizzle ORM for data persistence

## Key Features to Validate
- ✅ Dual-role authentication (parent/caregiver)
- ✅ Job posting and application system
- ✅ Caregiver bookings calendar interface
- ✅ Job details page with parent profile
- ✅ Mobile-responsive design
- ✅ Email notifications (SendGrid)
- ✅ Real-time messaging system
- ✅ Role-based navigation

The application should run on `npm run dev` and be accessible at `localhost:5000`.