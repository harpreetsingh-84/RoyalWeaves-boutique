import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'boutique-products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `img-${Date.now()}`
    };
  },
});

const upload = multer({ storage });

// POST a single image
router.post('/', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(400).json({ message: err.message || 'Upload failed natively' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file received' });
    }
    
    // Cloudinary provides the direct URL in req.file.path
    res.json({ url: req.file.path });
  });
});

// POST multiple images
router.post('/multiple', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.array('images', 8)(req, res, (err: any) => {
    if (err) {
      console.error("Cloudinary multi-upload error:", err);
      return res.status(400).json({ message: err.message || 'Gallery upload failed natively' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files received' });
    }
    
    const urls = (req.files as any[]).map(file => file.path);
    res.json({ urls });
  });
});

export default router;
