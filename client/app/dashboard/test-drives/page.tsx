'use client';

import { useState, useEffect } from 'react';
import { testDriveAPI } from '@/lib/api';
import { TestDriveBooking } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatDate, getPrimaryImage } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function TestDrivesPage() {
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    testDriveAPI
      .getAll()
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this test drive booking?')) return;
    try {
      await testDriveAPI.cancel(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)),
      );
      addToast('Test drive cancelled', 'success');
    } catch {
      addToast('Failed to cancel', 'error');
    }
  };

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Test Drives</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">No test drive bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getPrimaryImage(b.vehicle.images)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {formatDate(b.scheduledDate)} at {b.scheduledTime}
                </p>
                {b.notes && (
                  <p className="text-sm text-gray-500 mt-1">Note: {b.notes}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge status={b.status} />
                  {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancel(b.id)}
                      className="text-red-600"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
