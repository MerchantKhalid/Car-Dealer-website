'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  Link as LinkIcon,
  X,
  Star,
  StarOff,
  ImageOff,
} from 'lucide-react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

export interface ImageEntry {
  url: string;
  isPrimary: boolean;
}

interface Props {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [urlError, setUrlError] = useState('');

  // ── helpers ──────────────────────────────────────────────────────────────

  const setPrimary = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const remove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    // if we removed the primary, make first one primary
    if (images[index].isPrimary && next.length > 0) {
      next[0].isPrimary = true;
    }
    onChange(next);
  };

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed); // validate URL format
    } catch {
      setUrlError(
        'Please enter a valid URL (must start with http:// or https://)',
      );
      return;
    }
    setUrlError('');
    onChange([...images, { url: trimmed, isPrimary: images.length === 0 }]);
    setUrlInput('');
  };

  // ── file upload ───────────────────────────────────────────────────────────

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const token = localStorage.getItem('accessToken');
    const results: ImageEntry[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_BASE}/api/upload/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Upload failed:', err.error);
          continue;
        }

        const { url } = await res.json();
        results.push({ url, isPrimary: false });
      } catch (e) {
        console.error('Upload error:', e);
      }
    }

    if (results.length > 0) {
      const allImages = [...images, ...results];
      // if no primary set yet, make first one primary
      if (!allImages.some((img) => img.isPrimary)) {
        allImages[0].isPrimary = true;
      }
      onChange(allImages);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── drag & drop ───────────────────────────────────────────────────────────

  const [dragging, setDragging] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${
            dragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Click or drag images here to upload
            </p>
            <p className="text-xs text-gray-400">
              JPEG, PNG, WEBP, GIF — max 5 MB each
            </p>
          </div>
        )}
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setUrlError('');
            }}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addUrl(urlInput))
            }
            placeholder="Or paste an image URL and press Enter"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="button"
          onClick={() => addUrl(urlInput)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          Add URL
        </button>
      </div>
      {urlError && <p className="text-xs text-red-500 -mt-2">{urlError}</p>}

      {/* Image grid preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all
                ${
                  img.isPrimary
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-gray-200'
                }`}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-gray-100 relative">
                <ImagePreview url={img.url} />
              </div>

              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PRIMARY
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    title="Set as primary"
                    className="p-1.5 bg-white rounded-full text-yellow-500 hover:bg-yellow-50"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                {img.isPrimary && (
                  <button
                    type="button"
                    title="Primary image"
                    className="p-1.5 bg-white rounded-full text-yellow-500 cursor-default"
                  >
                    <StarOff className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  title="Remove image"
                  className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-xs text-gray-400 text-center">
          No images added yet. Upload from your device or paste a URL above.
        </p>
      )}
    </div>
  );
}

// ── tiny sub-component: shows image or broken-image icon ─────────────────────
function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
        <ImageOff className="w-6 h-6" />
        <span className="text-[10px]">Cannot load</span>
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt="Vehicle preview"
      fill
      className="object-cover"
      onError={() => setError(true)}
      unoptimized // skip Next.js optimisation for external/local URLs
    />
  );
}
