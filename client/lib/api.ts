import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

// Vehicles
export const vehicleAPI = {
  getAll: (params?: any) => api.get('/vehicles', { params }),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  getFeatured: () => api.get('/vehicles/featured'),
  search: (q: string) => api.get('/vehicles/search', { params: { q } }),
  getMakes: () => api.get('/vehicles/makes'),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Orders
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: any) =>
    api.put(`/orders/${id}/status`, data),
  cancel: (id: string) => api.delete(`/orders/${id}`),
};

// Test Drives
export const testDriveAPI = {
  book: (data: any) => api.post('/test-drives', data),
  getAll: () => api.get('/test-drives'),
  update: (id: string, data: any) => api.put(`/test-drives/${id}`, data),
  cancel: (id: string) => api.delete(`/test-drives/${id}`),
};

// Wishlist
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (vehicleId: string) => api.post('/wishlist', { vehicleId }),
  remove: (vehicleId: string) => api.delete(`/wishlist/${vehicleId}`),
  check: (vehicleId: string) => api.get(`/wishlist/check/${vehicleId}`),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  getReports: (params?: any) => api.get('/admin/reports', { params }),
};

// Payments
export const paymentAPI = {
  createIntent: (orderId: string) =>
    api.post('/payments/create-intent', { orderId }),
  getStatus: (orderId: string) => api.get(`/payments/${orderId}/status`),
};

export default api;
