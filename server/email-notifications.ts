import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const OWNER_EMAIL = 'tornevelk1@gmail.com';
const FROM_EMAIL = 'tornevelk1@gmail.com';

interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registrationDate: Date;
}

interface DocumentSubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: 'police_check' | 'wwcc';
  submissionDate: Date;
  documentUrl?: string;
}

interface JobPostingData {
  parentName: string;
  parentEmail: string;
  jobTitle: string;
  location: string;
  rate: string;
  description: string;
  postingDate: Date;
}

interface JobApplicationData {
  caregiverName: string;
  caregiverEmail: string;
  parentName: string;
  jobTitle: string;
  applicationDate: Date;
}

interface MessageData {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  messagePreview: string;
  sentDate: Date;
}

interface BookingData {
  parentName: string;
  caregiverName: string;
  jobTitle: string;
  bookingDate: Date;
  status: string;
}

export async function sendUserRegistrationNotification(userData: UserRegistrationData) {
  const subject = `New ${userData.role} Registration - ${userData.firstName} ${userData.lastName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New User Registration</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">User Details</h3>
        <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Role:</strong> ${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>
        <p><strong>Registration Date:</strong> ${userData.registrationDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
      </div>
      
      <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
        <p style="margin: 0; color: #065f46;">
          <strong>Action Required:</strong> New user has joined the platform and may require approval or welcome contact.
        </p>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        This notification was automatically sent from Vivaly platform.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Registration notification sent for ${userData.firstName} ${userData.lastName}`);
  } catch (error: any) {
    console.error('Failed to send registration notification:', error);
    console.error('SendGrid error details:', error.response?.body);
    throw error;
  }
}

export async function sendDocumentSubmissionNotification(docData: DocumentSubmissionData) {
  const documentTypeName = docData.documentType === 'police_check' ? 'Police Clearance' : 'WWCC (Working with Children Check)';
  const subject = `${documentTypeName} Submitted - ${docData.firstName} ${docData.lastName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Document Verification Required</h2>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #991b1b;">Manual Processing Required</h3>
        <p><strong>Document Type:</strong> ${documentTypeName}</p>
        <p><strong>Submitted by:</strong> ${docData.firstName} ${docData.lastName}</p>
        <p><strong>Email:</strong> ${docData.email}</p>
        <p><strong>Submission Date:</strong> ${docData.submissionDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
        ${docData.documentUrl ? `<p><strong>Document URL:</strong> <a href="${docData.documentUrl}" style="color: #dc2626;">${docData.documentUrl}</a></p>` : ''}
      </div>
      
      <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e;">
          <strong>Action Required:</strong> Please manually verify this ${documentTypeName.toLowerCase()} and update the user's verification status in the admin panel.
        </p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #374151;">Next Steps:</h4>
        <ol style="color: #4b5563;">
          <li>Download and review the submitted document</li>
          <li>Verify authenticity and validity</li>
          <li>Update user verification status in admin panel</li>
          <li>Send confirmation email to user if approved</li>
        </ol>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        This notification was automatically sent from Vivaly platform.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Document submission notification sent for ${documentTypeName} by ${docData.firstName} ${docData.lastName}`);
  } catch (error) {
    console.error('Failed to send document submission notification:', error);
    throw error;
  }
}

export async function sendJobPostingNotification(jobData: JobPostingData) {
  const subject = `New Job Posted - ${jobData.jobTitle}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">New Job Posting</h2>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
        <h3 style="margin-top: 0; color: #065f46;">Job Details</h3>
        <p><strong>Title:</strong> ${jobData.jobTitle}</p>
        <p><strong>Posted by:</strong> ${jobData.parentName}</p>
        <p><strong>Email:</strong> ${jobData.parentEmail}</p>
        <p><strong>Location:</strong> ${jobData.location}</p>
        <p><strong>Rate:</strong> ${jobData.rate}</p>
        <p><strong>Posted:</strong> ${jobData.postingDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
      </div>
      
      <div style="background-color: #fafafa; padding: 15px; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #374151;">Description:</h4>
        <p style="color: #4b5563;">${jobData.description}</p>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        New job opportunity posted on Vivaly platform.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Job posting notification sent for ${jobData.jobTitle}`);
  } catch (error: any) {
    console.error('Failed to send job posting notification:', error);
    throw error;
  }
}

export async function sendJobApplicationNotification(appData: JobApplicationData) {
  const subject = `New Job Application - ${appData.caregiverName} applied to ${appData.jobTitle}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Job Application</h2>
      
      <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
        <h3 style="margin-top: 0; color: #581c87;">Application Details</h3>
        <p><strong>Caregiver:</strong> ${appData.caregiverName}</p>
        <p><strong>Email:</strong> ${appData.caregiverEmail}</p>
        <p><strong>Applied to:</strong> ${appData.jobTitle}</p>
        <p><strong>Parent:</strong> ${appData.parentName}</p>
        <p><strong>Application Date:</strong> ${appData.applicationDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 0; color: #1e40af;">
          <strong>Platform Activity:</strong> A caregiver has applied for a job posting. Both parties can now communicate through the platform messaging system.
        </p>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        Job application submitted on Vivaly platform.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Job application notification sent for ${appData.caregiverName}`);
  } catch (error: any) {
    console.error('Failed to send job application notification:', error);
    throw error;
  }
}

