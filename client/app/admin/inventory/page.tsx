// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { vehicleAPI } from '@/lib/api';
// import { Vehicle, PaginationInfo } from '@/types';
// import { useToast } from '@/context/ToastContext';
// import { formatPrice, getPrimaryImage } from '@/lib/utils';
// import Button from '@/components/ui/Button';
// import Badge from '@/components/ui/Badge';
// import Pagination from '@/components/ui/Pagination';
// import { Plus, Pencil, Trash2, Search } from 'lucide-react';

// export default function InventoryPage() {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, pages: 0 });
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   const fetchVehicles = async (page = 1) => {
//     setLoading(true);
//     try {
//       const params: any = { page, limit: 20, status: '' };
//       if (search) params.search = search;
//       const { data } = await vehicleAPI.getAll(params);
//       setVehicles(data.vehicles);
//       setPagination(data.pagination);
//     } catch {} finally { setLoading(false); }
//   };

//   useEffect(() => { fetchVehicles(); }, [search]);

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this vehicle?')) return;
//     try {
//       await vehicleAPI.delete(id);
//       setVehicles((prev) => prev.filter((v) => v.id !== id));
//       addToast('Vehicle deleted', 'success');
//     } catch (err: any) {
//       addToast(err.response?.data?.error || 'Failed to delete', 'error');
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-bold">Inventory Management</h1>
//         <Link href="/admin/inventory/new">
//           <Button><Plus className="w-4 h-4 mr-2" />Add Vehicle</Button>
//         </Link>
//       </div>

//       {/* Search */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search vehicles..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Vehicle</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">VIN</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Condition</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {loading ? (
//                 [...Array(5)].map((_, i) => (
//                   <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
//                 ))
//               ) : vehicles.length === 0 ? (
//                 <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No vehicles found</td></tr>
//               ) : (
//                 vehicles.map((v) => (
//                   <tr key={v.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
//                           <Image src={getPrimaryImage(v.images)} alt="" fill className="object-cover" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-sm">{v.year} {v.make} {v.model}</p>
//                           <p className="text-xs text-gray-500">{v.color} · {v.bodyType}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-600 font-mono">{v.vin}</td>
//                     <td className="px-4 py-3 text-sm font-medium">{formatPrice(v.price)}</td>
//                     <td className="px-4 py-3"><Badge status={v.condition} /></td>
//                     <td className="px-4 py-3"><Badge status={v.status} /></td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-1">
//                         <Link href={`/admin/inventory/new?edit=${v.id}`}>
//                           <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
//                             <Pencil className="w-4 h-4" />
//                           </button>
//                         </Link>
//                         <button onClick={() => handleDelete(v.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mt-4">
//         <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(p) => fetch

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { vehicleAPI } from '@/lib/api';
import { Vehicle, PaginationInfo } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchVehicles = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, status: '' };
      if (search) params.search = search;
      const { data } = await vehicleAPI.getAll(params);
      setVehicles(data.vehicles);
      setPagination(data.pagination);
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVehicles();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await vehicleAPI.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      addToast('Vehicle deleted', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Link href="/admin/inventory/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  VIN
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Condition
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-8 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No vehicles found
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getPrimaryImage(v.images)}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {v.year} {v.make} {v.model}
                          </p>
                          <p className="text-xs text-gray-500">
                            {v.color} · {v.bodyType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {v.vin}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatPrice(v.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={v.condition} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={v.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/admin/inventory/new?edit=${v.id}`}>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
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

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          onPageChange={(p) => fetchVehicles(p)}
        />
      </div>
    </div>
  );
}
