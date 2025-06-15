import { Resend } from 'resend';

export async function sendEmail(to: string, subject: string, html: string) {
  // Skip email sending if no API key is provided
  if (!process.env.RESEND_API_KEY) {
    console.log("Email service not configured, skipping email to:", to);
    return { success: false, message: "Email service not configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: 'VIVALY <no-reply@vivaly.com>',
      to,
      subject,
      html,
    });
    return response;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
}