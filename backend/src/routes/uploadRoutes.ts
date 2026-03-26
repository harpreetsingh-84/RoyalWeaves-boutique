import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `img-${Date.now()}${path.extname(file.originalname || '')}`);
  }
});

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! Allowed extensions: .jpg, .jpeg, .png, .webp'));
  }
};

const upload = multer({ 
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post('/', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error("Multer single error:", err);
      return res.status(400).json({ message: err.message || 'Upload failed natively' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file received' });
    }
    res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
  });
});

router.post('/multiple', verifyToken, requireAdmin, (req: any, res: any) => {
  upload.array('images', 8)(req, res, (err: any) => {
    if (err) {
      console.error("Multer array error:", err);
      return res.status(400).json({ message: err.message || 'Gallery upload failed natively' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files received' });
    }
    const urls = req.files.map((file: any) => `http://localhost:5000/uploads/${file.filename}`);
    res.json({ urls });
  });
});

export default router;
