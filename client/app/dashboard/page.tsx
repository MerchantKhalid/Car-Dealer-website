'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { orderAPI, wishlistAPI, testDriveAPI } from '@/lib/api';
import { ShoppingBag, Heart, CalendarDays, DollarSign } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    testDrives: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      try {
        const [ordersRes, wishlistRes, tdRes] = await Promise.all([
          orderAPI.getAll(),
          wishlistAPI.getAll(),
          testDriveAPI.getAll(),
        ]);
        const orders = ordersRes.data;
        setStats({
          orders: orders.length,
          wishlist: wishlistRes.data.length,
          testDrives: tdRes.data.length,
          totalSpent: orders
            .filter((o: any) => o.paymentStatus === 'COMPLETED')
            .reduce((s: number, o: any) => s + o.totalPrice, 0),
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {}
    }
    fetch();
  }, []);

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.orders,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Wishlist Items',
      value: stats.wishlist,
      icon: Heart,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Test Drives',
      value: stats.testDrives,
      icon: CalendarDays,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Spent',
      value: formatPrice(stats.totalSpent),
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div
              className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary-600 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No orders yet</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {order.vehicle.year} {order.vehicle.make}{' '}
                    {order.vehicle.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <Badge status={order.orderStatus} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
