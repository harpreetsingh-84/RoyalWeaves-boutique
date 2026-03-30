import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready (Gmail)');
  }
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
      from: `"Woven Wonder" <${process.env.SMTP_USER}>`, // MUST match SMTP_USER for Gmail
      to,
      subject,
      html,
    });
    console.log(`\n================================`);
    console.log(`🔐 OTP Generated for ${to}: ${otp}`);
    console.log(`📧 Email Status: ${info.response}`);
    console.log(`================================\n`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP Email:', error);
    return false;
  }
};
