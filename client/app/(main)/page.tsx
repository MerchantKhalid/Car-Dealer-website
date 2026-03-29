'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { vehicleAPI } from '@/lib/api';
import { Vehicle } from '@/types';
import VehicleCard from '@/components/vehicles/VehicleCard';
import Button from '@/components/ui/Button';
import { VehicleCardSkeleton } from '@/components/ui/Skeleton';
import {
  Search,
  ArrowRight,
  Shield,
  Award,
  Headphones,
  Car,
  Truck,
  Zap,
  ChevronRight,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [latest, setLatest] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          vehicleAPI.getFeatured(),
          vehicleAPI.getAll({ limit: 4, sort: 'createdAt', order: 'desc' }),
        ]);
        setFeatured(featuredRes.data);
        setLatest(latestRes.data.vehicles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const bodyTypes = [
    { name: 'Sedan', icon: Car, type: 'SEDAN' },
    { name: 'SUV', icon: Car, type: 'SUV' },
    { name: 'Truck', icon: Truck, type: 'TRUCK' },
    { name: 'Electric', icon: Zap, type: 'ELECTRIC' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="text-primary-400"> Drive</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-2xl">
              Browse our premium selection of vehicles. From sleek sedans to
              powerful trucks, we have the car that fits your lifestyle.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex gap-2">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/vehicles?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
              <Link
                href={`/vehicles${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
              >
                <Button size="lg" className="h-full px-8 text-lg">
                  Search
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 mt-10 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary-400">500+</div>
                <div className="text-gray-400">Vehicles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">
                  2,000+
                </div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">15+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyTypes.map((bt) => (
              <Link
                key={bt.type}
                href={`/vehicles?${bt.type === 'ELECTRIC' ? 'fuelType' : 'bodyType'}=${bt.type}`}
                className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-md transition-all"
              >
                <bt.icon className="w-10 h-10 text-gray-400 group-hover:text-primary-600 transition-colors" />
                <span className="mt-3 font-semibold text-gray-700 group-hover:text-primary-600">
                  {bt.name}
                </span>
                <ChevronRight className="w-4 h-4 mt-1 text-gray-400 group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Vehicles</h2>
            <Link
              href="/vehicles"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => <VehicleCardSkeleton key={i} />)
              : featured
                  .slice(0, 8)
                  .map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose DriveHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Certified Quality',
                desc: 'Every vehicle undergoes rigorous inspection before listing.',
              },
              {
                icon: Award,
                title: 'Best Prices',
                desc: 'Competitive pricing with transparent no-haggle deals.',
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                desc: 'Our team is always here to help with your purchase.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Arrivals</h2>
            <Link
              href="/vehicles?sort=createdAt&order=desc"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              See More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => <VehicleCardSkeleton key={i} />)
              : latest.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Michael R.',
                text: 'Found my dream car at an amazing price. The process was seamless!',
                rating: 5,
              },
              {
                name: 'Sarah L.',
                text: 'Professional service from start to finish. Highly recommend DriveHub!',
                rating: 5,
              },
              {
                name: 'David K.',
                text: 'Great selection and transparent pricing. Will buy my next car here too.',
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Car?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Browse our inventory or schedule a test drive today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/vehicles">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Browse Inventory
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
