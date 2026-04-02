import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create order (Authenticated User)
router.post('/', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { items, totalAmount, shippingDetails, transactionId, paymentScreenshot } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!transactionId || transactionId.trim().length < 10) {
      return res.status(400).json({ message: 'Valid Transaction ID (UTR) is required for UPI payments' });
    }

    // 1. Validate Stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      
      if (item.color) {
        const colorVariant = product.colors?.find((c: any) => c.color === item.color);
        if (!colorVariant) {
          return res.status(400).json({ message: `Color ${item.color} not found for ${product.name}` });
        }
        if (colorVariant.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.color})` });
        }
      } else {
        if (product.quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
      }
    }
    
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingDetails,
      transactionId,
      paymentScreenshot,
      paymentMethod: 'UPI',
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
    
    await order.save();

    // 2. Decrement Stock
    for (const item of items) {
      if (item.color) {
        await Product.findOneAndUpdate(
          { _id: item.product, "colors.color": item.color },
          { $inc: { "colors.$.stock": -item.quantity } }
        );
      } else {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity }
        });
      }
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
// Get logged in user orders
router.get('/myorders', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: 'Error fetching your orders' });
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
router.put('/:id/status', verifyToken, requireAdmin, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { status, paymentStatus, orderStatus } = req.body;
    
    const updatePayload: any = {};
    if (status) updatePayload.status = status; // legacy backwards compatibility
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;
    if (orderStatus) updatePayload.orderStatus = orderStatus;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: 'At least one status field is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updatePayload,
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
