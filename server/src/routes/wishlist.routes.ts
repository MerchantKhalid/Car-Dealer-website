import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.get('/check/:vehicleId', authenticate, checkWishlist);
router.delete('/:vehicleId', authenticate, removeFromWishlist);

export default router;
