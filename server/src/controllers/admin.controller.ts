// import { Request, Response, NextFunction } from 'express';
// import prisma from '../utils/prisma';

// export async function getDashboardStats(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const [
//       totalVehicles,
//       availableVehicles,
//       soldVehicles,
//       totalOrders,
//       pendingOrders,
//       completedOrders,
//       totalUsers,
//       totalRevenue,
//       recentOrders,
//       monthlyRevenue,
//     ] = await Promise.all([
//       prisma.vehicle.count(),
//       prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
//       prisma.vehicle.count({ where: { status: 'SOLD' } }),
//       prisma.order.count(),
//       prisma.order.count({ where: { orderStatus: 'PENDING' } }),
//       prisma.order.count({ where: { orderStatus: 'COMPLETED' } }),
//       prisma.user.count({ where: { role: 'CUSTOMER' } }),
//       prisma.order.aggregate({
//         _sum: { totalPrice: true },
//         where: { paymentStatus: 'COMPLETED' },
//       }),
//       prisma.order.findMany({
//         take: 5,
//         orderBy: { createdAt: 'desc' },
//         include: {
//           user: { select: { name: true, email: true } },
//           vehicle: { select: { make: true, model: true, year: true } },
//         },
//       }),
//       prisma.order.groupBy({
//         by: ['createdAt'],
//         _sum: { totalPrice: true },
//         where: {
//           paymentStatus: 'COMPLETED',
//           createdAt: {
//             gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
//           },
//         },
//       }),
//     ]);

//     res.json({
//       stats: {
//         totalVehicles,
//         availableVehicles,
//         soldVehicles,
//         totalOrders,
//         pendingOrders,
//         completedOrders,
//         totalUsers,
//         totalRevenue: totalRevenue._sum.totalPrice || 0,
//       },
//       recentOrders,
//       monthlyRevenue,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getUsers(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const { page = '1', limit = '20', search, role } = req.query;
//     const pageNum = parseInt(page as string);
//     const limitNum = parseInt(limit as string);

//     const where: any = {};
//     if (role) where.role = role;
//     if (search) {
//       where.OR = [
//         { name: { contains: search as string, mode: 'insensitive' } },
//         { email: { contains: search as string, mode: 'insensitive' } },
//       ];
//     }

//     const [users, total] = await Promise.all([
//       prisma.user.findMany({
//         where,
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           phone: true,
//           role: true,
//           avatar: true,
//           createdAt: true,
//           _count: { select: { orders: true } },
//         },
//         skip: (pageNum - 1) * limitNum,
//         take: limitNum,
//         orderBy: { createdAt: 'desc' },
//       }),
//       prisma.user.count({ where }),
//     ]);

//     res.json({
//       users,
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         pages: Math.ceil(total / limitNum),
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function updateUserRole(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const { role } = req.body;
//     const user = await prisma.user.update({
//       where: { id: req.params.id },
//       data: { role },
//       select: { id: true, email: true, name: true, role: true },
//     });
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getReports(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const { period = '30' } = req.query;
//     const days = parseInt(period as string);
//     const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

//     const [salesByMake, topVehicles, ordersByStatus] = await Promise.all([
//       prisma.order.findMany({
//         where: { createdAt: { gte: startDate }, paymentStatus: 'COMPLETED' },
//         include: { vehicle: { select: { make: true } } },
//       }),
//       prisma.vehicle.findMany({
//         where: { status: 'SOLD' },
//         include: { images: true },
//         take: 10,
//         orderBy: { updatedAt: 'desc' },
//       }),
//       prisma.order.groupBy({
//         by: ['orderStatus'],
//         _count: true,
//         where: { createdAt: { gte: startDate } },
//       }),
//     ]);

//     const makeRevenue: Record<string, number> = {};
//     salesByMake.forEach((o) => {
//       const make = o.vehicle?.make || 'Unknown';
//       makeRevenue[make] = (makeRevenue[make] || 0) + o.totalPrice;
//     });

//     res.json({ salesByMake: makeRevenue, topVehicles, ordersByStatus });
//   } catch (error) {
//     next(error);
//   }
// }
