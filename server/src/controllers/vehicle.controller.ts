import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export async function getVehicles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      page = '1',
      limit = '12',
      sort = 'createdAt',
      order = 'desc',
      make,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      mileageMax,
      fuelType,
      transmission,
      bodyType,
      condition,
      status,
      search,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.VehicleWhereInput = {};

    if (make) where.make = { equals: make as string, mode: 'insensitive' };
    if (model) where.model = { contains: model as string, mode: 'insensitive' };
    if (yearMin || yearMax) {
      where.year = {};
      if (yearMin) where.year.gte = parseInt(yearMin as string);
      if (yearMax) where.year.lte = parseInt(yearMax as string);
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }
    if (mileageMax) where.mileage = { lte: parseInt(mileageMax as string) };
    if (fuelType) where.fuelType = fuelType as any;
    if (transmission) where.transmission = transmission as any;
    if (bodyType) where.bodyType = bodyType as any;
    if (condition) where.condition = condition as any;
    if (status) where.status = status as any;
    else where.status = 'AVAILABLE';

    if (search) {
      where.OR = [
        { make: { contains: search as string, mode: 'insensitive' } },
        { model: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sort as string] = order;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: { images: true },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.vehicle.count({ where }),
    ]);

    res.json({
      vehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedVehicles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isFeatured: true, status: 'AVAILABLE' },
      include: { images: true },
      take: 8,
    });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}

export async function searchVehicles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE',
        OR: [
          { make: { contains: q as string, mode: 'insensitive' } },
          { model: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { color: { contains: q as string, mode: 'insensitive' } },
        ],
      },
      include: { images: true },
      take: 20,
    });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { images, ...vehicleData } = req.body;

    const existingVin = await prisma.vehicle.findUnique({
      where: { vin: vehicleData.vin },
    });
    if (existingVin) throw new AppError('VIN already exists', 409);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        features: vehicleData.features || '[]',
        images: images?.length ? { create: images } : undefined,
      },
      include: { images: true },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
}

export async function updateVehicle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { images, ...vehicleData } = req.body;

    const existing = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError('Vehicle not found', 404);

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: vehicleData,
      include: { images: true },
    });

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
}

export async function deleteVehicle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const existing = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError('Vehicle not found', 404);

    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getMakes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const makes = await prisma.vehicle.findMany({
      select: { make: true },
      distinct: ['make'],
      orderBy: { make: 'asc' },
    });
    res.json(makes.map((m) => m.make));
  } catch (error) {
    next(error);
  }
}
