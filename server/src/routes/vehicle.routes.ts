import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  getFeaturedVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMakes,
} from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/search', searchVehicles);
router.get('/makes', getMakes);
router.get('/:id', getVehicleById);
router.post('/', authenticate, authorize('ADMIN'), createVehicle);
router.put('/:id', authenticate, authorize('ADMIN'), updateVehicle);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteVehicle);

export default router;
