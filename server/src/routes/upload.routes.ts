import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config — save to disk with original extension
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `vehicle-${unique}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
});

// POST /api/upload/image  (admin only)
router.post(
  '/image',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const serverBase =
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

    const url = `${serverBase}/uploads/${req.file.filename}`;
    return res.json({ url });
  },
);

export default router;