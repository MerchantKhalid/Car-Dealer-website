'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vehicleAPI, wishlistAPI, testDriveAPI, orderAPI } from '@/lib/api';
import { Vehicle } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ImageGallery from '@/components/vehicles/ImageGallery';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import {
  Heart,
  Calendar,
  Share2,
  Fuel,
  Gauge,
  Settings2,
  Car as CarIcon,
  Palette,
  Hash,
  CheckCircle2,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react';
import { formatPrice, formatMileage, parseFeatures } from '@/lib/utils';
import Link from 'next/link';

function VehicleDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [testDriveModal, setTestDriveModal] = useState(false);
  const [testDriveForm, setTestDriveForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await vehicleAPI.getById(id as string);
        setVehicle(data);
        if (user) {
          const { data: wl } = await wishlistAPI.check(id as string);
          setIsWishlisted(wl.isWishlisted);
        }
      } catch {
        router.push('/vehicles');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, user, router]);

  const toggleWishlist = async () => {
    if (!user) return router.push('/login');
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(vehicle!.id);
        setIsWishlisted(false);
        addToast('Removed from wishlist', 'info');
      } else {
        await wishlistAPI.add(vehicle!.id);
        setIsWishlisted(true);
        addToast('Added to wishlist!', 'success');
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Error updating wishlist', 'error');
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    setSubmitting(true);
    try {
      await testDriveAPI.book({ vehicleId: vehicle!.id, ...testDriveForm });
      addToast('Test drive booked successfully!', 'success');
      setTestDriveModal(false);
      setTestDriveForm({ scheduledDate: '', scheduledTime: '', notes: '' });
    } catch (err: any) {
      addToast(
        err.response?.data?.error || 'Failed to book test drive',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Purchase → create order → redirect to /checkout?orderId=xxx ──
  const handlePurchase = async () => {
    if (!user) return router.push('/login');
    setPurchasing(true);
    try {
      const { data: order } = await orderAPI.create({
        vehicleId: vehicle!.id,
        paymentMethod: 'stripe',
      });
      addToast('Order created! Redirecting to payment...', 'success');
      router.push(`/checkout?orderId=${order.id}`);
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to create order', 'error');
      setPurchasing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'info');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  const features = parseFeatures(vehicle.features);

  const specs = [
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    { icon: CarIcon, label: 'Body Type', value: vehicle.bodyType },
    { icon: Gauge, label: 'Mileage', value: formatMileage(vehicle.mileage) },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: Hash, label: 'VIN', value: vehicle.vin },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/vehicles"
          className="hover:text-primary-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <span>/</span>
        <span className="text-gray-900">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ImageGallery images={vehicle.images} />

        {/* Vehicle Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge status={vehicle.condition} />
                <Badge status={vehicle.status} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleWishlist}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="text-3xl font-bold text-primary-600 mt-4">
            {formatPrice(vehicle.price)}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <spec.icon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{vehicle.description}</p>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {vehicle.status === 'AVAILABLE' && (
            <div className="flex gap-3 mt-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={handlePurchase}
                loading={purchasing}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Purchase Vehicle
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setTestDriveModal(true)}
              >
                <Calendar className="w-5 h-5 mr-2" /> Test Drive
              </Button>
            </div>
          )}

          {/* Financing Calculator */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Estimated Monthly Payment
            </h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(Math.round(vehicle.price / 60))}/mo
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Based on 60 months, 5.9% APR, $0 down
            </p>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      <Modal
        isOpen={testDriveModal}
        onClose={() => setTestDriveModal(false)}
        title="Book a Test Drive"
        size="md"
      >
        <form onSubmit={handleTestDriveSubmit} className="space-y-4">
          <p className="text-gray-600">
            Schedule a test drive for the {vehicle.year} {vehicle.make}{' '}
            {vehicle.model}
          </p>
          <Input
            label="Preferred Date"
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={testDriveForm.scheduledDate}
            onChange={(e) =>
              setTestDriveForm({
                ...testDriveForm,
                scheduledDate: e.target.value,
              })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <select
              required
              value={testDriveForm.scheduledTime}
              onChange={(e) =>
                setTestDriveForm({
                  ...testDriveForm,
                  scheduledTime: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a time</option>
              {[
                '9:00 AM',
                '10:00 AM',
                '11:00 AM',
                '12:00 PM',
                '1:00 PM',
                '2:00 PM',
                '3:00 PM',
                '4:00 PM',
                '5:00 PM',
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={testDriveForm.notes}
              onChange={(e) =>
                setTestDriveForm({ ...testDriveForm, notes: e.target.value })
              }
              placeholder="Any special requests..."
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTestDriveModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Book Test Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function VehicleDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}

export default function VehicleDetailPage() {
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailContent />
    </Suspense>
  );
}
