'use client';

import { useState, useEffect } from 'react';
import { testDriveAPI } from '@/lib/api';
import { TestDriveBooking } from '@/types';
import { useToast } from '@/context/ToastContext';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Search, Calendar } from 'lucide-react';

const STATUS_OPTIONS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminTestDrivesPage() {
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [filtered, setFiltered] = useState<TestDriveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    testDriveAPI
      .getAll()
      .then(({ data }) => {
        setBookings(data);
        setFiltered(data);
      })
      .catch(() => addToast('Failed to load bookings', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== 'ALL') {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.user?.name?.toLowerCase().includes(q) ||
          b.vehicle?.make?.toLowerCase().includes(q) ||
          b.vehicle?.model?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await testDriveAPI.update(id, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      addToast('Booking status updated', 'success');
    } catch {
      addToast('Failed to update booking', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const counts = STATUS_OPTIONS.slice(1).reduce(
    (acc, s) => ({
      ...acc,
      [s]: bookings.filter((b) => b.status === s).length,
    }),
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Test Drive Management
        </h1>
        <span className="text-sm text-gray-500">
          {bookings.length} total bookings
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Pending',
            key: 'PENDING',
            color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          },
          {
            label: 'Confirmed',
            key: 'CONFIRMED',
            color: 'bg-blue-50 text-blue-700 border-blue-200',
          },
          {
            label: 'Completed',
            key: 'COMPLETED',
            color: 'bg-green-50 text-green-700 border-green-200',
          },
          {
            label: 'Cancelled',
            key: 'CANCELLED',
            color: 'bg-red-50 text-red-700 border-red-200',
          },
        ].map(({ label, key, color }) => (
          <div
            key={key}
            className={`${color} border rounded-xl p-4 text-center`}
          >
            <div className="text-2xl font-bold">{counts[key] || 0}</div>
            <div className="text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  'Customer',
                  'Vehicle',
                  'Date & Time',
                  'Notes',
                  'Status',
                  'Booked',
                  'Action',
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
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No test drive bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {booking.user?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.user?.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {booking.vehicle
                        ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatDate(booking.scheduledDate)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.scheduledTime}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {booking.notes || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusUpdate(booking.id, e.target.value)
                        }
                        disabled={updatingId === booking.id}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ),
                        )}
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
