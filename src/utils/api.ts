import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超時
});

// 添加請求攔截器處理認證token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Strapi API 方法
export const apiService = {
  // 產品相關 (Strapi Content Types)
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: number) => api.get(`/products/${id}?populate=*`),
  createProduct: (productData: any) => api.post('/products', { data: productData }),
  updateProduct: (id: number, productData: any) => api.put(`/products/${id}`, { data: productData }),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
  searchProducts: (query: string) => 
    api.get(`/products?filters[name][$containsi]=${encodeURIComponent(query)}&populate=*`),
  getProductsByCategory: (category: string) => 
    api.get(`/products?filters[category][$eq]=${encodeURIComponent(category)}&populate=*`),
  
  // 用戶相關 (Strapi Users-Permissions)
  login: (credentials: { identifier: string; password: string }) => 
    api.post('/auth/local', credentials),
  register: (userData: { username: string; email: string; password: string }) => 
    api.post('/auth/local/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/me'),
  updateProfile: (id: number, data: any) => api.put(`/users/${id}`, data),
  
  // 購物車相關 (需要在 Strapi 中創建 Cart content type)
  getCart: (userId: number) => api.get(`/carts?filters[user][id][$eq]=${userId}&populate=*`),
  addToCart: (productId: number, quantity: number = 1, userId: number) => 
    api.post('/carts', { 
      data: { 
        product: productId, 
        quantity, 
        user: userId 
      } 
    }),
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/carts/${itemId}`, { data: { quantity } }),
  removeFromCart: (itemId: number) => api.delete(`/carts/${itemId}`),
  
  // 訂單相關 (Strapi Orders)
  getOrders: async () => {
    return api.get('/orders?populate=*');
  },
  getOrder: async (id: number) => {
    return api.get(`/orders/${id}?populate=*`);
  },
  createOrder: async (orderData: any) => {
    return api.post('/orders', { data: orderData });
  },
  updateOrder: async (id: number, updateData: any) => {
    return api.put(`/orders/${id}`, { data: updateData });
  },
  deleteOrder: (orderId: number) => api.delete(`/orders/${orderId}`),

  // 類別相關
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData: any) => api.post('/categories', { data: categoryData }),
  updateCategory: (id: number, categoryData: any) => api.put(`/categories/${id}`, { data: categoryData }),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
  
  // 品牌相關
  getBrands: () => api.get('/brands'),
  createBrand: (brandData: any) => api.post('/brands', { data: brandData }),
  updateBrand: (id: number, brandData: any) => api.put(`/brands/${id}`, { data: brandData }),
  deleteBrand: (id: number) => api.delete(`/brands/${id}`),
};

export default api; 