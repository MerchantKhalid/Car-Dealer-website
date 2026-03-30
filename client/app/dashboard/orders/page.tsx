'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import { Order } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate, getPrimaryImage } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { CreditCard } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    orderAPI
      .getAll()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, orderStatus: 'CANCELLED' } : o)),
      );
      addToast('Order cancelled', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to cancel', 'error');
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border p-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getPrimaryImage(order.vehicle.images)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {order.vehicle.year} {order.vehicle.make}{' '}
                        {order.vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id.slice(0, 8)} ·{' '}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge status={order.orderStatus} />
                    <Badge status={order.paymentStatus} />
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {/* Show Pay Now if order is pending and payment not done */}
                    {order.orderStatus === 'PENDING' &&
                      order.paymentStatus === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/checkout?orderId=${order.id}`)
                          }
                        >
                          <CreditCard className="w-4 h-4 mr-1" /> Pay Now
                        </Button>
                      )}

                    {order.orderStatus === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
