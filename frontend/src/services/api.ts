const BASE_URL = 'https://royalweaves-boutique.onrender.com/api';

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
  login: (data: any) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data: any) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  googleAuth: (data: any) => apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  logout: () => fetch(`${BASE_URL}/auth/logout`, { // Special case for cookies sometimes needed
    method: 'POST',
    credentials: 'include'
  }),
  verifyAuth: () => fetch(`${BASE_URL}/auth/verify`, {
    credentials: 'include'
  }),
  updateCredentials: (data: any) => apiFetch('/auth/update-credentials', {
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include'
  }),

  // Products
  getProducts: () => fetch(`${BASE_URL}/products`),
  addProduct: (productData: any) => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id: string, productData: any) => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  deleteProduct: (id: string) => apiFetch(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Orders & Analytics
  getOrders: () => fetch(`${BASE_URL}/orders`, { credentials: 'include' }),
  createOrder: (data: any) => apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  }),
  getAnalytics: () => fetch(`${BASE_URL}/analytics`, { credentials: 'include' }),

  // Upload
  upload: (formData: FormData) => fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }),
  uploadMultiple: (formData: FormData) => fetch(`${BASE_URL}/upload/multiple`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }),

  // CMS Content Management
  getContent: () => fetch(`${BASE_URL}/content`),
  updateContent: (data: any) => apiFetch('/content', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};
