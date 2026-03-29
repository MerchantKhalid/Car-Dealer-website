import { Router } from 'express';
import {
  bookTestDrive,
  getTestDrives,
  updateTestDrive,
  cancelTestDrive,
} from '../controllers/testDrive.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, bookTestDrive);
router.get('/', authenticate, getTestDrives);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SALES_AGENT'),
  updateTestDrive,
);
router.delete('/:id', authenticate, cancelTestDrive);

export default router;
