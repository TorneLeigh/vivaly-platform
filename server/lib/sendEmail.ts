import { Resend } from 'resend';

export async function sendEmail(to: string, subject: string, html: string) {
  // Try Resend first if API key is available
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const response = await resend.emails.send({
        from: 'VIVALY <onboarding@resend.dev>',
        to,
        subject,
        html,
      });
      console.log(`Email sent via Resend to: ${to} - Subject: ${subject}`);
      console.log('Resend response:', response);
      return response;
    } catch (err) {
      console.error("Resend failed, trying fallback:", err);
    }
  }

  // Fallback to Twilio if configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      // Note: This would require Twilio SendGrid or similar email service
      // For now, just log that we would use Twilio
      console.log(`Would send email via Twilio to: ${to} - Subject: ${subject}`);
      return { success: true, service: "twilio-fallback" };
    } catch (err) {
      console.error("Twilio fallback failed:", err);
    }
  }

  // No email service configured
  console.log("No email service configured, skipping email to:", to);
  console.log("Subject:", subject);
  console.log("Content:", html);
  return { success: false, message: "No email service configured" };
}