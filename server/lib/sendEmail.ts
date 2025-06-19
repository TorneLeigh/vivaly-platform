import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

// Owner email for notifications
const OWNER_EMAIL = process.env.OWNER_EMAIL;

export async function sendEmail(to: string, subject: string, html: string) {
  // Try SendGrid first if API key is available (Twilio SendGrid)
  if (process.env.SENDGRID_API_KEY) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to,
        from: 'VIVALY <tornevelk1@gmail.com>',
        subject,
        html,
      };
      const response = await sgMail.send(msg);
      console.log(`Email sent via SendGrid to: ${to} - Subject: ${subject}`);
      console.log('SendGrid response:', response[0].statusCode);
      return response;
    } catch (err) {
      console.error("SendGrid failed, trying Resend fallback:", err);
    }
  }

  // Fallback to Resend if SendGrid fails
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const response = await resend.emails.send({
        from: 'VIVALY <tornevelk1@gmail.com>',
        to,
        subject,
        html,
      });
      console.log(`Email sent via Resend to: ${to} - Subject: ${subject}`);
      console.log('Resend response:', response);
      return response;
    } catch (err) {
      console.error("Resend failed:", err);
    }
  }

  // No email service configured
  console.log("No email service configured, skipping email to:", to);
  console.log("Subject:", subject);
  console.log("Content:", html);
  return { success: false, message: "No email service configured" };
}

// Convenience function to notify owner
export async function notifyOwner(subject: string, html: string) {
  if (!OWNER_EMAIL) return;
  try {
    await sendEmail(OWNER_EMAIL, subject, html);
    console.log(`Owner notification sent: ${subject}`);
  } catch (err) {
    console.error("Failed to notify owner:", err);
  }
}