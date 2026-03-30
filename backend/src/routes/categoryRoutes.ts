import express, { Request, Response } from 'express';
import Category from '../models/Category';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// GET all categories (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new category (Protected Admin)
router.post('/', verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category data' });
  }
});

// DELETE a category (Protected Admin)
router.delete('/:id', verifyToken, requireAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
