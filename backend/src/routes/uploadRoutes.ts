import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("CRITICAL: Cloudinary credentials missing in environment variables!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'boutique-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  } as any,
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST a single image
router.post('/', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error("Cloudinary single upload error:", err);
      return res.status(400).json({ 
        message: err.message || 'Upload failed',
        error: process.env.NODE_ENV === 'development' ? err : undefined 
      });
    }
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ message: 'No file received' });
    }
    
    res.json({ url: req.file.path });
  });
});

// POST multiple images
router.post('/multiple', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.array('images', 8)(req, res, (err: any) => {
    if (err) {
      console.error("Cloudinary multi-upload error:", err);
      return res.status(400).json({ 
        message: err.message || 'Gallery upload failed',
        error: process.env.NODE_ENV === 'development' ? err : undefined 
      });
    }
    if (!req.files || req.files.length === 0) {
      console.error("No files in multi-upload request");
      return res.status(400).json({ message: 'No files received' });
    }
    
    const urls = (req.files as any[]).map(file => file.path);
    res.json({ urls });
  });
});

export default router;
