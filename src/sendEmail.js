import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (userEmail, resetLink) => {
  try {
    const data = await resend.emails.send({
      from: 'Your App <no-reply@yourdomain.com>', // You can use your domain or yourname@resend.dev during testing
      to: userEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <p>
            <a href="${resetLink}" 
               style="background: #facc15; padding: 10px 20px; color: #000; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
          </p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    });

    console.log('✅ Password reset email sent via Resend:', data);
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    throw new Error('Email sending failed');
  }
};
