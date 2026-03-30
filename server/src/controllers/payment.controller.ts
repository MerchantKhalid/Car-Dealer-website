// import { Request, Response, NextFunction } from 'express';
// import Stripe from 'stripe';
// import prisma from '../utils/prisma';
// import { AppError } from '../middleware/errorHandler';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20' as any,
// });

// export async function createPaymentIntent(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const { orderId } = req.body;

//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: { vehicle: true },
//     });

//     if (!order) throw new AppError('Order not found', 404);
//     if (order.userId !== req.user!.userId)
//       throw new AppError('Unauthorized', 403);
//     if (order.paymentStatus === 'COMPLETED')
//       throw new AppError('Order already paid', 400);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(order.totalPrice * 100), // cents
//       currency: 'usd',
//       metadata: {
//         orderId: order.id,
//         vehicleId: order.vehicleId,
//       },
//     });

//     // Save the Stripe transaction ID
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { transactionId: paymentIntent.id },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function handleWebhook(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const sig = req.headers['stripe-signature'] as string;

//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET!,
//     );

//     if (event.type === 'payment_intent.succeeded') {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       const orderId = paymentIntent.metadata.orderId;

//       await prisma.order.update({
//         where: { id: orderId },
//         data: {
//           paymentStatus: 'COMPLETED',
//           orderStatus: 'CONFIRMED',
//         },
//       });

//       const order = await prisma.order.findUnique({ where: { id: orderId } });
//       if (order) {
//         await prisma.vehicle.update({
//           where: { id: order.vehicleId },
//           data: { status: 'SOLD' },
//         });
//       }
//     }

//     if (event.type === 'payment_intent.payment_failed') {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       const orderId = paymentIntent.metadata.orderId;

//       await prisma.order.update({
//         where: { id: orderId },
//         data: { paymentStatus: 'FAILED' },
//       });
//     }

//     res.json({ received: true });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getPaymentStatus(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: req.params.orderId },
//       select: {
//         paymentStatus: true,
//         transactionId: true,
//         orderStatus: true,
//       },
//     });
//     if (!order) throw new AppError('Order not found', 404);
//     res.json(order);
//   } catch (error) {
//     next(error);
//   }
// }
