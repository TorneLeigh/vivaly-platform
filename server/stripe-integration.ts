import type { Express } from "express";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { requireAuth } from "./auth-middleware";

// Only initialize Stripe if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

const PLATFORM_FEE_PERCENTAGE = 0.10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(startDate: string, endDate: string): number {
  const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function registerStripeRoutes(app: Express) {
  // Create booking with payment calculation
  app.post('/api/bookings/create', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }
      const { parentId, caregiverId, jobId, startDate, endDate, ratePerHour, hoursPerDay, notes } = req.body;
      
      if (!parentId || !caregiverId || !startDate || !endDate || !ratePerHour || !hoursPerDay) {
        return res.status(400).json({ error: 'Missing required booking information' });
      }

      const days = daysBetween(startDate, endDate);
      const totalAmount = ratePerHour * hoursPerDay * days;
      const serviceFee = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
      const caregiverAmount = totalAmount - serviceFee;

      const booking = {
        id: randomUUID(),
        parentId,
        caregiverId,
        jobId: jobId || null,
        startDate,
        endDate,
        ratePerHour: parseFloat(ratePerHour),
        hoursPerDay: parseInt(hoursPerDay),
        totalAmount,
        serviceFee,
        caregiverAmount,
        status: 'pending',
        paymentStatus: 'unpaid',
        personalDetailsVisible: false,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save booking to storage
      await storage.createBooking(booking);

      res.json({ success: true, booking });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  // Accept booking (caregiver confirms availability)
  app.post('/api/bookings/:id/accept', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.caregiverId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to accept this booking' });
      }

      booking.status = 'confirmed';
      booking.updatedAt = new Date().toISOString();
      
      await storage.updateBooking(id, booking);
      res.json({ success: true, booking });
    } catch (error) {
      console.error('Accept booking error:', error);
      res.status(500).json({ error: 'Failed to accept booking' });
    }
  });

  // Decline booking
  app.post('/api/bookings/:id/decline', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.caregiverId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to decline this booking' });
      }

      booking.status = 'declined';
      booking.updatedAt = new Date().toISOString();
      
      await storage.updateBooking(id, booking);
      res.json({ success: true, booking });
    } catch (error) {
      console.error('Decline booking error:', error);
      res.status(500).json({ error: 'Failed to decline booking' });
    }
  });

  // Create Stripe checkout session
  app.post('/api/bookings/:id/checkout', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.parentId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to pay for this booking' });
      }

      if (booking.status !== 'confirmed') {
        return res.status(400).json({ error: 'Booking must be confirmed before payment' });
      }

      const amountInCents = Math.round(booking.totalAmount * 100);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: req.user.email,
        line_items: [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: 'VIVALY Childcare Booking',
                description: `Booking from ${booking.startDate} to ${booking.endDate}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://vivaly.com.au'}/booking-confirmation?booking_id=${booking.id}`,
        cancel_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://vivaly.com.au'}/bookings`,
        metadata: {
          bookingId: booking.id,
          parentId: booking.parentId,
          caregiverId: booking.caregiverId,
        },
      });

      // Update booking status
      booking.paymentStatus = 'payment_initiated';
      booking.stripeSessionId = session.id;
      booking.updatedAt = new Date().toISOString();
      
      await storage.updateBooking(id, booking);

      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error('Create checkout session error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Stripe webhook for payment confirmation
  app.post('/api/webhooks/stripe', async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({ error: 'Webhook processing unavailable' });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const bookingId = session.metadata?.bookingId;
          
          if (bookingId) {
            const booking = await storage.getBooking(bookingId);
            if (booking) {
              booking.paymentStatus = 'paid_unreleased';
              booking.stripePaymentIntentId = session.payment_intent as string;
              booking.updatedAt = new Date().toISOString();
              
              await storage.updateBooking(bookingId, booking);
              console.log(`Payment confirmed for booking ${bookingId}`);
            }
          }
          break;

        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.object.id);
          break;

        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  });

  // Admin route to automatically release payments (24 hours after job completion)
  app.post('/api/admin/auto-release-payments', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }

      const now = new Date();
      const bookings = await storage.getAllBookings();
      let updated = 0;
      let errors = 0;

      for (const booking of bookings) {
        const endDate = new Date(booking.endDate);
        const releaseTime = new Date(endDate.getTime() + ONE_DAY_MS);

        if (
          booking.status === 'completed' && 
          booking.paymentStatus === 'paid_unreleased' && 
          now > releaseTime
        ) {
          try {
            // Get caregiver's Connect account
            const caregiver = await storage.getUser(booking.caregiverId);
            if (!caregiver?.stripeConnectAccountId) {
              console.error(`Caregiver ${booking.caregiverId} has no Connect account for booking ${booking.id}`);
              errors++;
              continue;
            }

            // Calculate transfer amount (subtract platform fee)
            const transferAmount = Math.round(booking.caregiverAmount * 100); // Convert to cents

            // Create transfer to caregiver
            const transfer = await stripe.transfers.create({
              amount: transferAmount,
              currency: 'aud',
              destination: caregiver.stripeConnectAccountId,
              metadata: {
                bookingId: booking.id,
                caregiverId: booking.caregiverId.toString(),
                autoRelease: 'true'
              }
            });

            // Update booking status
            booking.paymentStatus = 'released';
            booking.transferId = transfer.id;
            booking.personalDetailsVisible = true;
            booking.updatedAt = new Date().toISOString();
            
            await storage.updateBooking(booking.id, booking);
            updated++;
            
            console.log(`Auto-released payment for booking ${booking.id}, transfer: ${transfer.id}`);
          } catch (error) {
            console.error(`Failed to auto-release payment for booking ${booking.id}:`, error);
            errors++;
          }
        }
      }

      res.json({ 
        success: true, 
        updated, 
        errors,
        message: `Auto-released ${updated} payments. ${errors} errors.` 
      });
    } catch (error) {
      console.error('Auto-release payments error:', error);
      res.status(500).json({ error: 'Failed to auto-release payments' });
    }
  });

  // Get booking details
  app.get('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if user is authorized to view this booking
      if (booking.parentId !== req.user.id && booking.caregiverId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ error: 'Failed to get booking' });
    }
  });

  // Mark booking as completed
  app.post('/api/bookings/:id/complete', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Only parent can mark as completed
      if (booking.parentId !== req.user.id) {
        return res.status(403).json({ error: 'Only the parent can mark booking as completed' });
      }

      booking.status = 'completed';
      booking.completedAt = new Date().toISOString();
      booking.updatedAt = new Date().toISOString();
      
      await storage.updateBooking(id, booking);
      res.json({ success: true, booking });
    } catch (error) {
      console.error('Complete booking error:', error);
      res.status(500).json({ error: 'Failed to complete booking' });
    }
  });

  // Create Payment Intent endpoint for test payments
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }

      const { amount, bookingId } = req.body;

      if (!amount || amount < 50) { // Minimum 50 cents
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in cents
        currency: 'aud',
        metadata: {
          bookingId: bookingId || 'test-booking',
          userId: req.user.id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ error: error.message || 'Failed to create payment intent' });
    }
  });

  // Stripe Connect routes for caregiver payouts
  app.post('/api/stripe/connect/create-account', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }

      const { firstName, lastName, email, dateOfBirth, address, bankAccount } = req.body;

      // Create Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'AU',
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        individual: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          dob: {
            day: parseInt(dateOfBirth.split('-')[2]),
            month: parseInt(dateOfBirth.split('-')[1]),
            year: parseInt(dateOfBirth.split('-')[0])
          },
          address: {
            line1: address.line1,
            city: address.city,
            state: address.state,
            postal_code: address.postcode,
            country: 'AU'
          }
        },
        external_account: {
          object: 'bank_account',
          country: 'AU',
          currency: 'aud',
          account_holder_name: bankAccount.accountHolderName,
          routing_number: bankAccount.bsb.replace('-', ''),
          account_number: bankAccount.accountNumber
        }
      });

      // Create account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${req.headers.origin}/caregiver-connect?refresh=${account.id}`,
        return_url: `${req.headers.origin}/caregiver-connect?success=${account.id}`,
        type: 'account_onboarding',
      });

      // Store account ID with user
      await storage.updateUser(req.user.id, {
        stripeConnectAccountId: account.id
      });

      res.json({ 
        accountId: account.id,
        accountLink: accountLink.url 
      });
    } catch (error: any) {
      console.error('Create Connect account error:', error);
      res.status(500).json({ error: error.message || 'Failed to create Connect account' });
    }
  });

  // Check Connect account status
  app.get('/api/stripe/connect/status', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeConnectAccountId) {
        return res.json({ status: 'not_connected' });
      }

      const account = await stripe.accounts.retrieve(user.stripeConnectAccountId);
      
      res.json({
        status: account.charges_enabled ? 'connected' : 'pending',
        accountId: account.id,
        requirements: account.requirements
      });
    } catch (error: any) {
      console.error('Check Connect status error:', error);
      res.status(500).json({ error: error.message || 'Failed to check Connect status' });
    }
  });

  // Transfer payment to caregiver (called after 24h hold)
  app.post('/api/stripe/transfer-to-caregiver', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing temporarily unavailable' });
      }

      const { bookingId } = req.body;
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.paymentStatus !== 'paid_unreleased') {
        return res.status(400).json({ error: 'Payment not eligible for release' });
      }

      // Get caregiver's Connect account
      const caregiver = await storage.getUser(booking.caregiverId);
      if (!caregiver?.stripeConnectAccountId) {
        return res.status(400).json({ error: 'Caregiver payout account not configured' });
      }

      // Calculate transfer amount (subtract platform fee)
      const transferAmount = Math.round(booking.caregiverAmount * 100); // Convert to cents

      // Create transfer to caregiver
      const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: 'aud',
        destination: caregiver.stripeConnectAccountId,
        metadata: {
          bookingId: bookingId,
          caregiverId: booking.caregiverId.toString()
        }
      });

      // Update booking status
      booking.paymentStatus = 'released';
      booking.transferId = transfer.id;
      booking.updatedAt = new Date().toISOString();
      
      await storage.updateBooking(bookingId, booking);

      res.json({ 
        success: true, 
        transferId: transfer.id,
        amount: transferAmount / 100 
      });
    } catch (error: any) {
      console.error('Transfer to caregiver error:', error);
      res.status(500).json({ error: error.message || 'Failed to transfer payment' });
    }
  });
}