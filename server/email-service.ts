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
  const fromAddress = params.from || 'automated@vivaly.com.au';
  
  if (!mailService) {
    console.log('📧 Email would be sent:', {
      to: params.to,
      from: fromAddress,
      subject: params.subject,
      preview: params.text ? params.text.substring(0, 100) + '...' : 'HTML email'
    });
    return true; // Return true for development so email flows work
  }

  try {
    const emailData: any = {
      to: params.to,
      from: fromAddress,
      subject: params.subject,
    };
    
    if (params.text) emailData.text = params.text;
    if (params.html) emailData.html = params.html;
    
    await mailService.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Enhanced welcome email sequence for comprehensive caregiver onboarding
export async function sendCaregiverWelcomeSequence(
  caregiverEmail: string, 
  caregiverName: string, 
  applicationDetails: {
    applicationId: number;
    nextSteps: string[];
  }
) {
  const fromEmail = 'welcome@vivaly.com.au';
  
  // Day 0 - Comprehensive welcome email
  await sendEmail({
    to: caregiverEmail,
    from: fromEmail,
    subject: `Welcome to VIVALY ${caregiverName}! Your Application Has Been Received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: 900;">VIVALY</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Australia's Premier Childcare Platform</p>
          </div>
          
          <h2 style="color: #1e293b; margin-bottom: 15px;">Hi ${caregiverName},</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Thank you for submitting your comprehensive caregiver application! We're excited to have you join our 
            community of trusted childcare professionals across Australia.
          </p>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Application Status: Under Review</h3>
            <p style="color: #1e40af; margin: 10px 0;"><strong>Application ID:</strong> #${applicationDetails.applicationId}</p>
          </div>
          
          <h3 style="color: #1e293b; margin-bottom: 15px;">What Happens Next:</h3>
          <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
            ${applicationDetails.nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000000;">
            <h4 style="color: #1f2937; margin-top: 0;">Why Choose VIVALY?</h4>
            <ul style="color: #374151; margin: 10px 0; padding-left: 20px;">
              <li>Competitive rates with instant payments</li>
              <li>Comprehensive insurance coverage</li>
              <li>Flexible scheduling that works for you</li>
              <li>Direct communication with families</li>
              <li>Professional development opportunities</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://vivaly.com.au/caregiver/dashboard" 
               style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Track Your Application
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Questions? Reply to this email or contact us at <a href="mailto:support@vivaly.com.au" style="color: #2563eb;">support@vivaly.com.au</a><br>
            VIVALY - Connecting Families with Trusted Care
          </p>
        </div>
      </div>
    `
  });
}

// Enhanced admin notification for caregiver applications
export async function sendCaregiverApplicationAlert(applicationData: {
  applicationId: number;
  caregiver: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    suburb: string;
    experience: number;
    hourlyRate: string;
    services: string[];
    wwccNumber?: string;
    hasFirstAid: boolean;
    hasPoliceCheck: boolean;
  };
  urgency: 'standard' | 'priority' | 'urgent';
  estimatedReviewTime: string;
}) {
  const adminEmail = 'admin@vivaly.com.au';
  
  await sendEmail({
    to: adminEmail,
    from: 'applications@vivaly.com.au',
    subject: `[${applicationData.urgency.toUpperCase()}] New Caregiver Application - ${applicationData.caregiver.firstName} ${applicationData.caregiver.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Caregiver Application</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Requires review within ${applicationData.estimatedReviewTime}</p>
        </div>
        
        <div style="background-color: white; padding: 25px; border: 1px solid #e2e8f0; border-top: none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div>
              <h3 style="color: #1e293b; margin: 0 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Applicant Details</h3>
              <p><strong>Name:</strong> ${applicationData.caregiver.firstName} ${applicationData.caregiver.lastName}</p>
              <p><strong>Email:</strong> ${applicationData.caregiver.email}</p>
              <p><strong>Phone:</strong> ${applicationData.caregiver.phone}</p>
              <p><strong>Location:</strong> ${applicationData.caregiver.suburb}, ${applicationData.caregiver.location}</p>
            </div>
            
            <div>
              <h3 style="color: #1e293b; margin: 0 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Professional Profile</h3>
              <p><strong>Experience:</strong> ${applicationData.caregiver.experience} years</p>
              <p><strong>Hourly Rate:</strong> $${applicationData.caregiver.hourlyRate}/hour</p>
              <p><strong>Services:</strong> ${applicationData.caregiver.services.join(', ')}</p>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">Verification Status</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div>
                <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                      ${applicationData.caregiver.wwccNumber ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fef2f2; color: #dc2626;'}">
                  WWCC: ${applicationData.caregiver.wwccNumber ? 'Provided' : 'Pending'}
                </span>
              </div>
              <div>
                <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                      ${applicationData.caregiver.hasFirstAid ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fef2f2; color: #dc2626;'}">
                  First Aid: ${applicationData.caregiver.hasFirstAid ? 'Certified' : 'Not Provided'}
                </span>
              </div>
              <div>
                <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                      ${applicationData.caregiver.hasPoliceCheck ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fef2f2; color: #dc2626;'}">
                  Police Check: ${applicationData.caregiver.hasPoliceCheck ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://vivaly.com.au/admin/applications/${applicationData.applicationId}" 
               style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
              Review Application
            </a>
            <a href="mailto:${applicationData.caregiver.email}" 
               style="background-color: #64748b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Contact Applicant
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Application ID: #${applicationData.applicationId} | Submitted: ${new Date().toLocaleString('en-AU')}
          </p>
        </div>
      </div>
    `
  });
}

