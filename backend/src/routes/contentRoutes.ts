import express from 'express';
import SiteContent from '../models/SiteContent';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Helper to seed default content if DB is empty or needs boutique update
const getOrCreateContent = async () => {
  let content = await SiteContent.findOne();
  
  // Force re-seed if the old western wear data is detected
  if (content && content.heroSlides && content.heroSlides.length > 0 && content.heroSlides[0].title === "Elegance Redefined") {
    await SiteContent.deleteMany({});
    content = null;
  }

  if (!content) {
    content = new SiteContent({
      heroSlides: [
        {
          image: "https://images.unsplash.com/photo-1583391733958-6115fa016e78?auto=format&fit=crop&q=80",
          subtitle: "Handpicked Elegance for You",
          title: "Experience the\nRoyal Heritage",
          description: "Discover our premium collection of authentic, hand-crafted Punjabi suits and stunning ethnic wear designed for the modern woman."
        },
        {
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80",
          subtitle: "Premium Punjabi Suits",
          title: "Royal Heritage Collection",
          description: "Elevate your wardrobe with luxurious silk suits, intricate embroideries, and royal designs tailored to perfection."
        },
        {
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80",
          subtitle: "Your Perfect Day Deserves the Best",
          title: "Timeless Bridal\nElegance",
          description: "Step into your new life with our exclusive array of bridal lehengas and heavily embroidered suits, crafted with love."
        },
        {
          image: "https://images.unsplash.com/photo-1621005273760-b6a6552eaad7?auto=format&fit=crop&q=80",
          subtitle: "Comfort Meets Sophistication",
          title: "Everyday Luxury\nSilk Exclusives",
          description: "Experience the finest silk threads woven into beautiful, breathable patterns for your stylish daily wear."
        }
      ],
      featuredCategories: [
        { name: 'Party Wear Suits', image: 'https://images.unsplash.com/photo-1583391733958-6115fa016e78?q=80&auto=format&fit=crop&w=600' }, 
        { name: 'Bridal Collection', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&auto=format&fit=crop&w=600' }, 
        { name: 'Daily Wear Casuals', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&auto=format&fit=crop&w=600' }
      ],
      features: [
        { title: "Premium Quality", description: "Crafted from the finest materials with meticulous attention to every stitch.", icon: "Sparkles" },
        { title: "Secure Checkout", description: "State-of-the-art encryption ensures your payment details are always safe.", icon: "ShieldCheck" },
        { title: "Fast Delivery", description: "Express shipping available globally so you never miss an event.", icon: "Truck" },
        { title: "24/7 Support", description: "Our fashion consultants are available around the clock to assist you.", icon: "Clock" }
      ],
      howItWorks: [
        { num: "01", title: "Discover Your Style", desc: "Browse our exclusive collections.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop" },
        { num: "02", title: "Tailor to Perfection", desc: "Ensure the perfect fit.", image: "https://images.unsplash.com/photo-1583391733958-6115fa016e78?q=80&w=800&auto=format&fit=crop" },
        { num: "03", title: "Unbox Elegance", desc: "Receive your garment in luxury sustainable packaging.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" }
      ],
      testimonials: [
        { name: "Simran K.", role: "Verified Buyer", rating: 5, content: "The quality is simply unmatched. The silk suit fits like a dream and the embroidery is stunning." }
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
    const { 
      heroSlides, featuredCategories, features, howItWorks, testimonials,
      upiId, upiQrCode, contactEmail, contactPhone, contactAddress, storeHours 
    } = req.body;
    let content = await getOrCreateContent();
    
    // Update fields if provided
    if (heroSlides) content.heroSlides = heroSlides;
    if (featuredCategories) content.featuredCategories = featuredCategories;
    if (features) content.features = features;
    if (howItWorks) content.howItWorks = howItWorks;
    if (testimonials) content.testimonials = testimonials;

    if (upiId !== undefined) content.upiId = upiId;
    if (upiQrCode !== undefined) content.upiQrCode = upiQrCode;
    if (contactEmail !== undefined) content.contactEmail = contactEmail;
    if (contactPhone !== undefined) content.contactPhone = contactPhone;
    if (contactAddress !== undefined) content.contactAddress = contactAddress;
    if (storeHours !== undefined) content.storeHours = storeHours;
    
    await content.save();
    res.json({ message: 'Site content updated successfully', content });
  } catch (error) {
    res.status(500).json({ message: 'Error updating site content' });
  }
});

export default router;
