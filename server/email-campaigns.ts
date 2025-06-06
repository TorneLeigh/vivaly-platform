import { sendEmail } from './email-service';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Trial Email Sequence for Parents (7 emails over 14 days)
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

  // Day 4: Success stories and social proof
  {
    subject: "🌟 How Sarah Found Her Perfect Caregiver in 24 Hours",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Real Stories from Real Families</h2>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: #7C3AED; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">S</div>
            <div>
              <h4 style="margin: 0; color: #1F2937;">Sarah M. - Mother of 2</h4>
              <p style="margin: 0; color: #6B7280; font-size: 14px;">Bondi, NSW</p>
            </div>
          </div>
          <p style="color: #374151; font-style: italic; line-height: 1.6; margin: 0;">"I was on 3 daycare waitlists for over a year. With VIVALY, I found Emma within 24 hours. She's been caring for my kids for 6 months now - they absolutely love her! Plus I'm saving $200/week compared to traditional daycare."</p>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📊 VIVALY vs. Traditional Childcare:</h4>
          <ul style="color: #374151; line-height: 1.8; margin: 0;">
            <li>⚡ Find care in 24-48 hours (vs. 18 month waitlists)</li>
            <li>💰 Save 30-50% on childcare costs</li>
            <li>🕒 Book care from 2 hours to full days</li>
            <li>✅ All caregivers verified with WWCC</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/find-caregivers" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Find Your Perfect Caregiver</a>
        </div>
      </div>
    `,
    text: "Sarah found her perfect caregiver in 24 hours and saves $200/week vs daycare. Skip 18-month waitlists with VIVALY: https://vivaly.com.au/find-caregivers"
  },

  // Day 6: Cost comparison and savings
  {
    subject: "💰 Save $3,000+ Annually on Childcare Costs",
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
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/calculator" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Calculate Your Savings</a>
        </div>
      </div>
    `,
    text: "Save $7,200+ annually with VIVALY vs traditional daycare. Get flexible, personalized care without the waitlists. Calculate your savings: https://vivaly.com.au/calculator"
  },

  // Day 8: Caregiver quality and verification
  {
    subject: "🛡️ How We Verify Every VIVALY Caregiver",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Your Child's Safety is Our Priority</h2>
        
        <p style="color: #374151; line-height: 1.6;">Every caregiver on VIVALY goes through our comprehensive 7-step verification process before they can accept any bookings.</p>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">🔍 Our Verification Process:</h3>
          
          <div style="margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 30px; height: 30px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">✓</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Working with Children Check (WWCC)</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Mandatory government background check</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 30px; height: 30px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">✓</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">First Aid & CPR Certification</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Current pediatric first aid training</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 30px; height: 30px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">✓</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Identity Verification</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Photo ID and address confirmation</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 30px; height: 30px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">✓</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Experience Verification</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">References and qualifications checked</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 30px; height: 30px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">✓</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Video Interview</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Personal interview with our team</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📱 Ongoing Safety Features:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>Real-time check-ins during care sessions</li>
            <li>24/7 emergency support line</li>
            <li>Parent and caregiver ratings system</li>
            <li>Secure in-app messaging</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/safety" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Learn More About Our Safety</a>
        </div>
      </div>
    `,
    text: "Every VIVALY caregiver is verified with WWCC, First Aid, identity checks, and video interviews. Your child's safety is our priority. Learn more: https://vivaly.com.au/safety"
  },

  // Day 10: Urgency and limited time offer
  {
    subject: "⏰ Your VIVALY Trial Expires Soon - Don't Miss Out",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <div style="background: #FEE2E2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #DC2626;">
          <h2 style="color: #DC2626; margin-top: 0;">Trial Ending Soon ⏰</h2>
          <p style="color: #374151; margin: 0; line-height: 1.6;">Your priority access to VIVALY's verified caregivers expires in 3 days. Don't lose your chance to skip the daycare waitlists.</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">What You'll Miss:</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0;">
            <li>❌ Access to 500+ verified caregivers</li>
            <li>❌ Skip 18-month daycare waitlists</li>
            <li>❌ Save $7,200+ annually on childcare</li>
            <li>❌ Flexible care from 2 hours to full days</li>
            <li>❌ 1-on-1 attention for your child</li>
          </ul>
        </div>
        
        <div style="text-align: center; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: white; margin: 0 0 10px 0;">Ready to Get Started?</h3>
          <p style="color: white; margin: 0 0 20px 0; opacity: 0.9;">Complete your profile and book your first caregiver today</p>
          <a href="https://vivaly.com.au/profile" style="background: white; color: #7C3AED; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Complete Profile Now</a>
        </div>
        
        <div style="text-align: center;">
          <p style="color: #6B7280; font-size: 14px;">
            Questions? Call us at <strong>1300 VIVALY</strong> - we're here to help!
          </p>
        </div>
      </div>
    `,
    text: "Your VIVALY trial expires in 3 days! Don't miss priority access to 500+ verified caregivers. Complete your profile now: https://vivaly.com.au/profile"
  },

  // Day 12: Last chance
  {
    subject: "🚨 Final Notice: VIVALY Trial Expires Tomorrow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <div style="background: #DC2626; color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">🚨 FINAL NOTICE</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your trial expires in 24 hours</p>
        </div>
        
        <h3 style="color: #1F2937;">Don't let another family take your spot</h3>
        
        <p style="color: #374151; line-height: 1.6;">Hundreds of families join VIVALY every week. Once your trial expires, you'll join the regular waitlist and lose priority access to our best caregivers.</p>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #92400E; margin-top: 0;">⚡ Take Action in the Next 24 Hours:</h4>
          <ol style="color: #92400E; line-height: 1.6; margin: 0;">
            <li>Complete your family profile (2 minutes)</li>
            <li>Browse verified caregivers in your area</li>
            <li>Book your first session and save hundreds</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/profile" style="background: #DC2626; color: white; padding: 18px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">Secure Your Spot Now</a>
        </div>
        
        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="color: #6B7280; margin: 0; font-size: 14px;">
            This is the last email about your trial. After 24 hours, your priority access will expire.
          </p>
        </div>
      </div>
    `,
    text: "FINAL NOTICE: Your VIVALY trial expires in 24 hours! Don't lose priority access to verified caregivers. Secure your spot: https://vivaly.com.au/profile"
  },

  // Day 14: Re-engagement offer
  {
    subject: "We Miss You - Special Offer to Rejoin VIVALY",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">We miss you! 💙</h2>
        
        <p style="color: #374151; line-height: 1.6;">Your trial has ended, but we'd love to have you back. We understand finding the right childcare solution takes time, so we're extending a special offer.</p>
        
        <div style="background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; color: white;">
          <h3 style="margin: 0 0 15px 0;">🎁 Special Comeback Offer</h3>
          <p style="margin: 0 0 20px 0; font-size: 18px; opacity: 0.9;">Extended trial + $50 credit for your first booking</p>
          <a href="https://vivaly.com.au/comeback" style="background: white; color: #10B981; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Claim Your Offer</a>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">Recent Parent Feedback:</h4>
          <p style="color: #374151; font-style: italic; margin: 0;">"I wish I had started with VIVALY sooner. My daughter loves her caregiver, and I'm saving so much compared to daycare. The flexibility is incredible." - Emma K., Melbourne</p>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">This offer is valid for 7 days only. Join the thousands of families who've already made the switch to stress-free, flexible childcare.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/comeback" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Get Started Again</a>
        </div>
      </div>
    `,
    text: "We miss you! Get back on VIVALY with an extended trial + $50 credit for your first booking. Offer valid 7 days: https://vivaly.com.au/comeback"
  }
];

