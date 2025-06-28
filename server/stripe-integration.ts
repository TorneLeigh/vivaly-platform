import Stripe from "stripe";
import { Request, Response } from "express";
import { Booking, InsertBooking } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function createCheckoutSession(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    caregiverId,
    jobId,
    startDate,
    endDate,
    ratePerHour,
    hoursPerDay,
  } = req.body;

  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const totalAmount = ratePerHour * hoursPerDay * days;
  const serviceFee = totalAmount * 0.1;
  const amountWithFee = totalAmount + serviceFee;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: `Caregiver Booking - ${days} days`,
          },
          unit_amount: Math.round(amountWithFee * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata: {
      parentId: req.user.id,
      caregiverId,
      jobId,
      startDate,
      endDate,
      totalAmount,
      serviceFee,
      ratePerHour,
      hoursPerDay,
    },
  });

  res.json({ url: session.url });
}

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata;

    const booking: InsertBooking = {
      id: uuidv4(),
      parentId: meta.parentId,
      caregiverId: meta.caregiverId,
      jobId: meta.jobId,
      startDate: meta.startDate,
      endDate: meta.endDate,
      ratePerHour: Number(meta.ratePerHour),
      hoursPerDay: Number(meta.hoursPerDay),
      totalAmount: Number(meta.totalAmount),
      serviceFee: Number(meta.serviceFee),
      stripeSessionId: session.id,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // You can insert the booking into your DB here if needed
    console.log("✅ Booking created:", booking);
  }

  res.json({ received: true });
}
