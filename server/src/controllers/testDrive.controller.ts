import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function bookTestDrive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { vehicleId, scheduledDate, scheduledTime, notes } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    const booking = await prisma.testDriveBooking.create({
      data: {
        userId: req.user!.userId,
        vehicleId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        notes,
      },
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function getTestDrives(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const where =
      req.user!.role === 'ADMIN' || req.user!.role === 'SALES_AGENT'
        ? {}
        : { userId: req.user!.userId };

    const bookings = await prisma.testDriveBooking.findMany({
      where,
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function updateTestDrive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status, scheduledDate, scheduledTime } = req.body;

    const booking = await prisma.testDriveBooking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) throw new AppError('Booking not found', 404);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
    if (scheduledTime) updateData.scheduledTime = scheduledTime;

    const updated = await prisma.testDriveBooking.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        vehicle: { include: { images: true } },
        user: { select: { name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function cancelTestDrive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const booking = await prisma.testDriveBooking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) throw new AppError('Booking not found', 404);
    if (req.user!.role === 'CUSTOMER' && booking.userId !== req.user!.userId) {
      throw new AppError('Unauthorized', 403);
    }

    await prisma.testDriveBooking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Test drive cancelled' });
  } catch (error) {
    next(error);
  }
}
