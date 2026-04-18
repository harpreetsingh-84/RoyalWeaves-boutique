import express from 'express';
import Cart from '../models/Cart';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// GET current user's cart
router.get('/', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    // Filter out items where the product was deleted entirely
    if (cart) {
      const validItems = cart.items.filter(item => item.product != null);
      if (validItems.length !== cart.items.length) {
        cart.items = validItems as any;
        await cart.save();
      }
      return res.json(cart.items);
    }
    
    return res.json([]);
  } catch (error) {
    console.error("Cart GET Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST to sync (merge) guest items with DB items
router.post('/sync', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { guestItems } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    if (guestItems && Array.isArray(guestItems) && guestItems.length > 0) {
      // Basic merge algorithm
      guestItems.forEach((guestItem: any) => {
        // Assume frontend sends product ID inside guestItem.product._id
        const productId = guestItem.product?._id || guestItem.product;
        const color = guestItem.color;

        const existingItem = cart!.items.find((item: any) => 
          item.product.toString() === productId && item.color === color
        );

        if (existingItem) {
          // You could cap it based on stock here, but let's assume frontend logic ensures it's fairly safe 
          // or we just trust the client's quantity. Easiest is to add.
          existingItem.quantity += guestItem.quantity;
        } else {
          cart!.items.push({
            product: productId,
            quantity: guestItem.quantity,
            color: color
          });
        }
      });
      await cart.save();
    }

    // Return the updated cart populated
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart ? populatedCart.items : []);
  } catch (error) {
    console.error("Cart Sync Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to overwrite entire cart from frontend (used when logged in users add/update/remove items)
router.put('/', verifyToken, async (req: AuthRequest, res: any): Promise<any> => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    const formattedItems = items.map((item: any) => ({
      product: item.product._id || item.product,
      quantity: item.quantity,
      color: item.color
    }));

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: formattedItems });
    } else {
      cart.items = formattedItems;
    }

    await cart.save();
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error("Cart PUT Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
