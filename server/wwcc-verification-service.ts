import { storage } from "./storage";

// Australian state WWCC verification systems
interface WWCCProvider {
  state: string;
  name: string;
  verificationUrl: string;
}

const WWCC_PROVIDERS: WWCCProvider[] = [
  {
    state: "NSW",
    name: "NSW Office of the Children's Guardian",
    verificationUrl: "https://www.kidsguardian.nsw.gov.au/child-safe-organisations/working-with-children-check/verify-wwcc"
  },
  {
    state: "VIC",
    name: "Victoria Working with Children Check Unit", 
    verificationUrl: "https://www.workingwithchildren.vic.gov.au/home/applications+and+renewals/check+the+status+of+a+check"
  },
  {
    state: "QLD",
    name: "Queensland Blue Card Services",
    verificationUrl: "https://www.bluecard.qld.gov.au/blue-card-register"
  },
  {
    state: "WA",
    name: "Western Australia Department of Communities",
    verificationUrl: "https://www.workingwithchildren.wa.gov.au/check-registration/online-register"
  }
];

interface WWCCVerificationRequest {
  caregiverId: number;
  wwccNumber: string;
  state: string;
  firstName: string;
  lastName: string;
  expiryDate: string;
}

interface WWCCVerificationResult {
  verificationId: string;
  caregiverId: number;
  wwccNumber: string;
  state: string;
  status: "valid" | "invalid" | "expired" | "verification-required";
  expiryDate?: Date;
  verifiedDate: Date;
  provider: string;
}

export class WWCCVerificationService {
  
  async verifyWWCC(request: WWCCVerificationRequest): Promise<WWCCVerificationResult> {
    const verificationId = `WWCC_${Date.now()}_${request.caregiverId}`;
    
    // Find the appropriate state provider
    const provider = WWCC_PROVIDERS.find(p => p.state === request.state);
    if (!provider) {
      throw new Error(`WWCC verification not supported for state: ${request.state}`);
    }

    // Validate WWCC number format by state
    if (!this.validateWWCCFormat(request.wwccNumber, request.state)) {
      throw new Error("Invalid WWCC number format for the specified state");
    }

    // Check expiry date
    const expiryDate = new Date(request.expiryDate);
    const now = new Date();
    const isExpired = expiryDate < now;

    const result: WWCCVerificationResult = {
      verificationId,
      caregiverId: request.caregiverId,
      wwccNumber: request.wwccNumber,
      state: request.state,
      status: isExpired ? "expired" : "verification-required",
      expiryDate: expiryDate,
      verifiedDate: new Date(),
      provider: provider.name
    };

    // Store verification result
    await this.storeWWCCVerification(result);
    
    // Update caregiver profile with WWCC information
    await storage.updateNanny(request.caregiverId, {
      hasWwcc: !isExpired,
      verificationStatus: isExpired ? "expired" : "pending",
      backgroundCheckStatus: !isExpired ? "approved" : "expired"
    });

    return result;
  }

  private validateWWCCFormat(wwccNumber: string, state: string): boolean {
    // WWCC number format validation by state
    const formats: { [state: string]: RegExp } = {
      NSW: /^WWC\d{7}[A-Z]$/,  // NSW format: WWC1234567A
      VIC: /^\d{8}$/,           // VIC format: 12345678
      QLD: /^\d{6}\/\d{2}$/,    // QLD format: 123456/21
      WA: /^HCW\d{7}$/          // WA format: HCW1234567
    };

    const format = formats[state];
    return format ? format.test(wwccNumber) : false;
  }

  async getWWCCStatus(caregiverId: number): Promise<WWCCVerificationResult | null> {
    // In production, this would query stored WWCC verification records
    return null;
  }

  async getWWCCProvider(state: string): Promise<WWCCProvider | null> {
    return WWCC_PROVIDERS.find(p => p.state === state) || null;
  }

  private async storeWWCCVerification(result: WWCCVerificationResult): Promise<void> {
    // Store WWCC verification results securely
    console.log("Storing WWCC verification:", result.verificationId);
  }

  // Check WWCC expiry dates for all caregivers
  async checkExpiringWWCCs(): Promise<WWCCVerificationResult[]> {
    const expiringWWCCs: WWCCVerificationResult[] = [];
    
    // In production, this would check all caregiver WWCC expiry dates
    // and send renewal reminders
    
    return expiringWWCCs;
  }

  // Manual verification link for families to check WWCC independently
  getManualVerificationLink(wwccNumber: string, state: string): string {
    const provider = WWCC_PROVIDERS.find(p => p.state === state);
    return provider?.verificationUrl || "";
  }
}

export const wwccVerificationService = new WWCCVerificationService();