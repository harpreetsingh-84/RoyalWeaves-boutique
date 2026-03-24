import express from 'express';
import SiteContent from '../models/SiteContent';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Helper to seed default content if DB is empty
const getOrCreateContent = async () => {
  let content = await SiteContent.findOne();
  if (!content) {
    content = new SiteContent({
      heroSlides: [
        {
          image: "https://images.unsplash.com/photo-1515347619252-a3915155cc9c?q=80&w=2070&auto=format&fit=crop",
          subtitle: "The Signature Collection",
          title: "Elegance Redefined",
          description: "Discover our exclusive range of luxury women's dresses, crafted for those who demand nothing but absolute perfection."
        },
        {
          image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070&auto=format&fit=crop",
          subtitle: "Evening Gowns",
          title: "Own The Night",
          description: "Make an unforgettable entrance with our breathtaking evening silhouettes and premium fabrics."
        },
        {
          image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
          subtitle: "Autumn / Winter 2026",
          title: "Modern Couture",
          description: "A curated collection of premium garments designed exclusively for the modern woman."
        }
      ],
      featuredCategories: [
        { name: 'Evening Gowns', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600' }, 
        { name: 'Summer Dresses', image: 'https://images.unsplash.com/photo-1572804013309-82a89b4b09fd?q=80&w=600' }, 
        { name: 'Casual Luxury', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=600' }
      ]
    });
    await content.save();
  }
  return content;
};

// GET current content
router.get('/', async (req, res) => {
  try {
    const content = await getOrCreateContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site content' });
  }
});

// Update content (Admin only)
router.put('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { heroSlides, featuredCategories } = req.body;
    let content = await getOrCreateContent();
    
    // Update fields if provided
    if (heroSlides) content.heroSlides = heroSlides;
    if (featuredCategories) content.featuredCategories = featuredCategories;
    
    await content.save();
    res.json({ message: 'Site content updated successfully', content });
  } catch (error) {
    res.status(500).json({ message: 'Error updating site content' });
  }
});

export default router;
