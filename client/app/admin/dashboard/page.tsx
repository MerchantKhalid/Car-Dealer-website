'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import {
  Car,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getStats()
      .then(({ data }) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return <p>Failed to load stats</p>;

  const statCards = [
    {
      label: 'Total Vehicles',
      value: stats.totalVehicles,
      sub: `${stats.availableVehicles} available`,
      icon: Car,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} pending`,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      label: 'Total Customers',
      value: stats.totalUsers,
      sub: 'registered users',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      sub: `${stats.completedOrders} completed`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow-sm border p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div
                className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center`}
              >
                <s.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {stats.availableVehicles < 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Low stock alert: Only {stats.availableVehicles} vehicles available
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{o.user.name}</td>
                  <td className="px-4 py-3 text-sm">
                    {o.vehicle.year} {o.vehicle.make} {o.vehicle.model}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatPrice(o.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={o.orderStatus} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
