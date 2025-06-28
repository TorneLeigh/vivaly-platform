import { sendEmail } from "./email-service";
import { storage } from "./storage";

export async function sendSignupNotification(userId: string) {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.warn("Signup email: User not found:", userId);
      return;
    }

    const subject = `New ${user.role} signed up: ${user.fullName}`;
    const html = `
      <h3>New ${user.role === "parent" ? "Parent" : "Caregiver"} Registration</h3>
      <p><strong>Name:</strong> ${user.fullName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Signup Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    await sendEmail({
      to: "info@tornevelk.com",
      subject,
      html,
    });

    console.log("Signup notification sent for user:", userId);
  } catch (error) {
    console.error("Failed to send signup notification:", error);
  }
}
