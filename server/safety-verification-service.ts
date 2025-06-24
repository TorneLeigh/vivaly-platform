import { z } from 'zod';
import fetch from 'node-fetch';
import { db } from './db.js';
import { verificationChecks, users } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { sendEmail } from './lib/sendEmail.js';

// Australian WWCC verification schemas
const WWCCVerificationSchema = z.object({
  wwccNumber: z.string().min(10, "WWCC number must be at least 10 characters"),
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

const PoliceCheckSchema = z.object({
  documentUrl: z.string().url("Valid document URL required"),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const IdentityVerificationSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license']),
  documentNumber: z.string().min(5, "Document number required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  documentUrl: z.string().url("Valid document URL required"),
});

interface WWCCApiResponse {
  valid: boolean;
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  expiryDate?: string;
  restrictions?: string[];
  fullName?: string;
}

interface VerificationResult {
  success: boolean;
  status: 'verified' | 'rejected' | 'pending';
  message: string;
  data?: any;
  requiresManualReview?: boolean;
}

export class SafetyVerificationService {
  // WWCC State-specific verification endpoints
  private static getWWCCVerificationUrl(state: string): string {
    const urls: { [key: string]: string } = {
      NSW: process.env.NSW_WWCC_API_URL || "https://api.kidsguardian.nsw.gov.au/wwcc/verify",
      VIC: process.env.VIC_WWCC_API_URL || "https://api.workingwithchildren.vic.gov.au/verify",
      QLD: process.env.QLD_BLUECARD_API_URL || "https://api.bluecard.qld.gov.au/verify",
      WA: process.env.WA_WWCC_API_URL || "https://api.workingwithchildren.wa.gov.au/verify",
      SA: process.env.SA_WWCC_API_URL || "https://api.screening.sa.gov.au/verify",
      TAS: process.env.TAS_WWCC_API_URL || "https://api.justice.tas.gov.au/wwcc/verify",
      ACT: process.env.ACT_WWCC_API_URL || "https://api.accesscanberra.act.gov.au/wwcc/verify",
      NT: process.env.NT_WWCC_API_URL || "https://api.pfes.nt.gov.au/wwcc/verify",
    };
    return urls[state] || "";
  }

  // Verify WWCC with state government systems
  public static async verifyWWCC(data: z.infer<typeof WWCCVerificationSchema>): Promise<VerificationResult> {
    try {
      const validated = WWCCVerificationSchema.parse(data);
      const apiUrl = this.getWWCCVerificationUrl(validated.state);
      
      if (!apiUrl) {
        return {
          success: false,
          status: 'pending',
          message: `WWCC verification not available for ${validated.state}. Manual review required.`,
          requiresManualReview: true
        };
      }

      // Call state-specific WWCC API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env[`${validated.state}_WWCC_API_KEY`]}`,
          'X-API-Version': '2024-01',
        },
        body: JSON.stringify({
          wwccNumber: validated.wwccNumber,
          firstName: validated.firstName,
          lastName: validated.lastName,
          dateOfBirth: validated.dateOfBirth,
        }),
      });

      if (!response.ok) {
        throw new Error(`WWCC API error: ${response.status}`);
      }

      const result: WWCCApiResponse = await response.json() as WWCCApiResponse;

      if (result.valid && result.status === 'active') {
        return {
          success: true,
          status: 'verified',
          message: 'WWCC verified successfully',
          data: {
            expiryDate: result.expiryDate,
            restrictions: result.restrictions || [],
            verifiedName: result.fullName,
          }
        };
      } else {
        return {
          success: false,
          status: 'rejected',
          message: `WWCC verification failed: ${result.status}`,
          data: { apiResponse: result }
        };
      }

    } catch (error) {
      console.error('WWCC verification error:', error);
      
      // If API is unavailable, flag for manual review
      return {
        success: false,
        status: 'pending',
        message: 'WWCC verification system unavailable. Manual review required.',
        requiresManualReview: true
      };
    }
  }

  // Verify police clearance document using OCR and validation
  public static async verifyPoliceCheck(data: z.infer<typeof PoliceCheckSchema>): Promise<VerificationResult> {
    try {
      const validated = PoliceCheckSchema.parse(data);
      
      // Check document age (must be within 12 months)
      const issueDate = new Date(validated.issueDate);
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
      
      if (issueDate < twelveMonthsAgo) {
        return {
          success: false,
          status: 'rejected',
          message: 'Police clearance document is too old. Must be within 12 months.'
        };
      }

      // Use OCR service to extract and verify document details
      const ocrResult = await this.extractDocumentData(validated.documentUrl, 'police_check');
      
      if (!ocrResult.success) {
        return {
          success: false,
          status: 'pending',
          message: 'Document could not be processed. Manual review required.',
          requiresManualReview: true
        };
      }

      // Validate extracted data matches submitted data
      const nameMatch = this.compareNames(
        `${validated.firstName} ${validated.lastName}`,
        ocrResult.extractedName
      );

      if (!nameMatch) {
        return {
          success: false,
          status: 'rejected',
          message: 'Name on document does not match submitted information.'
        };
      }

      // Check for criminal records
      if (ocrResult.hasRecords) {
        return {
          success: false,
          status: 'pending',
          message: 'Police clearance shows records. Manual review required.',
          requiresManualReview: true
        };
      }

      return {
        success: true,
        status: 'verified',
        message: 'Police clearance verified successfully',
        data: {
          issueDate: validated.issueDate,
          extractedData: ocrResult
        }
      };

    } catch (error) {
      console.error('Police check verification error:', error);
      return {
        success: false,
        status: 'pending',
        message: 'Error processing police clearance. Manual review required.',
        requiresManualReview: true
      };
    }
  }

  // Verify passport or driver's license
  public static async verifyIdentityDocument(data: z.infer<typeof IdentityVerificationSchema>): Promise<VerificationResult> {
    try {
      const validated = IdentityVerificationSchema.parse(data);
      
      // Use OCR to extract document data
      const ocrResult = await this.extractDocumentData(validated.documentUrl, validated.documentType);
      
      if (!ocrResult.success) {
        return {
          success: false,
          status: 'pending',
          message: 'Document could not be processed. Manual review required.',
          requiresManualReview: true
        };
      }

      // Validate extracted data
      const validationChecks = {
        nameMatch: this.compareNames(
          `${validated.firstName} ${validated.lastName}`,
          ocrResult.extractedName
        ),
        documentNumberMatch: validated.documentNumber === ocrResult.extractedDocumentNumber,
        dobMatch: validated.dateOfBirth === ocrResult.extractedDOB,
        documentValid: ocrResult.isValid && !ocrResult.isExpired
      };

      const allChecksPass = Object.values(validationChecks).every(check => check);

      if (allChecksPass) {
        return {
          success: true,
          status: 'verified',
          message: 'Identity document verified successfully',
          data: {
            documentType: validated.documentType,
            extractedData: ocrResult,
            validationChecks
          }
        };
      } else {
        return {
          success: false,
          status: 'rejected',
          message: 'Identity document validation failed',
          data: { validationChecks }
        };
      }

    } catch (error) {
      console.error('Identity verification error:', error);
      return {
        success: false,
        status: 'pending',
        message: 'Error processing identity document. Manual review required.',
        requiresManualReview: true
      };
    }
  }

  // OCR service to extract data from documents
  private static async extractDocumentData(documentUrl: string, documentType: string): Promise<any> {
    try {
      // This would integrate with services like AWS Textract, Google Cloud Vision, or Azure Computer Vision
      const response = await fetch(process.env.OCR_SERVICE_URL || 'https://api.ocr-service.com/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OCR_API_KEY}`,
        },
        body: JSON.stringify({
          documentUrl,
          documentType,
          country: 'AU'
        }),
      });

      if (!response.ok) {
        throw new Error(`OCR service error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OCR extraction error:', error);
      return { success: false, error: 'OCR service unavailable' };
    }
  }

  // Helper function to compare names with fuzzy matching
  private static compareNames(name1: string, name2: string): boolean {
    if (!name1 || !name2) return false;
    
    const normalize = (name: string) => name.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const normalized1 = normalize(name1);
    const normalized2 = normalize(name2);
    
    // Exact match
    if (normalized1 === normalized2) return true;
    
    // Split and check if all parts match (handles middle names, order differences)
    const parts1 = normalized1.split(/\s+/);
    const parts2 = normalized2.split(/\s+/);
    
    return parts1.every(part => parts2.includes(part)) && 
           parts2.every(part => parts1.includes(part));
  }

  // Save verification check to database
  public static async saveVerificationCheck(
    userId: string,
    checkType: string,
    result: VerificationResult,
    documentUrl?: string,
    verificationData?: any
  ) {
    try {
      const expiresAt = checkType === 'wwcc' && result.data?.expiryDate 
        ? new Date(result.data.expiryDate)
        : checkType === 'police_check'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        : null;

      await db.insert(verificationChecks).values({
        userId,
        checkType,
        status: result.status,
        documentUrl,
        verificationData,
        verifiedAt: result.status === 'verified' ? new Date() : null,
        expiresAt,
        autoVerified: result.success && !result.requiresManualReview,
        manualReviewRequired: result.requiresManualReview || false,
      });

      // Update user verification status
      const updateData: any = {};
      if (checkType === 'wwcc') {
        updateData.wwccVerificationStatus = result.status;
        updateData.wwccLastChecked = new Date();
      } else if (checkType === 'police_check') {
        updateData.policeCheckStatus = result.status;
      } else if (checkType === 'identity') {
        updateData.identityVerificationStatus = result.status;
      }

      await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      // Send notification emails
      await this.sendVerificationNotification(userId, checkType, result);

    } catch (error) {
      console.error('Error saving verification check:', error);
      throw error;
    }
  }

  // Send verification result notifications
  private static async sendVerificationNotification(
    userId: string,
    checkType: string,
    result: VerificationResult
  ) {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length || !user[0].email) return;

      const userData = user[0];
      const checkTypeName = {
        wwcc: 'Working with Children Check',
        police_check: 'Police Clearance',
        identity: 'Identity Verification'
      }[checkType] || checkType;

      const subject = `${checkTypeName} ${result.status === 'verified' ? 'Approved' : result.status === 'rejected' ? 'Declined' : 'Under Review'} - VIVALY`;
      
      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5F7E 0%, #FFA24D 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">VIVALY</h1>
            <p style="color: white; margin: 5px 0;">Trusted Childcare Platform</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333;">Verification Update</h2>
            <p>Hi ${userData.firstName},</p>
      `;

      if (result.status === 'verified') {
        htmlContent += `
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">✅ Verification Approved</h3>
            <p style="color: #155724;">Your ${checkTypeName} has been successfully verified.</p>
          </div>
        `;
      } else if (result.status === 'rejected') {
        htmlContent += `
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">❌ Verification Declined</h3>
            <p style="color: #721c24;">${result.message}</p>
            <p style="color: #721c24;">Please review the requirements and resubmit your documentation.</p>
          </div>
        `;
      } else {
        htmlContent += `
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⏳ Manual Review Required</h3>
            <p style="color: #856404;">${result.message}</p>
            <p style="color: #856404;">Our team will review your submission and get back to you within 2-3 business days.</p>
          </div>
        `;
      }

      htmlContent += `
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>The VIVALY Team</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: userData.email,
        subject,
        html: htmlContent,
      });

    } catch (error) {
      console.error('Error sending verification notification:', error);
    }
  }

  // Check if all verifications are complete for a user
  public static async isUserFullyVerified(userId: string): Promise<boolean> {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) return false;

      const userData = user[0];
      return userData.wwccVerificationStatus === 'verified' &&
             userData.policeCheckStatus === 'verified' &&
             userData.identityVerificationStatus === 'verified';
    } catch (error) {
      console.error('Error checking user verification status:', error);
      return false;
    }
  }

  // Get verification status summary for a user
  public static async getVerificationStatus(userId: string) {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) return null;

      const userData = user[0];
      const checks = await db.select()
        .from(verificationChecks)
        .where(eq(verificationChecks.userId, userId));

      return {
        user: userData,
        checks: checks,
        isFullyVerified: await this.isUserFullyVerified(userId),
        summary: {
          wwcc: userData.wwccVerificationStatus,
          policeCheck: userData.policeCheckStatus,
          identity: userData.identityVerificationStatus,
        }
      };
    } catch (error) {
      console.error('Error getting verification status:', error);
      return null;
    }
  }
}

export { WWCCVerificationSchema, PoliceCheckSchema, IdentityVerificationSchema };