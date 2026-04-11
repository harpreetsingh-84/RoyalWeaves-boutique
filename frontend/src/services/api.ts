const BASE_URL = import.meta.env.VITE_API_URL || '';

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  // 15 seconds timeout
  const id = setTimeout(() => controller.abort(), 15000); 
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    console.error("Fetch Error:", error.message || error);
    // Return a fake response that fails ok check so app continues instead of crashing
    return { ok: false, status: 504, json: async () => ({ message: 'Request Timeout' }) } as Response;
  }
};

const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers } as any;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers,
  });
};

export const apiService = {
  // Generic Methods
  get: (endpoint: string) => fetchWithTimeout(`${BASE_URL}${endpoint}`, { credentials: 'include' }),
  post: (endpoint: string, data: any) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiFetch(endpoint, { method: 'DELETE' }),

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
  logout: () => fetchWithTimeout(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  }),
  verifyAuth: () => fetchWithTimeout(`${BASE_URL}/api/auth/verify`, {
    credentials: 'include'
  }),
  sendAdminOtp: (data: { action: 'update' | 'add', targetEmail: string }) => apiFetch('/api/auth/send-admin-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verifyAdminAction: (data: { action: 'update' | 'add', targetEmail: string, otp: string }) => apiFetch('/api/auth/verify-admin-action', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Products
  getProducts: () => fetchWithTimeout(`${BASE_URL}/api/products`),
  getAdminProducts: () => fetchWithTimeout(`${BASE_URL}/api/products/admin`, { credentials: 'include' }),
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
  getCategories: () => fetchWithTimeout(`${BASE_URL}/api/categories`),
  addCategory: (data: any) => apiFetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteCategory: (id: string) => apiFetch(`/api/categories/${id}`, {
    method: 'DELETE'
  }),

  // Orders & Analytics
  getOrders: () => fetchWithTimeout(`${BASE_URL}/api/orders`, { credentials: 'include' }),
  getMyOrders: () => fetchWithTimeout(`${BASE_URL}/api/orders/myorders`, { credentials: 'include' }),
  getOrderById: (id: string) => fetchWithTimeout(`${BASE_URL}/api/orders/${id}`, { credentials: 'include' }),
  updateOrderStatus: (id: string, statuses: {status?: string, paymentStatus?: string, orderStatus?: string}) => apiFetch(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statuses),
  }),
  createOrder: (data: any) => apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAnalytics: () => fetchWithTimeout(`${BASE_URL}/api/analytics`, { credentials: 'include' }),

  // Upload
  upload: (formData: FormData) => apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  }),
  uploadMultiple: (formData: FormData) => apiFetch('/api/upload/multiple', {
    method: 'POST',
    body: formData,
  }),

  // CMS Content Management
  getContent: () => fetchWithTimeout(`${BASE_URL}/api/content`),
  updateContent: (data: any) => apiFetch('/api/content', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // User Management
  getUsers: () => fetchWithTimeout(`${BASE_URL}/api/users`, { credentials: 'include' }),
  blockUser: (id: string, isBlocked: boolean) => apiFetch(`/api/users/${id}/block`, {
    method: 'PUT',
    body: JSON.stringify({ isBlocked }),
  }),
  deleteUser: (id: string) => apiFetch(`/api/users/${id}`, {
    method: 'DELETE',
  }),

  // Admin Management
  getAdmins: () => fetchWithTimeout(`${BASE_URL}/api/users/admins`, { credentials: 'include' }),
  removeAdmin: (id: string) => apiFetch(`/api/users/admins/${id}`, {
    method: 'DELETE',
  }),
};
