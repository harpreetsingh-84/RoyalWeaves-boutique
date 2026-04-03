import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// GET all products (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET all products including deleted (Protected Admin)
router.get('/admin', verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new product (Protected Admin)
router.post('/', verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

// DELETE a product (Protected Admin) - Soft Delete
router.delete('/:id', verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    if (product) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update a product (Protected Admin)
router.put('/:id', verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

export default router;
