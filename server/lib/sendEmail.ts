import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, html: string) {
  // Try SendGrid first if API key is available (Twilio SendGrid)
  if (process.env.SENDGRID_API_KEY) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to,
        from: 'VIVALY <no-reply@vivaly.com.au>',
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
        from: 'VIVALY <no-reply@vivaly.com.au>',
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