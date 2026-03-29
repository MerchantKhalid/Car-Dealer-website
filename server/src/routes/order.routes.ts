import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'SALES_AGENT'),
  updateOrderStatus,
);
router.delete('/:id', authenticate, cancelOrder);

export default router;
