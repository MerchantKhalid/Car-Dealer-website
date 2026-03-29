import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { vehicleId, paymentMethod } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.status !== 'AVAILABLE')
      throw new AppError('Vehicle is not available', 400);

    const order = await prisma.order.create({
      data: {
        userId: req.user!.userId,
        vehicleId,
        totalPrice: vehicle.price,
        paymentMethod,
      },
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true } },
      },
    });

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'RESERVED' },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const where =
      req.user!.role === 'ADMIN' || req.user!.role === 'SALES_AGENT'
        ? {}
        : { userId: req.user!.userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!order) throw new AppError('Order not found', 404);
    if (req.user!.role === 'CUSTOMER' && order.userId !== req.user!.userId) {
      throw new AppError('Unauthorized', 403);
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!order) throw new AppError('Order not found', 404);

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: { vehicle: true },
    });

    if (orderStatus === 'COMPLETED' && paymentStatus === 'COMPLETED') {
      await prisma.vehicle.update({
        where: { id: order.vehicleId },
        data: { status: 'SOLD' },
      });
    }
    if (orderStatus === 'CANCELLED') {
      await prisma.vehicle.update({
        where: { id: order.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!order) throw new AppError('Order not found', 404);
    if (req.user!.role === 'CUSTOMER' && order.userId !== req.user!.userId) {
      throw new AppError('Unauthorized', 403);
    }
    if (order.orderStatus === 'COMPLETED') {
      throw new AppError('Cannot cancel a completed order', 400);
    }

    await prisma.order.update({
      where: { id: req.params.id },
      data: { orderStatus: 'CANCELLED' },
    });

    await prisma.vehicle.update({
      where: { id: order.vehicleId },
      data: { status: 'AVAILABLE' },
    });

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
}
