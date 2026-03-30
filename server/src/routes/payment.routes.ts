import { Router } from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import express from 'express';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook,
);
router.get('/:orderId/status', authenticate, getPaymentStatus);

export default router;
