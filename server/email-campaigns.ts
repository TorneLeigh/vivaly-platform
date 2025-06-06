import { sendEmail } from './email-service';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Trial Email Sequence for Parents (3 emails over 7 days)
export const parentTrialSequence: EmailTemplate[] = [
  // Day 1: Welcome (sent immediately in email-service.ts)
  
  // Day 2: Profile completion reminder
  {
    subject: "📝 Complete Your VIVALY Profile - Find Caregivers Today",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 28px; margin: 0; font-weight: 900;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Complete Your Profile in 3 Minutes</h2>
        
        <p style="color: #374151; line-height: 1.6;">Hi there! We noticed you started setting up your VIVALY profile but haven't finished yet. Complete it now to access our verified caregivers.</p>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📊 Families with complete profiles get:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>3x more responses from caregivers</li>
            <li>Priority access to top-rated providers</li>
            <li>Instant booking capabilities</li>
            <li>Background-checked caregivers only</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #000000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Your Profile</a>
        </div>
        
        <p style="color: #6B7280; font-size: 14px; text-align: center;">
          Need help? Reply to this email or call 1300 VIVALY
        </p>
      </div>
    `,
    text: "Complete your VIVALY profile to access verified caregivers. Families with complete profiles get 3x more responses. Takes just 3 minutes: https://vivaly.com.au/profile"
  },

  // Day 5: Cost comparison and final push
  {
    subject: "💰 Save $3,000+ Annually - Trial Ending Soon",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 28px; margin: 0; font-weight: 900;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Save Thousands on Childcare Costs</h2>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">💰 VIVALY vs Traditional Daycare (Annual):</h3>
          
          <div style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px;">
              <span style="color: #374151; font-weight: bold;">Traditional Daycare:</span>
              <span style="color: #DC2626; font-weight: bold;">$25,000+</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px;">
              <span style="color: #374151; font-weight: bold;">VIVALY Home Care:</span>
              <span style="color: #000000; font-weight: bold;">$18,000</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 15px; background: #000000; color: white; border-radius: 6px; font-size: 18px;">
              <span style="font-weight: bold;">Your Annual Savings:</span>
              <span style="font-weight: bold;">$7,200+</span>
            </div>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">✨ Plus These Benefits:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>1-on-1 attention for your child</li>
            <li>No daycare waitlists or limited spots</li>
            <li>Flexible hours that suit your schedule</li>
          </ul>
        </div>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #92400E; margin-top: 0;">⚡ Don't Miss Out - Trial Ending Soon:</h4>
          <p style="color: #92400E; margin: 0;">Your trial gives you priority access to verified caregivers. Complete your profile now to secure your spot and start saving thousands on childcare costs.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #000000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Your Profile Now</a>
        </div>
      </div>
    `,
    text: "Save $7,200+ annually with VIVALY vs traditional daycare. Trial ending soon - complete your profile now: https://vivaly.com.au/profile"
  }
];

// Caregiver Trial Sequence (2 emails over 5 days)
export const caregiverTrialSequence: EmailTemplate[] = [
  // Day 1: Welcome (sent immediately)
  
  // Day 3: Profile completion and earning potential
  {
    subject: "💰 Complete Your Profile - Start Earning $25-45/Hour",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 28px; margin: 0; font-weight: 900;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Complete Your Profile & Start Earning</h2>
        
        <p style="color: #374151; line-height: 1.6;">Complete your caregiver profile to start receiving booking requests from families in your area. Caregivers with complete profiles earn significantly more.</p>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">💰 Average Caregiver Earnings:</h3>
          
          <div style="margin: 20px 0;">
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #374151; font-weight: bold;">Hourly Rate:</span>
                <span style="color: #000000; font-weight: bold; font-size: 18px;">$25-45/hour</span>
              </div>
            </div>
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #374151; font-weight: bold;">Weekly (25 hours):</span>
                <span style="color: #000000; font-weight: bold; font-size: 18px;">$625-1,125</span>
              </div>
            </div>
            <div style="padding: 15px; background: #000000; color: white; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">Monthly Potential:</span>
                <span style="font-weight: bold; font-size: 20px;">$2,500-4,500+</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; background: #000000; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: white; margin: 0 0 10px 0;">Ready to Start Earning?</h3>
          <p style="color: white; margin: 0 0 20px 0; opacity: 0.9;">Join Australia's highest-earning childcare professionals</p>
          <a href="https://vivaly.com.au/caregiver-profile" style="background: white; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Your Profile</a>
        </div>
      </div>
    `,
    text: "Complete your VIVALY caregiver profile and start earning $25-45/hour with flexible schedules. Join Australia's highest-earning childcare professionals: https://vivaly.com.au/caregiver-profile"
  },

  // Day 5: Urgency and final push
  {
    subject: "⏰ Don't Miss Out - Join VIVALY's Top Earning Caregivers",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 28px; margin: 0; font-weight: 900;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">High Demand Alert: 3x More Families Than Caregivers</h2>
        
        <p style="color: #374151; line-height: 1.6;">The demand for quality childcare has never been higher. Families are waiting 18+ months for daycare spots, creating unprecedented opportunities for home-based caregivers.</p>
        
        <div style="text-align: center; background: #000000; color: white; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0;">💰 What You Could Earn This Month:</h3>
          <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0; font-size: 32px;">$4,800+</h4>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Based on 30 hours/week at $40/hour</p>
          </div>
          <p style="margin: 15px 0 0 0; opacity: 0.9;">Plus bonuses, tips, and repeat family bookings!</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">⭐ Recent Caregiver Review:</h4>
          <p style="color: #374151; font-style: italic; margin: 0;">"I wish I had joined VIVALY sooner! I'm earning more than I ever did at daycare centers, working fewer hours, and the families actually appreciate what I do. It's been life-changing." - Sarah M., Brisbane</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/join-now" style="background: #000000; color: white; padding: 18px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">Join VIVALY Today</a>
        </div>
        
        <div style="text-align: center;">
          <p style="color: #6B7280; font-size: 14px;">
            Ready to transform your childcare career? <br>
            Call us at <strong>1300 VIVALY</strong> - we're here to help!
          </p>
        </div>
      </div>
    `,
    text: "High demand: 3x more families than caregivers! Earn $4,800+/month with VIVALY. Transform your childcare career today: https://vivaly.com.au/join-now"
  }
];

