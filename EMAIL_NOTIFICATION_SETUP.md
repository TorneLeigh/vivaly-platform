# Email Notification System Setup

## Current Status
✅ **Email notification system implemented**
✅ **SendGrid API key configured**
❌ **Sender email verification required**

## What's Working
- User registration notifications (parent & caregiver)
- Document submission notifications (police check & WWCC)
- Professional HTML email templates
- Automatic admin alerts to info@tornevelk.com

## Required Action
**You need to verify `info@tornevelk.com` in SendGrid:**

1. Log into your SendGrid account
2. Go to **Settings → Sender Authentication → Single Sender Verification**
3. Add `info@tornevelk.com` as a verified sender
4. Check your email and click the verification link

## Email Notifications You'll Receive

### 1. New User Registration
- **Triggers:** When someone signs up as parent or caregiver
- **Contains:** Name, email, role, registration date
- **Subject:** "New Parent Registration - [Name]" or "New Caregiver Registration - [Name]"

### 2. Police Check Submission
- **Triggers:** When caregiver uploads police clearance document
- **Contains:** Name, email, submission date, document download link
- **Subject:** "Police Clearance Submitted - [Name]"
- **Action Required:** Manual verification and approval

### 3. WWCC Submission
- **Triggers:** When caregiver uploads Working with Children Check
- **Contains:** Name, email, submission date, document download link
- **Subject:** "WWCC (Working with Children Check) Submitted - [Name]"
- **Action Required:** Manual verification and approval

## Test Endpoints
- `POST /api/test-notifications` - Sends all 4 test emails
- `POST /api/upload-document` - Triggers document submission emails

## Once Verification is Complete
The system will automatically start sending professional email notifications for all user activities requiring your attention.

## Email Templates
All emails include:
- Professional HTML formatting
- Clear action items
- User details for easy processing
- Australian date/time formatting
- Vivaly branding