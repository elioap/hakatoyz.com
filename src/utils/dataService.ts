import { Product } from '../data/products';

// 數據服務類，提供統一的數據獲取接口
export class DataService {
  // 獲取所有產品
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to fetch products from API:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // 根據ID獲取產品
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to fetch product by ID:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // 根據類別獲取產品
  static async getProductsByCategory(category: string, locale: string = 'en'): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        category,
        locale
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to fetch products by category:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // 搜索產品
  static async searchProducts(query: string, locale: string = 'en'): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        locale
      });
      
      const response = await fetch(`/api/products/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to search products:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // 獲取熱門產品
  static async getHotProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products?tag=hot');
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to fetch hot products:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching hot products:', error);
      return [];
    }
  }

  // 獲取新品
  static async getNewProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products?tag=new');
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to fetch new products:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching new products:', error);
      return [];
    }
  }

  // 獲取限量產品
  static async getLimitedProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products?tag=limited');
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        console.error('Failed to fetch limited products:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching limited products:', error);
      return [];
    }
  }

  // 獲取特色產品（用於首頁展示）
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const response = await fetch(`/api/products?limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data?.slice(0, limit) || [];
      } else {
        console.error('Failed to fetch featured products:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }
}

// 便利函數，與現有代碼兼容
export const getAllProducts = () => DataService.getAllProducts();
export const getProductById = (id: number) => DataService.getProductById(id);
export const getProductsByCategory = (category: string, locale?: string) => 
  DataService.getProductsByCategory(category, locale);
export const searchProducts = (query: string, locale?: string) => 
  DataService.searchProducts(query, locale);
export const getHotProducts = () => DataService.getHotProducts();
export const getNewProducts = () => DataService.getNewProducts();
export const getLimitedProducts = () => DataService.getLimitedProducts();
export const getFeaturedProducts = (limit?: number) => DataService.getFeaturedProducts(limit); 