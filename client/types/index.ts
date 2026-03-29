export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SALES_AGENT';
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  vin: string;
  condition: string;
  status: string;
  description?: string;
  features: string;
  isFeatured: boolean;
  images: VehicleImage[];
  reviews?: Review[];
  createdAt: string;
}

export interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  vehicleId: string;
}

export interface Order {
  id: string;
  userId: string;
  vehicleId: string;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod?: string;
  transactionId?: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  user: { name: string; email: string; phone?: string };
}

export interface TestDriveBooking {
  id: string;
  userId: string;
  vehicleId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  vehicle: Vehicle;
  user: { name: string; email: string; phone?: string };
}

export interface WishlistItem {
  id: string;
  userId: string;
  vehicleId: string;
  createdAt: string;
  vehicle: Vehicle;
}

export interface Review {
  id: string;
  userId: string;
  vehicleId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { name: string; avatar?: string };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalRevenue: number;
}
