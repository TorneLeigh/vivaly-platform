import { storage } from "./storage";

interface VoucherRequest {
  caregiverId: number;
  voucherType: "wwcc-certification" | "first-aid" | "police-check";
  receiptAmount: number;
  receiptImageUrl: string;
  certificationDate: string;
  expiryDate: string;
  state?: string;
}

interface Voucher {
  id: string;
  caregiverId: number;
  voucherType: string;
  originalAmount: number;
  refundAmount: number;
  refundPercentage: number;
  status: "pending" | "approved" | "paid" | "rejected";
  receiptImageUrl: string;
  submissionDate: Date;
  processedDate?: Date;
  paymentDate?: Date;
  notes?: string;
}

export class VoucherService {
  private readonly VOUCHER_RATES = {
    "wwcc-certification": 0.30, // 30% refund
    "first-aid": 0.25, // 25% refund  
    "police-check": 0.20 // 20% refund
  };

  private readonly MAX_REFUND_AMOUNTS = {
    "wwcc-certification": 35, // Max $35 refund (typical WWCC costs $80-120)
    "first-aid": 50, // Max $50 refund (typical First Aid costs $150-200)
    "police-check": 15 // Max $15 refund (typical Police Check costs $50-75)
  };

  async submitVoucherClaim(request: VoucherRequest): Promise<Voucher> {
    const voucherId = `VCH_${Date.now()}_${request.caregiverId}`;
    
    // Check platform usage eligibility - must have completed multiple bookings
    const completedBookings = await this.getCompletedBookingsCount(request.caregiverId);
    const minimumBookings = 2; // Require at least 2 completed bookings
    
    if (completedBookings < minimumBookings) {
      throw new Error(`You must complete at least ${minimumBookings} bookings on Aircare before claiming certification refunds. Current completed bookings: ${completedBookings}`);
    }

    // Calculate refund amount
    const refundPercentage = this.VOUCHER_RATES[request.voucherType] || 0;
    const maxRefund = this.MAX_REFUND_AMOUNTS[request.voucherType] || 0;
    const calculatedRefund = request.receiptAmount * refundPercentage;
    const refundAmount = Math.min(calculatedRefund, maxRefund);

    // Validate receipt amount is reasonable
    if (request.receiptAmount < 10 || request.receiptAmount > 500) {
      throw new Error("Receipt amount must be between $10 and $500");
    }

    const voucher: Voucher = {
      id: voucherId,
      caregiverId: request.caregiverId,
      voucherType: request.voucherType,
      originalAmount: request.receiptAmount,
      refundAmount: Math.round(refundAmount * 100) / 100, // Round to 2 decimal places
      refundPercentage: refundPercentage * 100,
      status: "pending",
      receiptImageUrl: request.receiptImageUrl,
      submissionDate: new Date(),
      notes: `${request.voucherType} certification voucher claim`
    };

    // Store voucher claim
    await this.storeVoucherClaim(voucher);

    // Send notification emails
    await this.sendVoucherSubmissionEmails(voucher);

    return voucher;
  }

  async getVouchersByCaregiver(caregiverId: number): Promise<Voucher[]> {
    // In production, this would query stored voucher records
    return [];
  }

  async approveVoucher(voucherId: string, adminNotes?: string): Promise<Voucher> {
    const voucher = await this.getVoucher(voucherId);
    if (!voucher) {
      throw new Error("Voucher not found");
    }

    voucher.status = "approved";
    voucher.processedDate = new Date();
    voucher.notes = adminNotes || voucher.notes;

    await this.updateVoucherStatus(voucher);
    await this.sendVoucherApprovalEmail(voucher);

    return voucher;
  }

  async processPayment(voucherId: string): Promise<{ success: boolean; paymentId?: string }> {
    const voucher = await this.getVoucher(voucherId);
    if (!voucher || voucher.status !== "approved") {
      throw new Error("Voucher not approved for payment");
    }

    try {
      // In production, integrate with payment provider (Stripe, PayPal, bank transfer)
      const paymentId = `PAY_${Date.now()}`;
      
      voucher.status = "paid";
      voucher.paymentDate = new Date();
      
      await this.updateVoucherStatus(voucher);
      await this.sendPaymentConfirmationEmail(voucher, paymentId);

      return { success: true, paymentId };
    } catch (error) {
      console.error("Voucher payment failed:", error);
      return { success: false };
    }
  }

  async getVoucherStats(): Promise<{
    totalClaims: number;
    totalRefunded: number;
    pendingClaims: number;
    averageRefund: number;
  }> {
    // In production, calculate from stored voucher data
    return {
      totalClaims: 0,
      totalRefunded: 0,
      pendingClaims: 0,
      averageRefund: 0
    };
  }

  private async getCompletedBookingsCount(caregiverId: number): Promise<number> {
    // Get count of completed bookings for this caregiver
    const bookings = await storage.getBookingsByNanny(caregiverId);
    return bookings.filter(booking => booking.status === 'completed').length;
  }

  async getEligibilityStatus(caregiverId: number): Promise<{
    isEligible: boolean;
    completedBookings: number;
    requiredBookings: number;
    remainingBookings: number;
  }> {
    const completedBookings = await this.getCompletedBookingsCount(caregiverId);
    const requiredBookings = 2;
    const isEligible = completedBookings >= requiredBookings;
    
    return {
      isEligible,
      completedBookings,
      requiredBookings,
      remainingBookings: Math.max(0, requiredBookings - completedBookings)
    };
  }

  private async getVoucher(voucherId: string): Promise<Voucher | null> {
    // In production, query voucher from database
    return null;
  }

  private async storeVoucherClaim(voucher: Voucher): Promise<void> {
    // Store voucher claim in database
    console.log("Storing voucher claim:", voucher.id);
  }

  private async updateVoucherStatus(voucher: Voucher): Promise<void> {
    // Update voucher status in database
    console.log("Updating voucher status:", voucher.id, voucher.status);
  }

  private async sendVoucherSubmissionEmails(voucher: Voucher): Promise<void> {
    // Send confirmation email to caregiver
    console.log("Sending voucher submission email for:", voucher.id);
  }

  private async sendVoucherApprovalEmail(voucher: Voucher): Promise<void> {
    // Send approval email to caregiver
    console.log("Sending voucher approval email for:", voucher.id);
  }

  private async sendPaymentConfirmationEmail(voucher: Voucher, paymentId: string): Promise<void> {
    // Send payment confirmation email
    console.log("Sending payment confirmation email for:", voucher.id, paymentId);
  }

  // Get eligible voucher types for a caregiver
  getEligibleVouchers(): { type: string; description: string; refundRate: string; maxRefund: number }[] {
    return [
      {
        type: "wwcc-certification",
        description: "Working with Children Check",
        refundRate: "30%",
        maxRefund: this.MAX_REFUND_AMOUNTS["wwcc-certification"]
      },
      {
        type: "first-aid",
        description: "First Aid Certification",
        refundRate: "25%",
        maxRefund: this.MAX_REFUND_AMOUNTS["first-aid"]
      },
      {
        type: "police-check",
        description: "National Police Check",
        refundRate: "20%",
        maxRefund: this.MAX_REFUND_AMOUNTS["police-check"]
      }
    ];
  }
}

export const voucherService = new VoucherService();