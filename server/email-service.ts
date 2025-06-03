import { MailService } from '@sendgrid/mail';

let mailService: MailService | null = null;

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!mailService) {
    console.log('📧 Email would be sent:', {
      to: params.to,
      from: params.from,
      subject: params.subject,
      preview: params.text ? params.text.substring(0, 100) + '...' : 'HTML email'
    });
    return true; // Return true for development so email flows work
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from || 'noreply@careconnect.com.au',
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Welcome email sequence for new nannies
export async function sendNannyWelcomeSequence(nannyEmail: string, nannyName: string) {
  const fromEmail = 'welcome@careconnect.com.au';
  
  // Day 0 - Welcome email
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: `Welcome to CareConnect, ${nannyName}! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to CareConnect!</h1>
        <p>Hi ${nannyName},</p>
        <p>We're thrilled to have you join our community of trusted caregivers! Your journey to connecting with amazing families starts now.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🚀 Next Steps to Get Started:</h3>
          <ul>
            <li>Complete your profile verification</li>
            <li>Upload your credentials (WWCC, First Aid, etc.)</li>
            <li>Add photos to showcase your personality</li>
            <li>Set your availability and rates</li>
          </ul>
        </div>
        
        <p><a href="https://careconnect.com.au/nanny-dashboard" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Your Profile →</a></p>
        
        <p>Need help? Reply to this email and our team will assist you.</p>
        <p>Best regards,<br>The CareConnect Team</p>
      </div>
    `
  });

  // Schedule follow-up emails (in a real implementation, you'd use a queue system)
  setTimeout(() => sendNannyProfileCompletionReminder(nannyEmail, nannyName), 24 * 60 * 60 * 1000); // 1 day
}

export async function sendNannyProfileCompletionReminder(nannyEmail: string, nannyName: string) {
  const fromEmail = 'support@careconnect.com.au';
  
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: `${nannyName}, complete your profile to get more bookings`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Don't Miss Out on Great Opportunities!</h1>
        <p>Hi ${nannyName},</p>
        <p>We noticed your profile isn't complete yet. Nannies with complete profiles get <strong>3x more bookings</strong> than those without!</p>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <h3>⚡ Quick wins to boost your profile:</h3>
          <ul>
            <li>Upload a professional photo (increases bookings by 60%)</li>
            <li>Add your certifications and experience</li>
            <li>Write a compelling bio that showcases your personality</li>
            <li>Verify your identity for the trust badge</li>
          </ul>
        </div>
        
        <p><a href="https://careconnect.com.au/nanny-dashboard" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Profile Now →</a></p>
        
        <p>Questions? Our team is here to help - just reply to this email.</p>
        <p>Cheers,<br>The CareConnect Team</p>
      </div>
    `
  });
}

export async function sendBookingConfirmation(nannyEmail: string, parentEmail: string, bookingDetails: any) {
  const fromEmail = 'bookings@careconnect.com.au';
  
  // Email to nanny
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: 'New Booking Confirmed! 📅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">New Booking Confirmed!</h1>
        <p>Great news! You have a new booking confirmed.</p>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Booking Details:</h3>
          <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
          <p><strong>Amount:</strong> $${bookingDetails.totalAmount}</p>
        </div>
        
        <p><a href="https://careconnect.com.au/nanny-dashboard" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Booking Details →</a></p>
        
        <p>Best of luck!<br>The CareConnect Team</p>
      </div>
    `
  });

  // Email to parent
  await sendEmail({
    to: parentEmail,
    from: fromEmail,
    subject: 'Booking Confirmed - Your caregiver is ready! ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Booking Confirmed!</h1>
        <p>Your booking has been confirmed. We're excited for you to meet your caregiver!</p>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Your Booking:</h3>
          <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
          <p><strong>Total:</strong> $${bookingDetails.totalAmount}</p>
        </div>
        
        <p><strong>Important reminders:</strong></p>
        <ul>
          <li>Be ready 5 minutes before the scheduled time</li>
          <li>Provide clear instructions about your needs</li>
          <li>Emergency contact details will be shared separately</li>
        </ul>
        
        <p>Need to make changes? Contact us immediately.</p>
        <p>Have a wonderful experience!<br>The CareConnect Team</p>
      </div>
    `
  });
}

export async function sendNewNannyAlert(nannyData: any) {
  const adminEmail = 'admin@careconnect.com.au';
  
  await sendEmail({
    to: adminEmail,
    from: 'alerts@careconnect.com.au',
    subject: `New Nanny Registration: ${nannyData.firstName} ${nannyData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">New Nanny Registration</h1>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>👤 Nanny Details:</h3>
          <p><strong>Name:</strong> ${nannyData.firstName} ${nannyData.lastName}</p>
          <p><strong>Email:</strong> ${nannyData.email}</p>
          <p><strong>Location:</strong> ${nannyData.location}</p>
          <p><strong>Experience:</strong> ${nannyData.experience} years</p>
          <p><strong>Rate:</strong> $${nannyData.hourlyRate}/hour</p>
        </div>
        
        <p><strong>Action Required:</strong> Review and verify the new nanny's credentials.</p>
        <p><a href="https://careconnect.com.au/admin/nannies/${nannyData.id}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Review Profile →</a></p>
      </div>
    `
  });
}