// Welcome email sequence for new nannies
export async function sendNannyWelcomeSequence(nannyEmail: string, nannyName: string) {
  const fromEmail = 'welcome@vivaly.com.au';
  
  // Day 0 - Welcome email
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: `Welcome to VIVALY, ${nannyName}! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">Welcome to VIVALY!</h1>
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
        
        <p><a href="https://vivaly.com.au/nanny-dashboard" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Your Profile →</a></p>
        
        <p>Need help? Reply to this email and our team will assist you.</p>
        <p>Best regards,<br>The VIVALY Team</p>
      </div>
    `
  });

  // Schedule follow-up emails (in a real implementation, you'd use a queue system)
  setTimeout(() => sendNannyProfileCompletionReminder(nannyEmail, nannyName), 24 * 60 * 60 * 1000); // 1 day
}

export async function sendNannyProfileCompletionReminder(nannyEmail: string, nannyName: string) {
  const fromEmail = 'support@vivaly.com.au';
  
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: `${nannyName}, complete your profile to get more bookings`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">Don't Miss Out on Great Opportunities!</h1>
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
        
        <p><a href="https://vivaly.com.au/nanny-dashboard" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Profile Now →</a></p>
        
        <p>Questions? Our team is here to help - just reply to this email.</p>
        <p>Cheers,<br>The VIVALY Team</p>
      </div>
    `
  });
}

export async function sendBookingConfirmation(nannyEmail: string, parentEmail: string, bookingDetails: any) {
  const fromEmail = 'bookings@vivaly.com.au';
  
  // Email to nanny
  await sendEmail({
    to: nannyEmail,
    from: fromEmail,
    subject: 'New Booking Confirmed! 📅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">New Booking Confirmed!</h1>
        <p>Great news! You have a new booking confirmed.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000000;">
          <h3>📋 Booking Details:</h3>
          <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
          <p><strong>Amount:</strong> $${bookingDetails.totalAmount}</p>
        </div>
        
        <p><a href="https://vivaly.com.au/nanny-dashboard" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Booking Details →</a></p>
        
        <p>Best of luck!<br>The VIVALY Team</p>
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
        <h1 style="color: #000000; font-weight: 900;">Booking Confirmed!</h1>
        <p>Your booking has been confirmed. We're excited for you to meet your caregiver!</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000000;">
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
        <p>Have a wonderful experience!<br>The VIVALY Team</p>
      </div>
    `
  });
}

export async function sendNewNannyAlert(nannyData: any) {
  const adminEmail = 'admin@vivaly.com.au';
  
  await sendEmail({
    to: adminEmail,
    from: 'alerts@vivaly.com.au',
    subject: `New Nanny Registration: ${nannyData.firstName} ${nannyData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">New Nanny Registration</h1>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>👤 Nanny Details:</h3>
          <p><strong>Name:</strong> ${nannyData.firstName} ${nannyData.lastName}</p>
          <p><strong>Email:</strong> ${nannyData.email}</p>
          <p><strong>Location:</strong> ${nannyData.location}</p>
          <p><strong>Experience:</strong> ${nannyData.experience} years</p>
          <p><strong>Rate:</strong> $${nannyData.hourlyRate}/hour</p>
        </div>
        
        <p><strong>Action Required:</strong> Review and verify the new nanny's credentials.</p>
        <p><a href="https://vivaly.com.au/admin/nannies/${nannyData.id}" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Review Profile →</a></p>
      </div>
    `
  });
}

