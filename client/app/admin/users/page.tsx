'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { User } from '@/types';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import { Search, UserCheck, Shield, User as UserIcon } from 'lucide-react';

const ROLE_ICONS: Record<string, any> = {
  ADMIN: Shield,
  SALES_AGENT: UserCheck,
  CUSTOMER: UserIcon,
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  SALES_AGENT: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-gray-100 text-gray-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminAPI
      .getUsers()
      .then(({ data }) => {
        const list = data.users ?? data;
        setUsers(list);
        setFiltered(list);
      })
      .catch(() => addToast('Failed to load users', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = users;
    if (roleFilter !== 'ALL') {
      result = result.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, roleFilter, users]);

  const handleRoleUpdate = async (id: string, role: string) => {
    setUpdatingId(id);
    try {
      await adminAPI.updateUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role: role as User['role'] } : u,
        ),
      );
      addToast('User role updated', 'success');
    } catch {
      addToast('Failed to update user role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const roleCounts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <span className="text-sm text-gray-500">
          {users.length} total users
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Customers',
            role: 'CUSTOMER',
            color: 'bg-gray-50 border-gray-200',
          },
          {
            label: 'Sales Agents',
            role: 'SALES_AGENT',
            color: 'bg-blue-50 border-blue-200',
          },
          { label: 'Admins', role: 'ADMIN', color: 'bg-red-50 border-red-200' },
        ].map(({ label, role, color }) => {
          const Icon = ROLE_ICONS[role];
          return (
            <div
              key={role}
              className={`${color} border rounded-xl p-4 flex items-center gap-3`}
            >
              <Icon className="w-8 h-8 text-gray-500" />
              <div>
                <div className="text-2xl font-bold">
                  {roleCounts[role] || 0}
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="SALES_AGENT">Sales Agent</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  'User',
                  'Email',
                  'Phone',
                  'Role',
                  'Joined',
                  'Change Role',
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
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const Icon = ROLE_ICONS[user.role];
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {user.phone || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}
                        >
                          <Icon className="w-3 h-3" />
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleUpdate(user.id, e.target.value)
                          }
                          disabled={updatingId === user.id}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="SALES_AGENT">Sales Agent</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
