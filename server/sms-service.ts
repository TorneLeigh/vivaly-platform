import twilio from 'twilio';

// Check if Twilio credentials are available
const twilioAvailable = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);

let client: twilio.Twilio | null = null;

if (twilioAvailable) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
}

interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS(params: SMSParams): Promise<boolean> {
  if (!twilioAvailable || !client) {
    console.log(`SMS notification (Twilio not configured): ${params.message} to ${params.to}`);
    return false;
  }

  try {
    const message = await client.messages.create({
      body: params.message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: params.to
    });

    console.log(`SMS sent successfully: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}

export async function sendBookingConfirmationSMS(parentPhone: string, caregiverName: string, bookingDetails: any): Promise<boolean> {
  const message = `VIVALY: Booking confirmed! ${caregiverName} will provide care on ${bookingDetails.date} at ${bookingDetails.startTime}. Total: $${bookingDetails.totalAmount}. Questions? Reply HELP`;

  return await sendSMS({
    to: parentPhone,
    message
  });
}

export async function sendCaregiverBookingAlert(caregiverPhone: string, parentName: string, bookingDetails: any): Promise<boolean> {
  const message = `VIVALY: New booking request from ${parentName} for ${bookingDetails.date} at ${bookingDetails.startTime}. Login to accept or decline. Reply STOP to opt out`;

  return await sendSMS({
    to: caregiverPhone,
    message
  });
}

export async function sendVerificationCode(phone: string, code: string): Promise<boolean> {
  const message = `VIVALY verification code: ${code}. This code expires in 10 minutes. Do not share with anyone.`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendBookingReminder(phone: string, reminderType: '24h' | '2h', bookingDetails: any): Promise<boolean> {
  const timeText = reminderType === '24h' ? 'tomorrow' : 'in 2 hours';
  const message = `VIVALY reminder: Your booking with ${bookingDetails.caregiverName} is ${timeText} at ${bookingDetails.startTime}. Address: ${bookingDetails.address}`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendEmergencyAlert(phone: string, emergencyDetails: any): Promise<boolean> {
  const message = `VIVALY EMERGENCY: ${emergencyDetails.type} reported at ${emergencyDetails.address}. Emergency services contacted. Caregiver: ${emergencyDetails.caregiverName}`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendCancellationNotice(phone: string, bookingDetails: any, reason?: string): Promise<boolean> {
  const reasonText = reason ? ` Reason: ${reason}` : '';
  const message = `VIVALY: Booking cancelled for ${bookingDetails.date} at ${bookingDetails.startTime}.${reasonText} Any charges will be refunded within 3-5 business days.`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendPaymentConfirmation(phone: string, amount: string, bookingId: string): Promise<boolean> {
  const message = `VIVALY: Payment of $${amount} confirmed for booking #${bookingId}. Thank you for using VIVALY!`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendWelcomeSMS(phone: string, firstName: string, userType: 'parent' | 'caregiver'): Promise<boolean> {
  const message = userType === 'parent' 
    ? `Welcome to VIVALY, ${firstName}! Find trusted caregivers in your area. Complete your profile to get started: vivaly.com.au/profile`
    : `Welcome to VIVALY, ${firstName}! Start earning with flexible childcare work. Complete your verification: vivaly.com.au/verification`;

  return await sendSMS({
    to: phone,
    message
  });
}

export async function sendTrialWelcomeSMS(phone: string, firstName: string, userType: 'parent' | 'caregiver'): Promise<boolean> {
  const message = userType === 'parent'
    ? `Hi ${firstName}! Welcome to VIVALY trial. You now have priority access to verified caregivers in your area. Check your email for next steps!`
    : `Hi ${firstName}! Welcome to VIVALY caregiver trial. You're among the first to join Australia's home-based childcare marketplace. Check your email to get started!`;

  return await sendSMS({
    to: phone,
    message
  });
}