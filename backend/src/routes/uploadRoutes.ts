import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();
const CLOUD_URL = process.env.CLOUDINARY_URL?.trim();

if (CLOUD_URL) {
  cloudinary.config({ cloudinary_url: CLOUD_URL });
} else {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
  });
}

// PUBLIC test route to verify reachability
router.get('/public-test', (req, res) => {
  res.json({ 
    message: "Upload routes are reachable!",
    envKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
  });
});

// Test route to verify Cloudinary connection (temporarily removed auth for debug)
router.get('/test-cloudinary', async (req: any, res: any) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ 
      status: 'success', 
      message: 'Cloudinary is connected!', 
      ping: result,
      config: {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key,
        hasSecret: !!cloudinary.config().api_secret
      }
    });
  } catch (error: any) {
    console.error("Cloudinary connection test failed:", error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      error: error
    });
  }
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'boutique-products',
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
