'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { VehicleImage } from '@/types';

interface ImageGalleryProps {
  images: VehicleImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images.length) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden bg-gray-100 h-96">
        <Image
          src={images[currentIndex].url}
          alt="Vehicle"
          fill
          className={`object-cover cursor-pointer transition-transform ${isZoomed ? 'scale-150' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + images.length) % images.length,
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                idx === currentIndex
                  ? 'border-primary-500'
                  : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