export async function sendMessageNotification(msgData: MessageData) {
  const subject = `New Message: ${msgData.senderName} → ${msgData.recipientName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0891b2;">New Platform Message</h2>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2;">
        <h3 style="margin-top: 0; color: #0c4a6e;">Message Details</h3>
        <p><strong>From:</strong> ${msgData.senderName} (${msgData.senderEmail})</p>
        <p><strong>To:</strong> ${msgData.recipientName}</p>
        <p><strong>Sent:</strong> ${msgData.sentDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
      </div>
      
      <div style="background-color: #fafafa; padding: 15px; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #374151;">Message Preview:</h4>
        <p style="color: #4b5563; font-style: italic;">"${msgData.messagePreview}"</p>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        Message sent through Vivaly platform messaging system.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Message notification sent for ${msgData.senderName} → ${msgData.recipientName}`);
  } catch (error: any) {
    console.error('Failed to send message notification:', error);
    throw error;
  }
}

export async function sendBookingNotification(bookingData: BookingData) {
  const subject = `Booking Update - ${bookingData.parentName} & ${bookingData.caregiverName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ea580c;">Booking Activity</h2>
      
      <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
        <h3 style="margin-top: 0; color: #9a3412;">Booking Details</h3>
        <p><strong>Parent:</strong> ${bookingData.parentName}</p>
        <p><strong>Caregiver:</strong> ${bookingData.caregiverName}</p>
        <p><strong>Job:</strong> ${bookingData.jobTitle}</p>
        <p><strong>Status:</strong> ${bookingData.status}</p>
        <p><strong>Date:</strong> ${bookingData.bookingDate.toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Australia/Sydney'
        })}</p>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e;">
          <strong>Revenue Opportunity:</strong> Booking activity indicates potential platform transaction and commission revenue.
        </p>
      </div>
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        Booking activity on Vivaly platform.
      </p>
    </div>
  `;

  const msg = {
    to: OWNER_EMAIL,
    from: FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Booking notification sent for ${bookingData.parentName} & ${bookingData.caregiverName}`);
  } catch (error: any) {
    console.error('Failed to send booking notification:', error);
    throw error;
  }
}

export async function sendTestEmails() {
  console.log('Sending test emails...');
  
  // Test user registration notification
  const testParentData: UserRegistrationData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    role: 'parent',
    registrationDate: new Date()
  };
  
  const testCaregiverData: UserRegistrationData = {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@example.com',
    role: 'caregiver',
    registrationDate: new Date()
  };
  
  // Test document submission notifications
  const testPoliceCheckData: DocumentSubmissionData = {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@example.com',
    documentType: 'police_check',
    submissionDate: new Date(),
    documentUrl: 'https://vivaly.app/uploads/police-check-123.pdf'
  };
  
  const testWWCCData: DocumentSubmissionData = {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@example.com',
    documentType: 'wwcc',
    submissionDate: new Date(),
    documentUrl: 'https://vivaly.app/uploads/wwcc-456.pdf'
  };
  
  try {
    await sendUserRegistrationNotification(testParentData);
    console.log('✅ Parent registration test email sent');
    
    await sendUserRegistrationNotification(testCaregiverData);
    console.log('✅ Caregiver registration test email sent');
    
    await sendDocumentSubmissionNotification(testPoliceCheckData);
    console.log('✅ Police check submission test email sent');
    
    await sendDocumentSubmissionNotification(testWWCCData);
    console.log('✅ WWCC submission test email sent');
    
    // Test additional platform activities
    await sendJobPostingNotification({
      parentName: 'Sarah Johnson',
      parentEmail: 'sarah.johnson@example.com',
      jobTitle: 'Weekend Babysitter Needed in Sydney',
      location: 'Bondi, NSW',
      rate: '$25/hour',
      description: 'Looking for experienced babysitter for 2 children...',
      postingDate: new Date()
    });
    console.log('✅ Job posting test email sent');
    
    await sendJobApplicationNotification({
      caregiverName: 'Emma Thompson',
      caregiverEmail: 'emma.thompson@example.com',
      parentName: 'Sarah Johnson',
      jobTitle: 'Weekend Babysitter Needed in Sydney',
      applicationDate: new Date()
    });
    console.log('✅ Job application test email sent');
    
    return { success: true, message: 'All platform activity test emails sent successfully' };
  } catch (error) {
    console.error('Failed to send test emails:', error);
    throw error;
  }
}