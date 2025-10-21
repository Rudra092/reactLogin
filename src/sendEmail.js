const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetEmail = async (userEmail, resetLink) => {
  try {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <p>
            <a href="${resetLink}" 
               style="background: #facc15; padding: 10px 20px; color: #000; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #4f46e5;">${resetLink}</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('✅ Password reset email sent via SendGrid');
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    if (error.response) {
      console.error('SendGrid Error:', error.response.body);
    }
    throw new Error('Email sending failed');
  }
};

module.exports = { sendResetEmail };