import nodemailer from 'nodemailer';

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
  userName?: string;
}

/**
 * Sends a password reset email using Nodemailer if SMTP credentials
 * are configured in environment variables, or logs the reset link to
 * the console during development.
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
  userName = 'Player',
}: SendPasswordResetEmailParams): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || '"Nexus Chess" <no-reply@nexuschess.com>';

  const htmlContent = `
    <div style="background-color: #0b0e17; color: #f8fafc; font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 520px; margin: 0 auto; background: #131722; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <h1 style="color: #00f5ff; font-size: 24px; margin-bottom: 8px; letter-spacing: 2px;">NEXUS CHESS</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">Password Reset Request</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; text-align: left;">
          Hello <strong>${userName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; text-align: left;">
          We received a request to reset your Nexus Chess account password. Click the button below to choose a new password. This link will expire in <strong>15 minutes</strong>.
        </p>
        
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #00f5ff 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5; text-align: left;">
          If the button above does not work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #00f5ff; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
        
        <p style="font-size: 12px; color: #475569; text-align: left;">
          If you did not request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </div>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject: 'Reset your Nexus Chess password',
        html: htmlContent,
      });

      console.log(`[Email] Password reset link sent to ${to}`);
      return true;
    } catch (err) {
      console.error('[Email] Failed to send email via SMTP transporter:', err);
      // Fallback to console log in case of SMTP failure
      logResetLinkConsole(to, resetUrl);
      return false;
    }
  }

  // Development environment: log prominently to terminal
  logResetLinkConsole(to, resetUrl);
  return true;
}

function logResetLinkConsole(to: string, resetUrl: string) {
  console.log('\n================== [NEXUS CHESS: PASSWORD RESET] ==================');
  console.log(`Recipient : ${to}`);
  console.log(`Reset URL : ${resetUrl}`);
  console.log(`Expires In: 15 minutes`);
  console.log('===================================================================\n');
}
