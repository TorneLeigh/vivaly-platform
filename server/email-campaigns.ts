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
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Hi there! 👋</h2>
        
        <p style="color: #374151; line-height: 1.6;">We noticed you haven't completed your family profile yet. This only takes 3 minutes and unlocks access to verified caregivers in your area.</p>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F59E0B;">
          <h4 style="color: #92400E; margin-top: 0;">⏰ Did You Know?</h4>
          <p style="color: #92400E; margin: 0;">Families with complete profiles get 3x more caregiver responses and book 50% faster.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Profile (3 min)</a>
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
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">The True Cost of Childcare in Australia</h2>
        
        <div style="background: linear-gradient(135deg, #FEE2E2 0%, #FEF3C7 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0; text-align: center;">Monthly Childcare Costs Comparison</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h4 style="color: #DC2626; margin: 0 0 10px 0;">Traditional Daycare</h4>
              <p style="color: #374151; margin: 0; font-size: 24px; font-weight: bold;">$1,800/month</p>
              <p style="color: #6B7280; font-size: 12px; margin: 5px 0 0 0;">+ waitlists + rigid schedules</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h4 style="color: #059669; margin: 0 0 10px 0;">VIVALY Home Care</h4>
              <p style="color: #374151; margin: 0; font-size: 24px; font-weight: bold;">$1,200/month</p>
              <p style="color: #6B7280; font-size: 12px; margin: 5px 0 0 0;">+ flexible + personalized</p>
            </div>
          </div>
          
          <div style="text-align: center; background: #059669; color: white; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0;">Annual Savings: $7,200</h4>
          </div>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">🎯 Additional VIVALY Benefits:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>1-on-1 attention for your child</li>
            <li>No sick day policies or fees</li>
            <li>Care in your own home</li>
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
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Turn Your Childcare Skills Into Income</h2>
        
        <p style="color: #374151; line-height: 1.6;">You're just a few steps away from joining Australia's highest-earning childcare professionals. Complete your profile to start receiving booking requests.</p>
        
        <div style="background: linear-gradient(135deg, #059669 0%, #0891B2 100%); padding: 25px; border-radius: 12px; margin: 25px 0; color: white; text-align: center;">
          <h3 style="margin: 0 0 15px 0;">💰 Your Earning Potential</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
              <h4 style="margin: 0; font-size: 24px;">$25-35/hr</h4>
              <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Casual Care</p>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
              <h4 style="margin: 0; font-size: 24px;">$35-45/hr</h4>
              <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Experienced</p>
            </div>
          </div>
          <p style="margin: 0; opacity: 0.9;">Plus tips and bonuses from families!</p>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📝 Quick Profile Checklist:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>✓ Add your experience and qualifications</li>
            <li>✓ Upload WWCC and First Aid certificates</li>
            <li>✓ Set your hourly rates and availability</li>
            <li>✓ Write a brief bio about yourself</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/caregiver-profile" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Profile & Start Earning</a>
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
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">The childcare industry is booming 📈</h2>
        
        <p style="color: #374151; line-height: 1.6;">With daycare waitlists at an all-time high, families are desperately seeking quality caregivers like you. Don't miss this opportunity to join Australia's fastest-growing childcare marketplace.</p>
        
        <div style="background: #FEE2E2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #DC2626;">
          <h4 style="color: #DC2626; margin-top: 0;">🚨 High Demand Alert</h4>
          <p style="color: #374151; margin: 0;">We currently have 3x more family requests than available caregivers in most areas. This means:</p>
          <ul style="color: #374151; margin: 10px 0 0 0;">
            <li>More booking opportunities</li>
            <li>Higher hourly rates</li>
            <li>Choice of the best families</li>
          </ul>
        </div>
        
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 25px; border-radius: 12px; margin: 25px 0; color: white; text-align: center;">
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
    text: "Don't miss out! High demand for caregivers means more opportunities and higher rates. You could earn $4,800+ this month with VIVALY. Join now: https://vivaly.com.au/join-now"
  }
];

// Weekly Newsletter Templates
export async function sendWeeklyNewsletter(userEmail: string, userName: string, userType: 'parent' | 'caregiver') {
  const isParent = userType === 'parent';
  
  const subject = isParent 
    ? "VIVALY Weekly: New Caregivers + Childcare Tips"
    : "VIVALY Caregiver Weekly: Booking Tips + Success Stories";

  const html = isParent ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Your Weekly Childcare Update</p>
      </div>
      
      <h2 style="color: #1F2937;">Hi ${userName} 👋</h2>
      
      <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1F2937; margin-top: 0;">🆕 New Caregivers This Week</h3>
        <p style="color: #374151; margin: 0;">15 new verified caregivers joined in your area! Browse their profiles and book care for next week.</p>
        <div style="text-align: center; margin: 15px 0 0 0;">
          <a href="https://vivaly.com.au/find-caregivers" style="background: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Browse New Caregivers</a>
        </div>
      </div>
      
      <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1F2937; margin-top: 0;">💡 Childcare Tip of the Week</h3>
        <h4 style="color: #1F2937; margin: 10px 0;">Building Trust with New Caregivers</h4>
        <p style="color: #374151; margin: 0;">Start with a meet-and-greet session before the first booking. This helps your child feel comfortable and gives you confidence in your caregiver choice.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vivaly.com.au/resources" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">More Parenting Resources</a>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Caregiver Success Weekly</p>
      </div>
      
      <h2 style="color: #1F2937;">Hi ${userName} 👋</h2>
      
      <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1F2937; margin-top: 0;">📈 This Week's Booking Tips</h3>
        <p style="color: #374151; margin: 0;"><strong>Respond within 2 hours:</strong> Caregivers who respond to families quickly get 70% more bookings. Set up mobile notifications to never miss an opportunity!</p>
      </div>
      
      <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1F2937; margin-top: 0;">⭐ Caregiver Spotlight</h3>
        <p style="color: #374151; margin: 0;"><strong>Jessica K.</strong> earned $890 this week by being available for last-minute bookings. Emergency care requests often pay premium rates!</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vivaly.com.au/caregiver-resources" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Caregiver Resources</a>
      </div>
    </div>
  `;

  const text = isParent 
    ? `VIVALY Weekly Update: 15 new caregivers in your area + childcare tips. Browse caregivers: https://vivaly.com.au/find-caregivers`
    : `VIVALY Caregiver Weekly: Respond within 2 hours for 70% more bookings + success stories. Resources: https://vivaly.com.au/caregiver-resources`;

  return await sendEmail({
    to: userEmail,
    subject,
    html,
    text
  });
}

// Automated email scheduling
export async function scheduleEmailSequence(
  userEmail: string, 
  userName: string, 
  userType: 'parent' | 'caregiver'
) {
  const sequence = userType === 'parent' ? parentTrialSequence : caregiverTrialSequence;
  const delays = userType === 'parent' 
    ? [2, 4, 6, 8, 10, 12, 14] // Days for parent sequence
    : [3, 5, 7, 10]; // Days for caregiver sequence

  // In a production environment, you would use a job queue like Bull or a cron scheduler
  // For now, we'll log the scheduled emails
  console.log(`Scheduled ${sequence.length} emails for ${userType} ${userName} (${userEmail})`);
  
  sequence.forEach((email, index) => {
    const delay = delays[index];
    console.log(`- Email ${index + 1}: "${email.subject}" scheduled for day ${delay}`);
  });

  return true;
}