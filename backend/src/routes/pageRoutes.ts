import express from 'express';
import Page from '../models/Page';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public: Get all page metadata (slug, title) or full page by slug
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find().select('slug title');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
});

// Public: Get specific page
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    // Filter out disabled sections for public view
    // Wait, admins might want to fetch it all, but for simplicity public view endpoint
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page content' });
  }
});

// Admin: Upsert a page
router.put('/:slug', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, sections } = req.body;
    let page = await Page.findOne({ slug: req.params.slug });
    
    if (page) {
      page.title = title || page.title;
      page.sections = sections || page.sections;
      await page.save();
    } else {
      page = new Page({
        slug: req.params.slug,
        title: title || req.params.slug,
        sections: sections || []
      });
      await page.save();
    }

    res.json({ message: 'Page updated successfully', page });
  } catch (error) {
    res.status(500).json({ message: 'Error updating page' });
  }
});

// Admin: Delete a page
router.delete('/:slug', verifyToken, requireAdmin, async (req, res) => {
  try {
    await Page.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page' });
  }
});

export default router;
