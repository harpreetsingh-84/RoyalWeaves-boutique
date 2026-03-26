const BASE_URL = import.meta.env.VITE_API_URL;
const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  return fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export const apiService = {
  // Auth
  login: (data: any) => apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data: any) => apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  googleAuth: (data: any) => apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  logout: () => fetch(`${BASE_URL}/api/auth/logout`, { // Special case for cookies sometimes needed
    method: 'POST',
    credentials: 'include'
  }),
  verifyAuth: () => fetch(`${BASE_URL}/api/auth/verify`, {
    credentials: 'include'
  }),
  updateCredentials: (data: any) => apiFetch('/api/auth/update-credentials', {
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include'
  }),

  // Products
  getProducts: () => fetch(`${BASE_URL}/api/products`),
  addProduct: (productData: any) => apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id: string, productData: any) => apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  deleteProduct: (id: string) => apiFetch(`/api/products/${id}`, {
    method: 'DELETE'
  }),

  // Categories
  getCategories: () => fetch(`${BASE_URL}/api/categories`),
  addCategory: (data: any) => apiFetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  }),

  // Orders & Analytics
  getOrders: () => fetch(`${BASE_URL}/api/orders`, { credentials: 'include' }),
  createOrder: (data: any) => apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  }),
  getAnalytics: () => fetch(`${BASE_URL}/api/analytics`, { credentials: 'include' }),

  // Upload
  upload: (formData: FormData) => fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }),
  uploadMultiple: (formData: FormData) => fetch(`${BASE_URL}/api/upload/multiple`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }),

  // CMS Content Management
  getContent: () => fetch(`${BASE_URL}/api/content`),
  updateContent: (data: any) => apiFetch('/api/content', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};
