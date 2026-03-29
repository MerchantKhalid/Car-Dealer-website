'use client';

import { useState, useEffect } from 'react';
import { wishlistAPI } from '@/lib/api';
import { WishlistItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { VehicleCardSkeleton } from '@/components/ui/Skeleton';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    wishlistAPI
      .getAll()
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (vehicleId: string) => {
    try {
      await wishlistAPI.remove(vehicleId);
      setItems((prev) => prev.filter((i) => i.vehicleId !== vehicleId));
      addToast('Removed from wishlist', 'info');
    } catch {
      addToast('Failed to remove', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <VehicleCard
              key={item.id}
              vehicle={item.vehicle}
              isWishlisted={true}
              onWishlistToggle={() => handleRemove(item.vehicleId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
