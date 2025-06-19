import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'tornevelk1@gmail.com',
  from: 'tornevelk1@gmail.com', // Use your verified sender
  subject: 'Test Email from Vivaly Platform',
  text: 'This is a simple test email to verify SendGrid delivery.',
  html: '<p>This is a simple test email to verify SendGrid delivery.</p>',
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('Email sent successfully!');
    console.log('Response status:', response[0].statusCode);
    console.log('Response headers:', response[0].headers);
  })
  .catch((error) => {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error body:', error.response.body);
    }
  });