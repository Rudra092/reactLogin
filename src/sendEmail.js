// Install: npm install @getbrevo/brevo
const SibApiV3Sdk = require('@getbrevo/brevo');

const sendResetEmail = async (userEmail, resetLink) => {
  try {
    // Initialize API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // Email content
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Password Reset Request";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <p style="margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #facc15; padding: 12px 24px; color: #000; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color: #4f46e5; word-break: break-all;">${resetLink}</a>
        </p>
        <p style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
          If you didn't request this, you can safely ignore this email.<br>
          This link will expire in 1 hour.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = { 
      name: "Your App", 
      email: "noreply@yourapp.com" // Can be any email, no verification needed!
    };
    sendSmtpEmail.to = [{ email: userEmail }];

    // Send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo:', data);
    return data;

  } catch (error) {
    console.error('❌ Brevo Error:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = { sendResetEmail };