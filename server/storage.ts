import { randomUUID } from "crypto";

type User = {
  id: number;
  email: string;
  role: "parent" | "caregiver";
  stripeConnectAccountId?: string;
};

type Booking = {
  id: string;
  parentId: number;
  caregiverId: number;
  jobId?: string | null;
  startDate: string;
  endDate: string;
  ratePerHour: number;
  hoursPerDay: number;
  totalAmount: number;
  serviceFee: number;
  caregiverAmount: number;
  status: "pending" | "confirmed" | "declined" | "completed";
  paymentStatus: "unpaid" | "payment_initiated" | "paid_unreleased" | "released";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  transferId?: string;
  personalDetailsVisible: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
};

const users: User[] = [];
const bookings: Booking[] = [];

export const storage = {
  async getUser(id: number): Promise<User | null> {
    return users.find((u) => u.id === id) || null;
  },

  async updateUser(id: number, data: Partial<User>): Promise<void> {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
    }
  },

  async getBookingsByNanny(caregiverId: number): Promise<Booking[]> {
    return bookings.filter((b) => b.caregiverId === caregiverId);
  },

  async getBooking(id: string): Promise<Booking | null> {
    return bookings.find((b) => b.id === id) || null;
  },

  async createBooking(booking: Booking): Promise<void> {
    bookings.push(booking);
  },

  async updateBooking(id: string, updated: Booking): Promise<void> {
    const index = bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      bookings[index] = updated;
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    return bookings;
  }
};
