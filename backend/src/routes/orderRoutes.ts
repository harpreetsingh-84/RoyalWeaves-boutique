import express from 'express';
import Order from '../models/Order';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create order (Authenticated User)
router.post('/', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get all orders (Admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router;
