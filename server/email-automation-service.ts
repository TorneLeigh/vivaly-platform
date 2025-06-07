import {
  sendParentWelcomeSequence,
  sendNannyWelcomeSequence,
  sendBookingConfirmation,
  sendBookingReminder,
  sendPostBookingFeedback,
  sendCaregiverPerformanceAlert,
  sendWeeklyNewsletter,
  sendEmergencyContactVerification
} from './email-service';
import { storage } from './storage';

interface EmailTrigger {
  userId: number;
  userEmail: string;
  userName: string;
  userType: 'parent' | 'caregiver';
  triggerType: string;
  data?: any;
}

export class EmailAutomationService {
  private emailQueue: EmailTrigger[] = [];
  private isProcessing = false;

  // Main trigger handler for all email automations
  async triggerEmail(trigger: EmailTrigger) {
    this.emailQueue.push(trigger);
    if (!this.isProcessing) {
      this.processEmailQueue();
    }
  }

  private async processEmailQueue() {
    this.isProcessing = true;
    
    while (this.emailQueue.length > 0) {
      const trigger = this.emailQueue.shift();
      if (trigger) {
        try {
          await this.handleEmailTrigger(trigger);
        } catch (error) {
          console.error('Email automation error:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  private async handleEmailTrigger(trigger: EmailTrigger) {
    switch (trigger.triggerType) {
      case 'user_registration_parent':
        await sendParentWelcomeSequence(trigger.userEmail, trigger.userName);
        break;
        
      case 'user_registration_caregiver':
        await sendNannyWelcomeSequence(trigger.userEmail, trigger.userName);
        break;
        
      case 'booking_confirmed':
        const booking = trigger.data;
        if (booking) {
          // Send to both caregiver and parent
          const caregiver = await storage.getUser(booking.caregiverId);
          const parent = await storage.getUser(booking.parentId);
          
          if (caregiver && parent) {
            await sendBookingConfirmation(caregiver.email, parent.email, booking);
          }
          
          // Schedule reminder emails
          this.scheduleBookingReminders(booking);
        }
        break;
        
      case 'booking_reminder_24h':
        await sendBookingReminder(trigger.userEmail, trigger.data, '24h');
        break;
        
      case 'booking_reminder_2h':
        await sendBookingReminder(trigger.userEmail, trigger.data, '2h');
        break;
        
      case 'booking_completed':
        // Wait 2 hours after completion to send feedback request
        setTimeout(async () => {
          await sendPostBookingFeedback(trigger.userEmail, trigger.userName, trigger.data.bookingId);
        }, 2 * 60 * 60 * 1000);
        break;
        
      case 'caregiver_performance_review':
        const metrics = await this.calculateCaregiverMetrics(trigger.userId);
        await sendCaregiverPerformanceAlert(trigger.userEmail, trigger.userName, metrics);
        break;
        
      case 'weekly_newsletter':
        await sendWeeklyNewsletter(trigger.userEmail, trigger.userName, trigger.userType);
        break;
        
      case 'emergency_contact_verification':
        await sendEmergencyContactVerification(
          trigger.data.contactEmail,
          trigger.data.familyName,
          trigger.userName
        );
        break;
        
      default:
        console.log(`Unknown email trigger type: ${trigger.triggerType}`);
    }
  }

  private scheduleBookingReminders(booking: any) {
    const bookingDate = new Date(booking.date + ' ' + booking.startTime);
    const now = new Date();
    
    // 24-hour reminder
    const reminder24h = new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > now) {
      setTimeout(() => {
        this.triggerEmail({
          userId: booking.parentId,
          userEmail: booking.parentEmail,
          userName: booking.parentName,
          userType: 'parent',
          triggerType: 'booking_reminder_24h',
          data: booking
        });
      }, reminder24h.getTime() - now.getTime());
    }
    
    // 2-hour reminder
    const reminder2h = new Date(bookingDate.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > now) {
      setTimeout(() => {
        this.triggerEmail({
          userId: booking.parentId,
          userEmail: booking.parentEmail,
          userName: booking.parentName,
          userType: 'parent',
          triggerType: 'booking_reminder_2h',
          data: booking
        });
      }, reminder2h.getTime() - now.getTime());
    }
  }

  private async calculateCaregiverMetrics(caregiverId: number) {
    // Get caregiver's reviews and bookings for performance metrics
    const caregiver = await storage.getNanny(caregiverId);
    if (!caregiver) return null;

    const reviews = await storage.getReviewsByNanny(caregiverId);
    const bookings = await storage.getBookingsByNanny(caregiverId);
    
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    const totalBookings = bookings.length;
    const currentMonth = new Date().getMonth();
    const monthlyBookings = bookings.filter(booking => 
      new Date(booking.date).getMonth() === currentMonth
    ).length;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      responseRate: 85, // Mock data - would be calculated from message response times
      bookingSuccessRate: 92, // Mock data - would be calculated from booking acceptance rates
      monthlyBookings,
      totalBookings
    };
  }

  // Helper methods for common triggers
  async onUserRegistration(userEmail: string, userName: string, userType: 'parent' | 'caregiver', userId: number) {
    await this.triggerEmail({
      userId,
      userEmail,
      userName,
      userType,
      triggerType: `user_registration_${userType}`
    });
  }

  async onBookingConfirmed(booking: any) {
    await this.triggerEmail({
      userId: booking.parentId,
      userEmail: booking.parentEmail,
      userName: booking.parentName,
      userType: 'parent',
      triggerType: 'booking_confirmed',
      data: booking
    });
  }

  async onBookingCompleted(booking: any) {
    // Send feedback request to parent
    await this.triggerEmail({
      userId: booking.parentId,
      userEmail: booking.parentEmail,
      userName: booking.parentName,
      userType: 'parent',
      triggerType: 'booking_completed',
      data: booking
    });
  }

  async scheduleWeeklyNewsletters() {
    // DISABLED: Weekly newsletters are not being sent
    console.log('Weekly newsletters are disabled');
    return;
  }

  async performanceReviewCheck(caregiverId: number) {
    const caregiver = await storage.getNanny(caregiverId);
    if (!caregiver) return;

    const user = await storage.getUser(caregiver.userId);
    if (!user) return;

    await this.triggerEmail({
      userId: caregiver.userId,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      userType: 'caregiver',
      triggerType: 'caregiver_performance_review'
    });
  }
}

export const emailAutomationService = new EmailAutomationService();