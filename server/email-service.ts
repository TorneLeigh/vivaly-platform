import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY provided. Email not sent.");
    return;
  }

  try {
    const response = await resend.emails.send({
      from: "VIVALY <info@tornevelk.com>",
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("Email error:", response.error);
    } else {
      console.log("Email sent to", to);
    }
  } catch (error) {
    console.error("Email send failed:", error);
  }
}
