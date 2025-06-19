import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const OWNER_EMAIL = 'info@tornevelk.com';
const FROM_EMAIL = 'info@tornevelk.com'; // Use verified sender

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
    
    return { success: true, message: 'All test emails sent successfully' };
  } catch (error) {
    console.error('Failed to send test emails:', error);
    throw error;
  }
}