// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';

// dotenv.config();

// import authRoutes from './routes/auth.routes';
// import vehicleRoutes from './routes/vehicle.routes';
// import orderRoutes from './routes/order.routes';
// import testDriveRoutes from './routes/testDrive.routes';
// import wishlistRoutes from './routes/wishlist.routes';
// import adminRoutes from './routes/admin.routes';
// import paymentRoutes from './routes/payment.routes';
// import { errorHandler } from './middleware/errorHandler';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true,
//   }),
// );

// // Raw body for Stripe webhook
// app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// // JSON parser for everything else
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/test-drives', testDriveRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/payments', paymentRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Error handling
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import orderRoutes from './routes/order.routes';
import testDriveRoutes from './routes/testDrive.routes';
import wishlistRoutes from './routes/wishlist.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load in browser
  }),
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Raw body for Stripe webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parser for everything else
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`  Uploads served at http://localhost:${PORT}/uploads`);
});

export default app;
