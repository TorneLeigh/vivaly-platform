import { sendVerificationCode } from './sms-service';
import { storage } from './storage';

interface VerificationAttempt {
  phone: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

// In-memory store for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, VerificationAttempt>();

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendPhoneVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Validate Australian phone number format
  if (!cleanPhone.match(/^(\+61|61|0)[2-9]\d{8}$/)) {
    return { success: false, message: 'Invalid Australian phone number format' };
  }
  
  // Normalize to international format
  let normalizedPhone = cleanPhone;
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '+61' + normalizedPhone.substring(1);
  } else if (normalizedPhone.startsWith('61')) {
    normalizedPhone = '+' + normalizedPhone;
  } else if (!normalizedPhone.startsWith('+61')) {
    normalizedPhone = '+61' + normalizedPhone;
  }
  
  // Check rate limiting (max 3 attempts per phone per hour)
  const existing = verificationCodes.get(normalizedPhone);
  if (existing && existing.attempts >= 3) {
    const timeSinceLastAttempt = Date.now() - existing.expiresAt.getTime();
    if (timeSinceLastAttempt < 3600000) { // 1 hour
      return { success: false, message: 'Too many verification attempts. Please try again in 1 hour.' };
    }
  }
  
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  const success = await sendVerificationCode(normalizedPhone, code);
  
  if (success) {
    verificationCodes.set(normalizedPhone, {
      phone: normalizedPhone,
      code,
      expiresAt,
      attempts: (existing?.attempts || 0) + 1
    });
    
    return { success: true, message: 'Verification code sent successfully' };
  } else {
    return { success: false, message: 'Failed to send verification code' };
  }
}

export function verifyPhoneCode(phone: string, code: string): { success: boolean; message: string } {
  // Normalize phone number
  let normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '+61' + normalizedPhone.substring(1);
  } else if (normalizedPhone.startsWith('61')) {
    normalizedPhone = '+' + normalizedPhone;
  } else if (!normalizedPhone.startsWith('+61')) {
    normalizedPhone = '+61' + normalizedPhone;
  }
  
  const verification = verificationCodes.get(normalizedPhone);
  
  if (!verification) {
    return { success: false, message: 'No verification code found for this number' };
  }
  
  if (Date.now() > verification.expiresAt.getTime()) {
    verificationCodes.delete(normalizedPhone);
    return { success: false, message: 'Verification code has expired' };
  }
  
  if (verification.code !== code) {
    return { success: false, message: 'Invalid verification code' };
  }
  
  // Code verified successfully
  verificationCodes.delete(normalizedPhone);
  return { success: true, message: 'Phone number verified successfully' };
}

export function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [phone, verification] of verificationCodes.entries()) {
    if (now > verification.expiresAt.getTime()) {
      verificationCodes.delete(phone);
    }
  }
}

// Clean up expired codes every 5 minutes
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);