// Advanced Email Automation Sequences

// Parent Welcome Email Sequence
export async function sendParentWelcomeSequence(parentEmail: string, parentName: string) {
  const fromEmail = 'welcome@vivaly.com.au';
  
  await sendEmail({
    to: parentEmail,
    from: fromEmail,
    subject: `Welcome to VIVALY, ${parentName}! Your trusted care journey begins`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">Welcome to VIVALY!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Australia's Premier Childcare Platform</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; line-height: 1.6;">Hi ${parentName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Welcome to VIVALY! We're thrilled you've chosen us to help find the perfect care for your family.</p>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #000000;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">🚀 Get Started in 3 Easy Steps:</h3>
            <div style="margin: 15px 0;">
              <strong style="color: #374151;">1. Browse Verified Caregivers</strong>
              <p style="margin: 5px 0; color: #6b7280;">All our caregivers are background-checked and WWCC verified</p>
            </div>
            <div style="margin: 15px 0;">
              <strong style="color: #374151;">2. Read Reviews & Connect</strong>
              <p style="margin: 5px 0; color: #6b7280;">Chat directly with caregivers and read authentic reviews</p>
            </div>
            <div style="margin: 15px 0;">
              <strong style="color: #374151;">3. Book with Confidence</strong>
              <p style="margin: 5px 0; color: #6b7280;">Secure booking system with payment protection</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://vivaly.com.au/search" style="background: #000000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Find Your Perfect Caregiver →</a>
          </div>
          
          <div style="background: #fef3e2; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">💡 Pro Tip:</h4>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">Complete your family profile to help caregivers understand your needs better. Families with complete profiles receive 40% more responses!</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Need help getting started? Our support team is here for you - just reply to this email.</p>
          <p style="font-size: 16px; line-height: 1.6;">Best regards,<br><strong>The VIVALY Team</strong></p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Follow us for tips and updates:</p>
          <div style="margin: 10px 0;">
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 10px;">Facebook</a>
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 10px;">LinkedIn</a>
          </div>
        </div>
      </div>
    `
  });

  // Schedule follow-up email
  setTimeout(() => sendParentEngagementEmail(parentEmail, parentName), 3 * 24 * 60 * 60 * 1000); // 3 days
}

// Parent Engagement Follow-up
export async function sendParentEngagementEmail(parentEmail: string, parentName: string) {
  await sendEmail({
    to: parentEmail,
    from: 'support@vivaly.com.au',
    subject: `${parentName}, discover what makes VIVALY families happy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">Real Stories, Real Families</h1>
        <p>Hi ${parentName},</p>
        <p>Here are some helpful tips and featured caregivers to explore this week.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000000;">
          <h3>🎯 New Caregivers Available</h3>
          <p>New verified caregivers have joined VIVALY in your area. Visit your dashboard to browse their profiles, read reviews, and connect with the right caregiver for your family.</p>
        </div>
        
        <p style="text-align: center;">
          <a href="https://vivaly.com.au/search" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Featured Caregivers →</a>
        </p>
        
        <p>Still have questions? Our team is here to help you every step of the way.</p>
        <p>Warm regards,<br>The VIVALY Team</p>
      </div>
    `
  });
}

// Booking Reminder Emails
export async function sendBookingReminder(userEmail: string, bookingDetails: any, reminderType: '24h' | '2h') {
  const timeframe = reminderType === '24h' ? '24 hours' : '2 hours';
  const urgencyColor = reminderType === '24h' ? '#000000' : '#6b7280';
  
  await sendEmail({
    to: userEmail,
    from: 'reminders@vivaly.com.au',
    subject: `Booking reminder: Your care session starts in ${timeframe}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${urgencyColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Booking Reminder</h1>
          <p style="margin: 10px 0 0 0;">Your care session starts in ${timeframe}</p>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📅 Booking Details:</h3>
            <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString('en-AU')}</p>
            <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
            <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
            <p><strong>Location:</strong> ${bookingDetails.location}</p>
          </div>
          
          ${reminderType === '2h' ? `
            <div style="background: #fef3e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin: 0 0 10px 0;">⚡ Final Preparations:</h4>
              <ul style="color: #92400e; margin: 0;">
                <li>Prepare any special instructions</li>
                <li>Ensure contact details are accessible</li>
                <li>Have backup plans ready if needed</li>
              </ul>
            </div>
          ` : ''}
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://vivaly.com.au/bookings" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Booking Details →</a>
          </p>
          
          <p>Need to make changes? Contact us immediately at support@vivaly.com.au</p>
          <p>Best regards,<br>The VIVALY Team</p>
        </div>
      </div>
    `
  });
}

// Post-Booking Follow-up
export async function sendPostBookingFeedback(userEmail: string, userName: string, bookingId: number) {
  await sendEmail({
    to: userEmail,
    from: 'feedback@vivaly.com.au',
    subject: 'How was your care experience? Share your feedback',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000000; font-weight: 900;">How was your experience?</h1>
        <p>Hi ${userName},</p>
        <p>We hope your recent care session went wonderfully! Your feedback helps us maintain the highest quality of care on our platform.</p>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; border: 1px solid #e5e7eb;">
          <h3 style="color: #000000; margin: 0 0 20px 0;">Rate Your Experience</h3>
          <div style="margin: 20px 0;">
            <a href="https://vivaly.com.au/review/${bookingId}?rating=5" style="background: #000000; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; margin: 0 5px; font-size: 18px;">⭐⭐⭐⭐⭐</a>
          </div>
          <div style="margin: 10px 0;">
            <a href="https://vivaly.com.au/review/${bookingId}?rating=4" style="background: #374151; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; margin: 0 3px;">⭐⭐⭐⭐</a>
            <a href="https://vivaly.com.au/review/${bookingId}?rating=3" style="background: #4b5563; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; margin: 0 3px;">⭐⭐⭐</a>
            <a href="https://vivaly.com.au/review/${bookingId}?rating=2" style="background: #6b7280; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; margin: 0 3px;">⭐⭐</a>
            <a href="https://vivaly.com.au/review/${bookingId}?rating=1" style="background: #9ca3af; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; margin: 0 3px;">⭐</a>
          </div>
        </div>
        
        <div style="background: #fef3e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">💡 Your review helps:</h4>
          <ul style="color: #92400e; margin: 0;">
            <li>Other families make informed decisions</li>
            <li>Caregivers improve their services</li>
            <li>Build a stronger, trusted community</li>
          </ul>
        </div>
        
        <p style="text-align: center;">
          <a href="https://vivaly.com.au/review/${bookingId}" style="background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Write Detailed Review →</a>
        </p>
        
        <p>Thank you for being part of the VIVALY community!</p>
        <p>Best regards,<br>The VIVALY Team</p>
      </div>
    `
  });
}

// Caregiver Performance Alerts
export async function sendCaregiverPerformanceAlert(caregiverEmail: string, caregiverName: string, metrics: any) {
  const alertType = metrics.averageRating < 4.0 ? 'improvement' : 'celebration';
  const alertColor = alertType === 'improvement' ? '#ef4444' : '#10b981';
  
  await sendEmail({
    to: caregiverEmail,
    from: 'performance@aircareau.com',
    subject: alertType === 'improvement' 
      ? `${caregiverName}, let's improve your booking success` 
      : `${caregiverName}, your exceptional performance is paying off!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${alertColor}; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">${alertType === 'improvement' ? '📈 Performance Insights' : '🎉 Outstanding Performance!'}</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${caregiverName},</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📊 Your Performance Summary:</h3>
            <p><strong>Average Rating:</strong> ${metrics.averageRating}/5.0 (${metrics.totalReviews} reviews)</p>
            <p><strong>Response Rate:</strong> ${metrics.responseRate}%</p>
            <p><strong>Booking Success:</strong> ${metrics.bookingSuccessRate}%</p>
            <p><strong>This Month's Bookings:</strong> ${metrics.monthlyBookings}</p>
          </div>
          
          ${alertType === 'improvement' ? `
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h4 style="color: #b91c1c; margin: 0 0 10px 0;">🎯 Improvement Opportunities:</h4>
              <ul style="color: #b91c1c; margin: 0;">
                <li>Respond to messages within 2 hours for better booking rates</li>
                <li>Ask families about specific needs to provide better service</li>
                <li>Follow up after bookings to ensure satisfaction</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="https://aircareau.com/caregiver-resources" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Improvement Resources →</a>
            </p>
          ` : `
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h4 style="color: #065f46; margin: 0 0 10px 0;">🏆 What you're doing right:</h4>
              <ul style="color: #065f46; margin: 0;">
                <li>Maintaining excellent communication with families</li>
                <li>Providing consistent, high-quality care</li>
                <li>Building strong relationships with repeat clients</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="https://aircareau.com/caregiver-rewards" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Rewards →</a>
            </p>
          `}
          
          <p>Keep up the great work and thank you for being part of our community!</p>
          <p>Best regards,<br>The VIVALY Team</p>
        </div>
      </div>
    `
  });
}

// Weekly Newsletter
export async function sendWeeklyNewsletter(userEmail: string, userName: string, userType: 'parent' | 'caregiver') {
  const content = userType === 'parent' ? {
    subject: 'This week in VIVALY: New caregivers and parenting tips',
    title: 'Weekly Family Update',
    mainContent: `
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #065f46;">🌟 New Caregivers This Week</h3>
        <p>New verified caregivers have joined in your area. Check out their profiles and book your next care session.</p>
      </div>
      
      <div style="background: #fef3e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">📚 Care Resources</h3>
        <p>Browse our resource library for expert guidance on child development, safety tips, and family wellness.</p>
      </div>
    `,
    cta: 'Find New Caregivers →',
    ctaLink: 'https://vivaly.com.au/search'
  } : {
    subject: 'VIVALY Weekly: Boost your bookings and care tips',
    title: 'Weekly Caregiver Update',
    mainContent: `
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #065f46;">💼 Booking Opportunities</h3>
        <p>New families are looking for caregivers in your area. Update your availability to get more booking requests this week.</p>
      </div>
      
      <div style="background: #fef3e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">🎯 Caregiver Resources</h3>
        <p>Access our professional development resources, safety guidelines, and best practices for exceptional child care.</p>
      </div>
    `,
    cta: 'Update Availability →',
    ctaLink: 'https://vivaly.com.au/caregiver-dashboard'
  };

  await sendEmail({
    to: userEmail,
    from: 'newsletter@vivaly.com.au',
    subject: content.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900;">VIVALY</h1>
          <h2 style="margin: 10px 0 0 0; font-weight: 600;">${content.title}</h2>
          <p style="margin: 10px 0 0 0;">Your weekly dose of care community updates</p>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${userName},</p>
          <p>Hope you're having a wonderful week! Here's what's happening in your VIVALY community:</p>
          
          ${content.mainContent}
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937;">📱 Platform Updates</h3>
            <ul style="color: #4b5563;">
              <li>🎉 New families joining daily</li>
              <li>⭐ Growing community of verified caregivers</li>
              <li>🏆 Enhanced safety and verification processes</li>
            </ul>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${content.ctaLink}" style="background: #000000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">${content.cta}</a>
          </p>
          
          <p>Thanks for being part of our amazing community!</p>
          <p>Warm regards,<br>The VIVALY Team</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Don't want weekly updates? <a href="#" style="color: #000000;">Unsubscribe here</a>
          </p>
        </div>
      </div>
    `
  });
}

// Emergency Contact Verification
export async function sendEmergencyContactVerification(contactEmail: string, familyName: string, caregiverName: string) {
  await sendEmail({
    to: contactEmail,
    from: 'safety@vivaly.com.au',
    subject: 'Emergency Contact Verification - VIVALY Care Session',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">🚨 Emergency Contact Verification</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p><strong>Important:</strong> You have been listed as an emergency contact for a care session.</p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #b91c1c; margin: 0 0 15px 0;">Session Details:</h3>
            <p><strong>Family:</strong> ${familyName}</p>
            <p><strong>Caregiver:</strong> ${caregiverName}</p>
            <p><strong>Your Role:</strong> Emergency Contact</p>
            <p><strong>Session Date:</strong> ${new Date().toLocaleDateString('en-AU')}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1f2937; margin: 0 0 10px 0;">📞 What this means:</h4>
            <ul style="color: #4b5563; margin: 0;">
              <li>Please keep your phone accessible during the care session</li>
              <li>You may be contacted only in case of emergency</li>
              <li>This verification confirms your contact details are current</li>
            </ul>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://vivaly.com.au/emergency-contact/confirm" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirm Availability →</a>
          </p>
          
          <p><strong>Questions or concerns?</strong> Contact our safety team immediately at safety@vivaly.com.au or call our emergency line.</p>
          <p>Thank you for helping keep our community safe.</p>
          <p>The VIVALY Safety Team</p>
        </div>
      </div>
    `
  });
}