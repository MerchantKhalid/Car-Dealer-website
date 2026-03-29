'use client';

import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { vehicleAPI } from '@/lib/api';

interface FiltersProps {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
  onReset: () => void;
}

export default function VehicleFilters({
  filters,
  onChange,
  onReset,
}: FiltersProps) {
  const [makes, setMakes] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    vehicleAPI
      .getMakes()
      .then(({ data }) => setMakes(data))
      .catch(() => {});
  }, []);

  const update = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-primary-600 hover:underline"
        >
          Reset All
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Make
        </label>
        <select
          value={filters.make || ''}
          onChange={(e) => update('make', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body Type
        </label>
        <select
          value={filters.bodyType || ''}
          onChange={(e) => update('bodyType', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          {['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition
        </label>
        <select
          value={filters.condition || ''}
          onChange={(e) => update('condition', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Conditions</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
          <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fuel Type
        </label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => update('fuelType', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Fuel Types</option>
          {['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transmission
        </label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => update('transmission', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All</option>
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Min Price"
          type="number"
          placeholder="0"
          value={filters.priceMin || ''}
          onChange={(e) => update('priceMin', e.target.value)}
        />
        <Input
          label="Max Price"
          type="number"
          placeholder="Any"
          value={filters.priceMax || ''}
          onChange={(e) => update('priceMax', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Min Year"
          type="number"
          placeholder="2000"
          value={filters.yearMin || ''}
          onChange={(e) => update('yearMin', e.target.value)}
        />
        <Input
          label="Max Year"
          type="number"
          placeholder="2024"
          value={filters.yearMax || ''}
          onChange={(e) => update('yearMax', e.target.value)}
        />
      </div>

      <Input
        label="Max Mileage"
        type="number"
        placeholder="Any"
        value={filters.mileageMax || ''}
        onChange={(e) => update('mileageMax', e.target.value)}
      />
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Mobile filter drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{filterContent}</div>
    </>
  );
}