// Caregiver Trial Sequence (5 emails over 10 days)
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

  // Day 5: Success stories from other caregivers
  {
    subject: "🌟 How Lisa Earns $1,200/Week with VIVALY",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Success Stories from Our Top Caregivers</h2>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 20px; font-size: 24px;">L</div>
            <div>
              <h4 style="margin: 0; color: #1F2937; font-size: 18px;">Lisa T.</h4>
              <p style="margin: 0; color: #6B7280;">Early Childhood Educator, Sydney</p>
              <div style="color: #F59E0B; margin: 5px 0;">⭐⭐⭐⭐⭐ 4.9/5 rating</div>
            </div>
          </div>
          <p style="color: #374151; font-style: italic; line-height: 1.6; margin: 0;">"I joined VIVALY 8 months ago and it's transformed my career. I now earn $1,200/week working just 4 days, choose my own families, and have a flexible schedule that fits my life. The families are wonderful and really value what I do."</p>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">📊 Lisa's Typical Week:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>Monday: Johnson family (6 hours) - $210</li>
            <li>Tuesday: Brown twins (8 hours) - $320</li>
            <li>Wednesday: Off day (her choice!)</li>
            <li>Thursday: Wilson family (7 hours) - $280</li>
            <li>Friday: Two families (9 hours) - $360</li>
            <li><strong>Total: $1,170/week + tips</strong></li>
          </ul>
        </div>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F59E0B;">
          <h4 style="color: #92400E; margin-top: 0;">💡 Top Caregiver Tips:</h4>
          <ul style="color: #92400E; line-height: 1.6; margin: 0;">
            <li>Complete profiles get 5x more bookings</li>
            <li>Set competitive but fair rates for your area</li>
            <li>Respond to families within 2 hours</li>
            <li>Great reviews lead to repeat bookings</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/caregiver-success" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Read More Success Stories</a>
        </div>
      </div>
    `,
    text: "Lisa earns $1,200/week as a VIVALY caregiver with flexible schedules and great families. Complete your profile to start your success story: https://vivaly.com.au/caregiver-success"
  },

  // Day 7: Verification process and requirements
  {
    subject: "🛡️ Your VIVALY Verification - Simple Steps to Get Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">VIVALY</h1>
        </div>
        
        <h2 style="color: #1F2937;">Get Verified in 24-48 Hours</h2>
        
        <p style="color: #374151; line-height: 1.6;">Our verification process ensures both you and families feel safe and confident. Here's exactly what you need to get approved quickly.</p>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">📋 Required Documents:</h3>
          
          <div style="margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px;">
              <div style="width: 40px; height: 40px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Working with Children Check (WWCC)</h4>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Must be current and valid. Apply at service.nsw.gov.au if you don't have one.</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px;">
              <div style="width: 40px; height: 40px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">First Aid & CPR Certificate</h4>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Must include pediatric first aid. We can help you get certified!</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px;">
              <div style="width: 40px; height: 40px; background: #10B981; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
              <div>
                <h4 style="margin: 0; color: #1F2937;">Photo ID</h4>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Driver's license or passport for identity verification.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #1F2937; margin-top: 0;">⚡ Fast-Track Tips:</h4>
          <ul style="color: #374151; line-height: 1.6; margin: 0;">
            <li>Upload clear, high-quality photos of documents</li>
            <li>Ensure all certificates are current (not expired)</li>
            <li>Complete your profile 100% before submitting</li>
            <li>Respond quickly to any follow-up questions</li>
          </ul>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="color: #059669; margin: 0; text-align: center; font-weight: bold;">✅ Once approved, you'll start receiving booking requests immediately!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivaly.com.au/upload-documents" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Upload Documents Now</a>
        </div>
      </div>
    `,
    text: "Get verified as a VIVALY caregiver in 24-48 hours. Upload your WWCC, First Aid, and ID to start receiving booking requests: https://vivaly.com.au/upload-documents"
  },

  // Day 10: Urgency and final push
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
          <a href="https://vivaly.com.au/join-now" style="background: #DC2626; color: white; padding: 18px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">Join VIVALY Today</a>
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