'use client';

import { useState, useEffect } from 'react';
import { orderAPI } from '@/lib/api';
import { Order } from '@/types';
import { useToast } from '@/context/ToastContext';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';

const ORDER_STATUSES = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    orderAPI
      .getAll()
      .then(({ data }) => {
        setOrders(data);
        setFiltered(data);
      })
      .catch(() => addToast('Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.user?.name?.toLowerCase().includes(q) ||
          o.vehicle?.make?.toLowerCase().includes(q) ||
          o.vehicle?.model?.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, orders]);

  const handleStatusUpdate = async (id: string, orderStatus: string) => {
    setUpdatingId(id);
    try {
      await orderAPI.updateStatus(id, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, orderStatus } : o)),
      );
      addToast('Order status updated', 'success');
    } catch {
      addToast('Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <span className="text-sm text-gray-500">{filtered.length} orders</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, vehicle, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  'Order ID',
                  'Customer',
                  'Vehicle',
                  'Amount',
                  'Payment',
                  'Status',
                  'Date',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {order.user?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.vehicle
                        ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        disabled={updatingId === order.id}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {[
                          'PENDING',
                          'CONFIRMED',
                          'PROCESSING',
                          'COMPLETED',
                          'CANCELLED',
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
