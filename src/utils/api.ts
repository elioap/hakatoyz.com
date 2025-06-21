import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超時
});

// 添加請求攔截器處理認證token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在客戶端環境中獲取token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 添加響應攔截器處理錯誤
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 處理401未授權錯誤
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        // 可以重定向到登入頁面
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API方法
export const apiService = {
  // 產品相關
  getProducts: () => api.get('/products'),
  getProduct: (id: number) => api.get(`/products/${id}`),
  searchProducts: (query: string) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getProductsByCategory: (category: string) => api.get(`/products/category/${encodeURIComponent(category)}`),
  
  // 用戶相關
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string }) => 
    api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  
  // 購物車相關
  getCart: () => api.get('/cart'),
  addToCart: (productId: number, quantity: number = 1) => 
    api.post('/cart', { productId, quantity }),
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
  
  // 訂單相關
  getOrders: () => api.get('/orders'),
  getOrder: (orderId: number) => api.get(`/orders/${orderId}`),
  createOrder: (orderData: any) => api.post('/orders', orderData),
  updateOrder: (orderId: number, data: any) => api.put(`/orders/${orderId}`, data),
};

export default api; 