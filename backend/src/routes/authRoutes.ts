import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = '916276338437-19l89gnho1p0pkng56el1e7c2j8mq7ut.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const router = express.Router();

router.put('/update-credentials', verifyToken, requireAdmin, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.password) {
      return res.status(400).json({ message: 'Account uses Google OAuth. Password update not supported.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    if (email) user.email = email;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    
    await user.save();
    res.json({ message: 'Credentials updated successfully!' });
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Google login successful', isAdmin: user.isAdmin, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google auth failed. Missing Client ID?' });
  }
});

export default router;
