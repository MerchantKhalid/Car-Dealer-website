'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Fuel, Gauge, Settings2 } from 'lucide-react';
import { Vehicle } from '@/types';
import { formatPrice, formatMileage, getPrimaryImage } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistToggle?: (id: string) => void;
  isWishlisted?: boolean;
  view?: 'grid' | 'list';
}

export default function VehicleCard({
  vehicle,
  onWishlistToggle,
  isWishlisted,
  view = 'grid',
}: VehicleCardProps) {
  const imageUrl = getPrimaryImage(vehicle.images);

  if (view === 'list') {
    return (
      <Link href={`/vehicles/${vehicle.id}`} className="block">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex">
          <div className="relative w-72 h-48 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
            <Badge
              status={vehicle.condition}
              className="absolute top-2 left-2"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {vehicle.description}
              </p>
              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {formatMileage(vehicle.mileage)}
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1">
                  <Settings2 className="w-4 h-4" />
                  {vehicle.transmission}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(vehicle.price)}
              </span>
              {onWishlistToggle && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onWishlistToggle(vehicle.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge status={vehicle.condition} className="absolute top-3 left-3" />
          {onWishlistToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onWishlistToggle(vehicle.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              <Gauge className="w-3 h-3" />
              {formatMileage(vehicle.mileage)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              <Fuel className="w-3 h-3" />
              {vehicle.fuelType}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              <Settings2 className="w-3 h-3" />
              {vehicle.transmission}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(vehicle.price)}
            </span>
            <span className="text-xs text-gray-500">{vehicle.bodyType}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
