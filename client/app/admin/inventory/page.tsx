'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { vehicleAPI } from '@/lib/api';
import { Vehicle, PaginationInfo } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { Plus, Trash2, Search, Star } from 'lucide-react';

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchVehicles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      else params.status = '';
      const { data } = await vehicleAPI.getAll(params);
      setVehicles(data.vehicles);
      setPagination(data.pagination);
    } catch {
      addToast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchVehicles(1), 300);
    return () => clearTimeout(t);
  }, [fetchVehicles]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle permanently?')) return;
    try {
      await vehicleAPI.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      addToast('Vehicle deleted', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} total vehicles</p>
        </div>
        <Link href="/admin/inventory/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Vehicle</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by make, model, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="PENDING">Pending</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Vehicle', 'VIN', 'Price', 'Mileage', 'Condition', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-10 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400">No vehicles found</td></tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image src={getPrimaryImage(v.images)} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-sm flex items-center gap-1">
                            {v.year} {v.make} {v.model}
                            {v.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                          </p>
                          <p className="text-xs text-gray-500">{v.color} · {v.bodyType} · {v.fuelType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{v.vin}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{formatPrice(v.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{v.mileage.toLocaleString()} mi</td>
                    <td className="px-4 py-3"><Badge status={v.condition} /></td>
                    <td className="px-4 py-3"><Badge status={v.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <Link href={`/vehicles/${v.id}`} target="_blank" className="text-xs text-primary-600 hover:text-primary-800 font-medium">View</Link>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-4">
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(p) => fetchVehicles(p)} />
        </div>
      )}
    </div>
  );
}