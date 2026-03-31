'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { vehicleAPI } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { Vehicle } from '@/types';

const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
const TRANSMISSIONS = ['AUTOMATIC', 'MANUAL'];
const BODY_TYPES = ['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN'];
const CONDITIONS = ['NEW', 'USED', 'CERTIFIED_PRE_OWNED'];
const STATUSES = ['AVAILABLE', 'RESERVED', 'PENDING', 'SOLD'];

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([
    { url: '', isPrimary: true },
  ]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    bodyType: 'SEDAN',
    color: '',
    vin: '',
    condition: 'NEW',
    status: 'AVAILABLE',
    description: '',
    isFeatured: false,
  });

  // Fetch vehicle data on mount
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await vehicleAPI.getById(vehicleId);
        const vehicle: Vehicle = data;

        // Populate form
        setForm({
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price.toString(),
          mileage: vehicle.mileage.toString(),
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          bodyType: vehicle.bodyType,
          color: vehicle.color,
          vin: vehicle.vin,
          condition: vehicle.condition,
          status: vehicle.status,
          description: vehicle.description || '',
          isFeatured: vehicle.isFeatured,
        });

        // Populate images
        if (vehicle.images && vehicle.images.length > 0) {
          setImages(
            vehicle.images.map((img) => ({
              url: img.url,
              isPrimary: img.isPrimary,
            })),
          );
        }

        // Populate features
        if (vehicle.features) {
          try {
            const parsedFeatures =
              typeof vehicle.features === 'string'
                ? JSON.parse(vehicle.features)
                : vehicle.features;
            if (Array.isArray(parsedFeatures) && parsedFeatures.length > 0) {
              setFeatures(parsedFeatures);
            }
          } catch (e) {
            console.error('Error parsing features:', e);
          }
        }

        setFetchLoading(false);
      } catch (err: any) {
        addToast(
          err?.response?.data?.message || 'Failed to load vehicle',
          'error',
        );
        router.push('/admin/inventory');
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, addToast, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (index: number, url: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, url } : img)),
    );
  };

  const handlePrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index })),
    );
  };

  const addImage = () =>
    setImages((prev) => [...prev, { url: '', isPrimary: false }]);
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  };

  const addFeature = () => setFeatures((prev) => [...prev, '']);
  const removeFeature = (index: number) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validImages = images.filter((img) => img.url.trim());
      const validFeatures = features.filter((f) => f.trim());

      await vehicleAPI.update(vehicleId, {
        ...form,
        year: parseInt(String(form.year)),
        price: parseFloat(form.price),
        mileage: parseInt(form.mileage),
        features: JSON.stringify(validFeatures),
        images: validImages,
      });

      addToast(
        `Vehicle "${form.year} ${form.make} ${form.model}" updated successfully!`,
        'success',
      );
      router.push('/admin/inventory');
    } catch (err: any) {
      addToast(
        err?.response?.data?.message || 'Failed to update vehicle',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-10 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Vehicle: {form.year} {form.make} {form.model}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Make *"
              name="make"
              value={form.make}
              onChange={handleChange}
              placeholder="e.g. Toyota"
              required
            />
            <Input
              label="Model *"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. Camry"
              required
            />
            <Input
              label="Year *"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              min={1980}
              max={new Date().getFullYear() + 1}
              required
            />
            <Input
              label="VIN *"
              name="vin"
              value={form.vin}
              onChange={handleChange}
              placeholder="Vehicle Identification Number"
              required
            />
            <Input
              label="Price ($) *"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="25000"
              min={0}
              required
            />
            <Input
              label="Mileage (km) *"
              name="mileage"
              type="number"
              value={form.mileage}
              onChange={handleChange}
              placeholder="0"
              min={0}
              required
            />
            <Input
              label="Color *"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="e.g. Midnight Black"
              required
            />
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Fuel Type', name: 'fuelType', options: FUEL_TYPES },
              {
                label: 'Transmission',
                name: 'transmission',
                options: TRANSMISSIONS,
              },
              { label: 'Body Type', name: 'bodyType', options: BODY_TYPES },
              { label: 'Condition', name: 'condition', options: CONDITIONS },
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <select
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-primary-600"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-gray-700"
              >
                Mark as Featured
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the vehicle..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Images</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImage}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Image
            </Button>
          </div>
          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="radio"
                    name="primaryImage"
                    checked={img.isPrimary}
                    onChange={() => handlePrimary(index)}
                    className="accent-primary-600"
                  />
                  Primary
                </label>
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="e.g. Bluetooth, Heated Seats..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/inventory">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