export async function sendWeeklyNewsletter(userEmail: string, userName: string, userType: 'parent' | 'caregiver') {
  const isParent = userType === 'parent';
  
  const subject = isParent 
    ? "VIVALY Weekly: New Caregivers + Childcare Tips"
    : "VIVALY Caregiver Weekly: Booking Tips + Success Stories";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000000; font-size: 28px; margin: 0; font-weight: 900;">VIVALY</h1>
      </div>
      
      <h2 style="color: #1F2937;">Weekly Update</h2>
      
      <p style="color: #374151;">Hi ${userName},</p>
      
      ${isParent ? `
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">🆕 New Caregivers This Week</h3>
          <p style="color: #374151; margin: 0;">5 new verified caregivers joined in your area. Browse profiles and book care that fits your schedule.</p>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">💡 Childcare Tip of the Week</h3>
          <p style="color: #374151; margin: 0;">Create a simple daily routine chart to help your caregiver maintain consistency with your child's schedule.</p>
        </div>
      ` : `
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">📈 Booking Tip of the Week</h3>
          <p style="color: #374151; margin: 0;">Respond to family requests within 2 hours to increase your booking rate by 40%.</p>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">⭐ Caregiver Spotlight</h3>
          <p style="color: #374151; margin: 0;">This week we celebrate Emma K. from Melbourne, who achieved 50+ five-star reviews!</p>
        </div>
      `}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vivaly.com.au" style="background: #000000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Visit VIVALY</a>
      </div>
    </div>
  `;

  const text = isParent 
    ? `VIVALY Weekly: 5 new verified caregivers in your area + childcare tips. Visit: https://vivaly.com.au`
    : `VIVALY Weekly: Booking tips + caregiver spotlight. Respond within 2 hours for 40% more bookings. Visit: https://vivaly.com.au`;

  return await sendEmail({
    to: userEmail,
    subject,
    html,
    text
  });
}

export async function scheduleEmailSequence(
  userEmail: string,
  userName: string,
  userType: 'parent' | 'caregiver',
  userId: number
) {
  // In production, this would integrate with a job queue like Bull or Agenda
  // For now, we'll log the scheduled emails
  
  const sequence = userType === 'parent' ? parentTrialSequence : caregiverTrialSequence;
  const delays = userType === 'parent' ? [2, 5] : [3, 5]; // Days after signup
  
  console.log(`Scheduled ${sequence.length} emails for ${userType} ${userName} (${userEmail})`);
  
  sequence.forEach((email, index) => {
    console.log(`- Email ${index + 1}: "${email.subject}" scheduled for day ${delays[index]}`);
  });
  
  // In production, you would queue these emails with proper delays:
  // await emailQueue.add('send-trial-email', { userEmail, userName, userType, emailIndex: 0 }, { delay: 2 * 24 * 60 * 60 * 1000 });
  // await emailQueue.add('send-trial-email', { userEmail, userName, userType, emailIndex: 1 }, { delay: 5 * 24 * 60 * 60 * 1000 });
}