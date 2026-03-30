import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Default ethereal credentials for fallback (used if no real SMTP is provided in .env)
const ETHEREAL_USER = 'katarina.hamill16@ethereal.email';
const ETHEREAL_PASS = '1pWQj4Uf9B2K9a2kXf';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com' ? process.env.SMTP_USER : ETHEREAL_USER,
    pass: process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your-app-password' ? process.env.SMTP_PASS : ETHEREAL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string, roleAction: 'update' | 'add') => {
  const subject = roleAction === 'update' 
    ? 'Woven Wonder: Verify Your Admin Email Update'
    : 'Woven Wonder: Grant New Admin Access Request';

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-top: 4px solid #B58550; border-radius: 8px;">
        <h2 style="color: #333;">Admin Security Verification</h2>
        <p>You recently requested to ${roleAction === 'update' ? 'update your admin email address' : 'grant admin access to a new email address'} on the Woven Wonder platform.</p>
        <p>Please enter the following 6-digit OTP code to verify this action:</p>
        
        <div style="margin: 30px 0; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f4f4f4; padding: 15px 30px; border-radius: 8px; border: 1px dashed #ccc;">${otp}</span>
        </div>

        <p style="color: #d9534f; font-weight: bold;">Note: This code will expire in 5 minutes.</p>
        
        <p>If you did not request this change, please ignore this email or review your account security immediately.</p>
        
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;"/>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Woven Wonder Admin System. This is an automated message.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Woven Wonder Security" <security@wovenwonder.com>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP Email:', error);
    return false;
  }
};
