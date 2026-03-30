import express from 'express';
import User from '../models/User';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Get all generic users (non-admins)
router.get('/', verifyToken, requireAdmin, async (req, res): Promise<any> => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update block status
router.put('/:id/block', verifyToken, requireAdmin, async (req, res): Promise<any> => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Don't allow blocking an admin from this route just in case
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot block an admin user' });

    user.isBlocked = isBlocked;
    await user.save();
    
    res.json({ message: `User successfully ${isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', verifyToken, requireAdmin, async (req, res): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot delete an admin via this endpoint' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all admins
router.get('/admins', verifyToken, requireAdmin, async (req, res): Promise<any> => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove admin role (or convert back to regular user)
router.delete('/admins/:id', verifyToken, requireAdmin, async (req: any, res: any): Promise<any> => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot remove the last remaining admin' });
    }

    const adminUser = await User.findById(req.params.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // You can't remove yourself
    if (adminUser._id.toString() === req.user.id.toString()) {
       return res.status(400).json({ message: 'Cannot remove yourself' });
    }

    // Just remove admin rights so they become a normal user, or optionally delete they account. 
    // We will just remove admin rights.
    adminUser.isAdmin = false;
    await adminUser.save();

    res.json({ message: 'Admin privileges removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
