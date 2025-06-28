import { db } from "./db";
import { users, bookings, parentProfiles, nannies } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "./email-service";

export async function sendAdminNewUserAlert(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return;

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  await sendEmail({
    to: "info@tornevelk.com",
    subject: "New Vivaly User Signup",
    html: `
      <p>A new user has signed up on VIVALY:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Type:</strong> ${user.isNanny ? "Caregiver" : "Parent"}</li>
      </ul>
    `,
  });
}

export async function sendAdminWWCCAlert(nannyId: string) {
  const [nanny] = await db.select().from(nannies).where(eq(nannies.userId, nannyId));
  if (!nanny) return;

  const [user] = await db.select().from(users).where(eq(users.id, nannyId));
  if (!user) return;

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  await sendEmail({
    to: "info@tornevelk.com",
    subject: "WWCC Uploaded",
    html: `
      <p>A caregiver has uploaded their WWCC document:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
      </ul>
    `,
  });
}

export async function sendAdminIntroVideoAlert(nannyId: string) {
  const [nanny] = await db.select().from(nannies).where(eq(nannies.userId, nannyId));
  if (!nanny) return;

  const [user] = await db.select().from(users).where(eq(users.id, nannyId));
  if (!user) return;

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  await sendEmail({
    to: "info@tornevelk.com",
    subject: "Intro Video Uploaded",
    html: `
      <p>A caregiver has uploaded their intro video:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
      </ul>
    `,
  });
}
