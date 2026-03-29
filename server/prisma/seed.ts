import {
  PrismaClient,
  FuelType,
  Transmission,
  BodyType,
  VehicleCondition,
  VehicleStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.testDriveBooking.deleteMany();
  await prisma.order.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@drivehub.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+1-555-0100',
      role: 'ADMIN',
    },
  });

  const salesAgent = await prisma.user.create({
    data: {
      email: 'sarah@drivehub.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      phone: '+1-555-0101',
      role: 'SALES_AGENT',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: userPassword,
      name: 'John Doe',
      phone: '+1-555-0200',
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: userPassword,
      name: 'Jane Smith',
      phone: '+1-555-0201',
      role: 'CUSTOMER',
    },
  });

  // Vehicle data
  const vehicles = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      price: 28999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Pearl White',
      vin: 'TOY2024CAM00001',
      condition: VehicleCondition.NEW,
      description:
        'Brand new 2024 Toyota Camry with advanced safety features and a refined interior.',
      features: JSON.stringify([
        'Apple CarPlay',
        'Android Auto',
        'Lane Departure Warning',
        'Adaptive Cruise Control',
        'Blind Spot Monitor',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
          isPrimary: false,
        },
      ],
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2024,
      price: 24999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Sonic Gray',
      vin: 'HON2024CIV00001',
      condition: VehicleCondition.NEW,
      description:
        'The all-new Honda Civic combines sporty performance with everyday practicality.',
      features: JSON.stringify([
        'Honda Sensing',
        'Wireless CarPlay',
        'Bose Sound System',
        'Sunroof',
        'Heated Seats',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27f5?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      price: 42999,
      mileage: 5200,
      fuelType: FuelType.PETROL,
      transmission: Transmission.MANUAL,
      bodyType: BodyType.COUPE,
      color: 'Race Red',
      vin: 'FOR2023MUS00001',
      condition: VehicleCondition.USED,
      description:
        'Iconic Ford Mustang with powerful V8 engine and head-turning design.',
      features: JSON.stringify([
        'V8 Engine',
        'Performance Pack',
        'Launch Control',
        'Recaro Seats',
        'Digital Dashboard',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 39999,
      mileage: 0,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Midnight Silver',
      vin: 'TES2024MD300001',
      condition: VehicleCondition.NEW,
      description:
        'Tesla Model 3 with cutting-edge autopilot and zero emissions.',
      features: JSON.stringify([
        'Autopilot',
        'Full Self-Driving',
        '15" Touchscreen',
        'Glass Roof',
        'Premium Audio',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'BMW',
      model: 'X5',
      year: 2023,
      price: 65999,
      mileage: 12000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Alpine White',
      vin: 'BMW2023X5000001',
      condition: VehicleCondition.CERTIFIED_PRE_OWNED,
      description:
        'Luxurious BMW X5 with premium features and commanding road presence.',
      features: JSON.stringify([
        'Panoramic Sunroof',
        'Harman Kardon Sound',
        'Gesture Control',
        'Air Suspension',
        'Night Vision',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      price: 47999,
      mileage: 0,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Obsidian Black',
      vin: 'MER2024CCL00001',
      condition: VehicleCondition.NEW,
      description:
        'Elegant Mercedes-Benz C-Class with hybrid efficiency and luxury.',
      features: JSON.stringify([
        'MBUX Infotainment',
        'Burmester Sound',
        'Ambient Lighting',
        'Head-Up Display',
        'Wireless Charging',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2023,
      price: 52999,
      mileage: 8500,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.TRUCK,
      color: 'Summit White',
      vin: 'CHE2023SIL00001',
      condition: VehicleCondition.USED,
      description: 'Powerful Chevrolet Silverado built for work and adventure.',
      features: JSON.stringify([
        'Towing Package',
        'Bed Liner',
        'Trailer Brake Controller',
        'Off-Road Package',
        'Crew Cab',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Audi',
      model: 'A4',
      year: 2024,
      price: 43999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Navarra Blue',
      vin: 'AUD2024A4000001',
      condition: VehicleCondition.NEW,
      description:
        'Refined Audi A4 with Quattro all-wheel drive and virtual cockpit.',
      features: JSON.stringify([
        'Quattro AWD',
        'Virtual Cockpit',
        'Bang & Olufsen Audio',
        'Matrix LED Headlights',
        'Sport Seats',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Hyundai',
      model: 'Tucson',
      year: 2024,
      price: 31999,
      mileage: 0,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Amazon Gray',
      vin: 'HYU2024TUC00001',
      condition: VehicleCondition.NEW,
      description:
        'Stylish Hyundai Tucson Hybrid with impressive fuel economy.',
      features: JSON.stringify([
        'Hybrid Powertrain',
        'Digital Key',
        'Bluelink Connected Car',
        'Ventilated Seats',
        'BOSE Audio',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1633695632957-9b56a9965784?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      year: 2023,
      price: 29999,
      mileage: 3200,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.HATCHBACK,
      color: 'Atlantic Blue',
      vin: 'VW2023GOL00001',
      condition: VehicleCondition.CERTIFIED_PRE_OWNED,
      description: 'Versatile VW Golf with German engineering and modern tech.',
      features: JSON.stringify([
        'Digital Cockpit Pro',
        'IQ.DRIVE',
        'Harman Kardon Audio',
        'Adaptive Chassis',
        'LED Matrix',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Mazda',
      model: 'CX-5',
      year: 2024,
      price: 33999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Soul Red Crystal',
      vin: 'MAZ2024CX500001',
      condition: VehicleCondition.NEW,
      description:
        'Premium Mazda CX-5 with award-winning design and driving dynamics.',
      features: JSON.stringify([
        'i-Activ AWD',
        'BOSE Audio',
        'Heads-Up Display',
        'Power Liftgate',
        'Heated Steering Wheel',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Nissan',
      model: 'Altima',
      year: 2023,
      price: 26999,
      mileage: 15000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SEDAN,
      color: 'Gun Metallic',
      vin: 'NIS2023ALT00001',
      condition: VehicleCondition.USED,
      description:
        'Reliable Nissan Altima with ProPILOT Assist and comfortable ride.',
      features: JSON.stringify([
        'ProPILOT Assist',
        'AWD',
        'Intelligent Around View Monitor',
        'Zero Gravity Seats',
        'Remote Start',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Kia',
      model: 'EV6',
      year: 2024,
      price: 48999,
      mileage: 0,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Glacier White',
      vin: 'KIA2024EV600001',
      condition: VehicleCondition.NEW,
      description:
        'Award-winning Kia EV6 with ultra-fast charging and stunning range.',
      features: JSON.stringify([
        '800V Architecture',
        'Vehicle-to-Load',
        'Augmented Reality HUD',
        'Meridian Audio',
        'Relaxation Seats',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1619976215542-c0b9fa3c3566?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Subaru',
      model: 'Outback',
      year: 2024,
      price: 36999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Autumn Green',
      vin: 'SUB2024OUT00001',
      condition: VehicleCondition.NEW,
      description: 'Adventure-ready Subaru Outback with Symmetrical AWD.',
      features: JSON.stringify([
        'Symmetrical AWD',
        'EyeSight Driver Assist',
        'X-Mode',
        'StarLink Multimedia',
        'Power Rear Gate',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Lexus',
      model: 'RX 350',
      year: 2024,
      price: 52999,
      mileage: 0,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Caviar Black',
      vin: 'LEX2024RX300001',
      condition: VehicleCondition.NEW,
      description:
        'Luxurious Lexus RX 350 with unmatched refinement and comfort.',
      features: JSON.stringify([
        'Mark Levinson Audio',
        'Panoramic View Monitor',
        'Adaptive Variable Suspension',
        'Head-Up Display',
        'Hands-Free Power Liftgate',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Ram',
      model: '1500',
      year: 2023,
      price: 55999,
      mileage: 7800,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.TRUCK,
      color: 'Patriot Blue',
      vin: 'RAM20231500001',
      condition: VehicleCondition.USED,
      description:
        'Capable Ram 1500 with best-in-class interior and ride quality.',
      features: JSON.stringify([
        'EcoDiesel',
        'Air Suspension',
        '12" Uconnect',
        'Multifunction Tailgate',
        'RamBox Cargo',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Porsche',
      model: 'Cayenne',
      year: 2023,
      price: 89999,
      mileage: 4200,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Carrara White',
      vin: 'POR2023CAY00001',
      condition: VehicleCondition.CERTIFIED_PRE_OWNED,
      description:
        'Performance-oriented Porsche Cayenne E-Hybrid with sports car DNA.',
      features: JSON.stringify([
        'E-Hybrid',
        'Sport Chrono',
        'PASM',
        'Porsche Communication Management',
        'Bose Surround',
      ]),
      isFeatured: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Honda',
      model: 'CR-V',
      year: 2024,
      price: 34999,
      mileage: 0,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Lunar Silver',
      vin: 'HON2024CRV00001',
      condition: VehicleCondition.NEW,
      description:
        'Versatile Honda CR-V Hybrid with spacious interior and efficiency.',
      features: JSON.stringify([
        'Hybrid Powertrain',
        'Honda Sensing',
        'Wireless CarPlay',
        'Power Tailgate',
        'Heated Seats',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1568844293986-8d0400f4e835?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Toyota',
      model: 'RAV4',
      year: 2023,
      price: 32999,
      mileage: 11000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.SUV,
      color: 'Blueprint',
      vin: 'TOY2023RAV00001',
      condition: VehicleCondition.USED,
      description:
        'Reliable Toyota RAV4 with Toyota Safety Sense and versatile cargo space.',
      features: JSON.stringify([
        'Toyota Safety Sense',
        'Multi-Terrain Select',
        'JBL Audio',
        'Digital Rearview Mirror',
        'Wireless Charging',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
          isPrimary: true,
        },
      ],
    },
    {
      make: 'Chrysler',
      model: 'Pacifica',
      year: 2024,
      price: 41999,
      mileage: 0,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      bodyType: BodyType.VAN,
      color: 'Ceramic Grey',
      vin: 'CHR2024PAC00001',
      condition: VehicleCondition.NEW,
      description:
        'Family-friendly Chrysler Pacifica Hybrid with Stow n Go seating.',
      features: JSON.stringify([
        'Plug-in Hybrid',
        'Stow n Go Seating',
        'Uconnect Theater',
        'FamCAM',
        '360 Surround View',
      ]),
      isFeatured: false,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800',
          isPrimary: true,
        },
      ],
    },
  ];

  for (const v of vehicles) {
    const { images, ...vehicleData } = v;
    await prisma.vehicle.create({
      data: {
        ...vehicleData,
        features: v.features,
        images: {
          create: images,
        },
      },
    });
  }

  // Create sample orders
  const allVehicles = await prisma.vehicle.findMany({ take: 3 });

  if (allVehicles[0]) {
    await prisma.order.create({
      data: {
        userId: customer1.id,
        vehicleId: allVehicles[0].id,
        totalPrice: allVehicles[0].price,
        paymentStatus: 'COMPLETED',
        paymentMethod: 'stripe',
        transactionId: 'pi_sample_001',
        orderStatus: 'COMPLETED',
      },
    });
    await prisma.vehicle.update({
      where: { id: allVehicles[0].id },
      data: { status: 'SOLD' },
    });
  }

  if (allVehicles[1]) {
    await prisma.order.create({
      data: {
        userId: customer2.id,
        vehicleId: allVehicles[1].id,
        totalPrice: allVehicles[1].price,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
      },
    });
  }

  // Create sample test drive bookings
  if (allVehicles[2]) {
    await prisma.testDriveBooking.create({
      data: {
        userId: customer1.id,
        vehicleId: allVehicles[2].id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        scheduledTime: '10:00 AM',
        status: 'CONFIRMED',
        notes: 'Looking forward to test driving this vehicle.',
      },
    });
  }

  // Create sample wishlist entries
  const availableVehicles = await prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    take: 3,
  });

  for (const v of availableVehicles) {
    await prisma.wishlist.create({
      data: {
        userId: customer1.id,
        vehicleId: v.id,
      },
    });
  }

  // Create sample reviews
  if (allVehicles[0]) {
    await prisma.review.create({
      data: {
        userId: customer1.id,
        vehicleId: allVehicles[0].id,
        rating: 5,
        comment: 'Amazing car! Excellent buying experience at DriveHub.',
      },
    });
  }

  console.log('✅ Seed data created successfully!');
  console.log('Admin: admin@drivehub.com / Admin123!');
  console.log('Customer: john@example.com / User123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
