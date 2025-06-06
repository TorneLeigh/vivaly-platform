# VIVALY SMS Automation Strategy

## SMS Communication Framework

### Core Messaging Principles
- **Immediate Value**: Every SMS provides actionable information
- **Concise Content**: Maximum 160 characters for optimal delivery
- **Clear CTAs**: Simple next steps for recipients
- **Compliance**: Opt-out options and privacy compliance
- **Timing**: Sent during appropriate hours (8AM-8PM local time)

## Automated SMS Workflows

### 1. User Onboarding
**Trial Signup Welcome**
- Trigger: Trial form submission
- Timing: Immediate
- Content: "Hi [Name]! Welcome to VIVALY trial. You now have priority access to verified caregivers in your area. Check your email for next steps!"

**Profile Completion Reminder**
- Trigger: 24 hours after signup, profile incomplete
- Content: "Complete your VIVALY profile to start connecting with local families/caregivers: vivaly.com.au/profile"

### 2. Booking Lifecycle
**Booking Confirmation (Parent)**
- Trigger: Successful booking creation
- Content: "VIVALY: Booking confirmed! [Caregiver] will provide care on [Date] at [Time]. Total: $[Amount]. Questions? Reply HELP"

**Booking Alert (Caregiver)**
- Trigger: New booking request
- Content: "VIVALY: New booking request from [Parent] for [Date] at [Time]. Login to accept or decline. Reply STOP to opt out"

**Payment Confirmation**
- Trigger: Successful payment processing
- Content: "VIVALY: Payment of $[Amount] confirmed for booking #[ID]. Thank you for using VIVALY!"

### 3. Reminders & Notifications
**24-Hour Booking Reminder**
- Trigger: 24 hours before booking
- Content: "VIVALY reminder: Your booking with [Caregiver] is tomorrow at [Time]. Address: [Location]"

**2-Hour Booking Reminder**
- Trigger: 2 hours before booking
- Content: "VIVALY reminder: Your booking with [Caregiver] is in 2 hours at [Time]. Address: [Location]"

### 4. Emergency & Safety
**Emergency Alert**
- Trigger: Emergency reported through app
- Content: "VIVALY EMERGENCY: [Type] reported at [Address]. Emergency services contacted. Caregiver: [Name]"

**Safety Check-in**
- Trigger: During extended bookings (4+ hours)
- Content: "VIVALY safety check: Is everything going well with your booking? Reply YES or call us if you need assistance."

### 5. Verification & Security
**Phone Verification**
- Trigger: Phone verification request
- Content: "VIVALY verification code: [CODE]. This code expires in 10 minutes. Do not share with anyone."

**Login Security Alert**
- Trigger: Login from new device
- Content: "VIVALY: New login detected on your account. If this wasn't you, secure your account immediately: vivaly.com.au/security"

## SMS Scheduling Rules

### Timing Guidelines
- **Immediate**: Confirmations, emergency alerts, verification codes
- **24 Hours**: Booking reminders, profile completion
- **Business Hours**: Non-urgent notifications (8AM-6PM)
- **Emergency Only**: After 8PM or before 8AM

### Frequency Limits
- **Maximum**: 3 SMS per user per day (excluding emergencies)
- **Booking Day**: Up to 5 SMS (confirmation, reminders, updates)
- **Trial Period**: Maximum 1 SMS per week (marketing)
- **Opt-out Respect**: Immediate removal from all non-emergency lists

## Message Templates by Category

### Booking Management
```
Confirmation: "VIVALY: Booking confirmed! [Name] will provide care on [Date] at [Time]. Total: $[Amount]. Questions? Reply HELP"

Cancellation: "VIVALY: Booking cancelled for [Date] at [Time]. [Reason] Any charges will be refunded within 3-5 business days."

Rescheduled: "VIVALY: Booking moved from [OldDate] to [NewDate] at [Time]. [Caregiver] confirmed. Updated details in app."
```

### Payment & Billing
```
Payment Success: "VIVALY: Payment of $[Amount] confirmed for booking #[ID]. Thank you for using VIVALY!"

Payment Failed: "VIVALY: Payment failed for booking #[ID]. Please update your payment method to avoid cancellation."

Refund Processed: "VIVALY: Refund of $[Amount] processed for booking #[ID]. Expect 3-5 business days for bank processing."
```

### Safety & Emergency
```
Emergency Alert: "VIVALY EMERGENCY: [Type] reported at [Address]. Emergency services contacted. Caregiver: [Name]"

Safety Check: "VIVALY safety check: Is everything going well with your booking? Reply YES or call us if you need assistance."

Incident Report: "VIVALY: Incident reported for booking #[ID]. Our team is investigating. You'll receive updates within 2 hours."
```

### Account & Security
```
Verification: "VIVALY verification code: [CODE]. This code expires in 10 minutes. Do not share with anyone."

Security Alert: "VIVALY: New login detected on your account. If this wasn't you, secure your account: vivaly.com.au/security"

Password Reset: "VIVALY: Password reset requested. Click here to reset: [LINK] (expires in 15 minutes)"
```

## Compliance & Opt-out Management

### Australian SMS Regulations
- **Sender ID**: "VIVALY" (registered short code)
- **Opt-out Instructions**: "Reply STOP to opt out" in promotional messages
- **Privacy Compliance**: ACMA and Privacy Act compliance
- **Do Not Call Register**: Exempt for existing customer relationships

### Opt-out Handling
```
Standard Opt-out: "You've unsubscribed from VIVALY SMS notifications. You'll still receive booking confirmations and safety alerts. Manage preferences: vivaly.com.au/settings"

Complete Opt-out: "You've unsubscribed from all VIVALY SMS. Emergency alerts may still be sent for safety. Contact support to re-enable."
```

### Message Categories
1. **Transactional** (Cannot opt-out): Booking confirmations, payment receipts, safety alerts
2. **Operational** (Limited opt-out): Reminders, updates, security notifications  
3. **Marketing** (Full opt-out): Promotional messages, feature announcements, surveys

## Analytics & Optimization

### Key Metrics
- **Delivery Rate**: Target >98%
- **Open Rate**: Target >95% (immediate read)
- **Response Rate**: Measure for two-way SMS
- **Opt-out Rate**: Target <1% monthly
- **Customer Satisfaction**: SMS experience rating

### A/B Testing Framework
- **Message Length**: 80 vs 160 characters
- **Call-to-Action**: Different wording and urgency
- **Timing**: Optimal send times by user segment
- **Personalization**: First name vs no personalization

### Continuous Improvement
- **Weekly Reviews**: Delivery rates and user feedback
- **Monthly Analysis**: Opt-out trends and message performance
- **Quarterly Updates**: Template optimization and new automation
- **Annual Audit**: Compliance review and strategy refinement

## Technical Implementation

### SMS Service Integration
- **Primary**: Twilio (implemented)
- **Backup**: MessageMedia or Clicksend
- **Delivery Tracking**: Webhook confirmation
- **Failure Handling**: Automatic retry with exponential backoff

### Data Management
- **Phone Validation**: Australian number format checking
- **Deduplication**: Prevent duplicate messages
- **Rate Limiting**: Respect carrier guidelines
- **Audit Trail**: Complete SMS history for compliance

### Security Measures
- **Code Generation**: Cryptographically secure random codes
- **Expiration**: Time-limited verification codes
- **Rate Limiting**: Prevent SMS bombing attacks
- **Logging**: Security events and access patterns

This comprehensive SMS strategy ensures VIVALY provides timely, relevant, and compliant text messaging that enhances user experience while maintaining safety and security standards.