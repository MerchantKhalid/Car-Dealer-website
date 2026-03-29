import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(2030),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().min(0),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']),
  bodyType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN']),
  color: z.string().min(1),
  vin: z.string().min(1, 'VIN is required'),
  condition: z.enum(['NEW', 'USED', 'CERTIFIED_PRE_OWNED']),
  description: z.string().optional(),
});

export const testDriveSchema = z.object({
  vehicleId: z.string().uuid(),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type TestDriveInput = z.infer<typeof testDriveSchema>;
