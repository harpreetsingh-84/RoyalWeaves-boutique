import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create order (Authenticated User)
router.post('/', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { items, totalAmount, shippingDetails } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 1. Validate Stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }
    
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingDetails
    });
    
    await order.save();

    // 2. Decrement Stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }

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

// Get single order by ID (Authenticated User)
router.get('/:id', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'image category');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user owns the order or is admin
    if (order.user._id.toString() !== req.user?.id && !req.user?.isAdmin) {
      return res.status(403).json({ message: 'Forbidden. You do not have access to this order.' });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: 'Error fetching order details' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.product', 'image category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
