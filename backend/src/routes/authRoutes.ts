import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';
import { OAuth2Client } from 'google-auth-library';
import Otp from '../models/Otp';
import { sendOtpEmail } from '../services/emailService';

const GOOGLE_CLIENT_ID = '581880857756-9ihlrh7b4mll0i2dngbqk4e9guj2qcu3.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const router = express.Router();

router.post('/send-admin-otp', verifyToken, requireAdmin, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { action, targetEmail } = req.body; // action: 'update' | 'add'
    if (!targetEmail || !action) {
      return res.status(400).json({ message: 'Email and action are required' });
    }

    // Check if OTP was sent recently (cooldown)
    const recentOtp = await Otp.findOne({ email: targetEmail }).sort({ createdAt: -1 });
    if (recentOtp) {
      const timeDiff = Date.now() - recentOtp.createdAt.getTime();
      if (timeDiff < 30000) { // 30 seconds cooldown
        return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // Delete existing OTPs for email to prevent confusion
    await Otp.deleteMany({ email: targetEmail });

    // Save new OTP
    const otpDoc = new Otp({ email: targetEmail, otp: hashedOtp });
    await otpDoc.save();

    // Send email
    const emailSent = await sendOtpEmail(targetEmail, otpCode, action);
    if (!emailSent) {
       await Otp.deleteMany({ email: targetEmail });
       return res.status(500).json({ message: 'Failed to send OTP email. Please check your SMTP settings.' });
    }

    res.json({ message: 'OTP sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-admin-action', verifyToken, requireAdmin, async (req: AuthRequest, res: any): Promise<any> => {
   try {
     const { action, targetEmail, otp } = req.body;
     if (!targetEmail || !otp || !action) {
       return res.status(400).json({ message: 'Missing required fields' });
     }

     const otpDoc = await Otp.findOne({ email: targetEmail });
     if (!otpDoc) {
       return res.status(400).json({ message: 'OTP has expired or does not exist.' });
     }

     if (otpDoc.attempts >= 3) {
       await Otp.deleteOne({ email: targetEmail });
       return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
     }

     const isMatch = await bcrypt.compare(otp, otpDoc.otp);
     if (!isMatch) {
       otpDoc.attempts += 1;
       await otpDoc.save();
       return res.status(400).json({ message: 'Invalid OTP.' });
     }

     // Success! Perform action
     if (action === 'update') {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Current user not found' });
        
        // Prevent duplicate emails
        const exists = await User.findOne({ email: targetEmail });
        if (exists && exists._id.toString() !== req.user.id) {
           return res.status(400).json({ message: 'Email already in use by another account.' });
        }
        
        user.email = targetEmail;
        await user.save();
     } else if (action === 'add') {
        // Prevent duplicate users
        let user = await User.findOne({ email: targetEmail });
        if (user) {
           user.isAdmin = true;
           await user.save();
        } else {
           // Create a new user with default random password since they will likely use Google OAuth or reset password
           const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
           const hashedPassword = await bcrypt.hash(tempPassword, 10);
           user = new User({
             name: 'New Admin',
             email: targetEmail,
             password: hashedPassword,
             isAdmin: true
           });
           await user.save();
        }
     }

     // Clean up OTP
     await Otp.deleteOne({ email: targetEmail });
     
     res.json({ message: action === 'update' ? 'Admin email updated successfully!' : 'New admin added successfully!' });
   } catch (err) {
     res.status(500).json({ message: 'Server error' });
   }
});

router.post('/register', async (req, res): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account was created with Google. Please Sign In with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Logged in successfully', isAdmin: user.isAdmin, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/verify', verifyToken, (req: any, res) => {
  res.json({ message: 'Token is valid', isAdmin: req.user.isAdmin });
});

router.post('/google', async (req: any, res: any) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential missing' });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ message: 'Invalid payload' });

    const { email, name } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name || 'Google User',
        email,
        isAdmin: false
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Google login successful', isAdmin: user.isAdmin, user: { name: user.name, email: user.email } });
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ message: err.message || 'Google auth failed internally' });
  }
});

export default router;
