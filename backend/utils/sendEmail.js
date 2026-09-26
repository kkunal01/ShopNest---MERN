const emailjs = require('@emailjs/nodejs');

const sendEmail = async ({ email, subject, message }) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: email,       // The customer's email address
        subject: subject,      // The email subject
        message: message,      // The HTML or text message body
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    // EmailJS errors are sometimes returned as objects, so we handle both
    const errorMessage = error.text || error.message || error;
    console.error(`Failed to send email to ${email}: ${errorMessage}`);
  }
};

module.exports = sendEmail;