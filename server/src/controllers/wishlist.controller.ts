import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: { vehicle: { include: { images: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { vehicleId } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    const existing = await prisma.wishlist.findUnique({
      where: { userId_vehicleId: { userId: req.user!.userId, vehicleId } },
    });
    if (existing) throw new AppError('Vehicle already in wishlist', 409);

    const item = await prisma.wishlist.create({
      data: { userId: req.user!.userId, vehicleId },
      include: { vehicle: { include: { images: true } } },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { vehicleId } = req.params;

    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.userId, vehicleId },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
}

export async function checkWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { vehicleId } = req.params;
    const item = await prisma.wishlist.findUnique({
      where: { userId_vehicleId: { userId: req.user!.userId, vehicleId } },
    });
    res.json({ isWishlisted: !!item });
  } catch (error) {
    next(error);
  }
}
