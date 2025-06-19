import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'tornevelk1@gmail.com',
  from: 'tornevelk1@gmail.com',
  subject: 'Direct SendGrid Test - Vivaly Platform',
  text: 'This is a direct test to verify SendGrid email delivery.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Direct SendGrid Test</h2>
      <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-AU', { 
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p>This email is sent directly through SendGrid to test delivery.</p>
      <p>If you receive this, check your inbox and spam folder for the other notification emails.</p>
    </div>
  `,
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('✅ Email sent successfully!');
    console.log('Response status:', response[0].statusCode);
    console.log('Message ID:', response[0].headers['x-message-id']);
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
  });