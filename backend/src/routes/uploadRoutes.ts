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
    envKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY')),
    cloudinaryConfigURL: process.env.CLOUDINARY_URL,
    parsedConfig: cloudinary.config()
  });
});

// Debug signature generation
router.get('/debug-signature', (req, res) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const api_secret = cloudinary.config().api_secret;
  
  if (!api_secret) {
     return res.status(400).json({ error: "No API secret found in Cloudinary config" });
  }

  const paramsToSign = {
    folder: 'boutique-products',
    timestamp: timestamp
  };

  const expectedSignature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);
  
  res.json({
    paramsSigned: paramsToSign,
    api_secret_used: `starts with ${api_secret.substring(0, 3)}... ends with ${api_secret.substring(api_secret.length - 3)}`,
    expectedSignature: expectedSignature,
    timestamp: timestamp
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

// Use memory storage for direct Cloudinary upload_stream handling (more reliable than CloudinaryStorage for arrays)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper for direct buffer stream upload
const streamUpload = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'boutique-products' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

// POST a single image
router.post('/', verifyToken, requireAdmin, upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ message: 'No file received' });
    }
    
    // Upload buffer directly to Cloudinary
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });

  } catch (err: any) {
    console.error("Cloudinary single upload error:", err);
    res.status(400).json({ 
      message: err.message || 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? err : undefined 
    });
  }
});

// POST multiple images
router.post('/multiple', verifyToken, requireAdmin, upload.array('images', 8), async (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.error("No files in multi-upload request");
      return res.status(400).json({ message: 'No files received' });
    }
    
    // Concurrently upload all buffers to Cloudinary
    const uploadPromises = (req.files as any[]).map(file => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);
    
    // Extract secure URLs
    const urls = results.map(result => result.secure_url);
    res.json({ urls });

  } catch (err: any) {
    console.error("Cloudinary multi-upload error:", err);
    res.status(500).json({ 
      message: err.message || 'Gallery upload failed. Is a file too large?',
      error: process.env.NODE_ENV === 'development' ? err : undefined 
    });
  }
});

export default router;
