'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { vehicleAPI } from '@/lib/api';
import { Vehicle, PaginationInfo } from '@/types';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import Pagination from '@/components/ui/Pagination';
import { VehicleCardSkeleton } from '@/components/ui/Skeleton';
import { Grid3X3, List, Search } from 'lucide-react';

function VehiclesContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key !== 'search') initial[key] = val;
    });
    return initial;
  });

  const fetchVehicles = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params: any = { page, limit: 12, sort, order, ...filters };
        if (search) params.search = search;
        // Remove empty values
        Object.keys(params).forEach((k) => {
          if (!params[k]) delete params[k];
        });
        const { data } = await vehicleAPI.getAll(params);
        setVehicles(data.vehicles);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters, search, sort, order],
  );

  useEffect(() => {
    fetchVehicles(1);
  }, [fetchVehicles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Vehicles</h1>
        <p className="text-gray-600 mt-1">
          {pagination.total} vehicles available
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24 bg-white rounded-xl p-4 shadow-sm border">
            <VehicleFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({})}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={`${sort}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSort(s);
                  setOrder(o);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest</option>
                <option value="year-asc">Year: Oldest</option>
                <option value="mileage-asc">Mileage: Low to High</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2.5 ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2.5 ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <VehicleFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({})}
            />
          </div>

          {/* Vehicle Grid/List */}
          {loading ? (
            <div
              className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              {[...Array(6)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">
                No vehicles found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearch('');
                }}
                className="mt-4 text-primary-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => fetchVehicles(p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VehiclesPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="h-9 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-5 bg-gray-100 rounded w-32 mt-2 animate-pulse" />
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<VehiclesPageSkeleton />}>
      <VehiclesContent />
    </Suspense>
  );
}
