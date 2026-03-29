import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getReports,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/reports', getReports);

export default router;
