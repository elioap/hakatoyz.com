import { Product } from '../data/products';
import { apiService } from './api';

// 數據服務類，提供統一的數據獲取接口
export class DataService {
  // 獲取所有產品
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiService.getProducts();
      // Strapi 響應格式: { data: [...], meta: {...} }
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getAllProducts } = await import('../data/products');
      return getAllProducts();
    }
  }

  // 根據ID獲取產品
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await apiService.getProduct(id);
      const item = response.data.data;
      if (!item) return null;
      
      return {
        id: item.id,
        ...item.attributes
      };
    } catch (error) {
      console.warn('API獲取產品詳情失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getProductById } = await import('../data/products');
      return getProductById(id) || null;
    }
  }

  // 根據類別獲取產品
  static async getProductsByCategory(category: string, locale: string = 'en'): Promise<Product[]> {
    try {
      const response = await apiService.getProductsByCategory(category);
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取分類產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getProductsByCategory } = await import('../data/products');
      return getProductsByCategory(category, locale);
    }
  }

  // 搜索產品
  static async searchProducts(query: string, locale: string = 'en'): Promise<Product[]> {
    try {
      const response = await apiService.searchProducts(query);
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API搜索產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { searchProducts } = await import('../data/products');
      return searchProducts(query, locale);
    }
  }

  // 獲取熱門產品
  static async getHotProducts(): Promise<Product[]> {
    try {
      const response = await apiService.getProducts({
        'filters[tag][$eq]': 'hot',
        'populate': '*'
      });
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取熱門產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getHotProducts } = await import('../data/products');
      return getHotProducts();
    }
  }

  // 獲取新品
  static async getNewProducts(): Promise<Product[]> {
    try {
      const response = await apiService.getProducts({
        'filters[tag][$eq]': 'new',
        'populate': '*'
      });
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取新品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getNewProducts } = await import('../data/products');
      return getNewProducts();
    }
  }

  // 獲取限量產品
  static async getLimitedProducts(): Promise<Product[]> {
    try {
      const response = await apiService.getProducts({
        'filters[tag][$eq]': 'limited',
        'populate': '*'
      });
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取限量產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { getLimitedProducts } = await import('../data/products');
      return getLimitedProducts();
    }
  }

  // 獲取特色產品（用於首頁展示）
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const response = await apiService.getProducts({
        'pagination[limit]': limit,
        'sort': 'createdAt:desc',
        'populate': '*'
      });
      return response.data.data?.map((item: any) => ({
        id: item.id,
        ...item.attributes
      })) || [];
    } catch (error) {
      console.warn('API獲取特色產品失敗，使用靜態數據:', error);
      // 後備到靜態數據
      const { products } = await import('../data/products');
      const featured = products
        .filter((product: Product) => product.tag || product.tags?.length)
        .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return featured.slice(0, limit);
    }
  }
}

// 導出便捷方法
export const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getHotProducts,
  getNewProducts,
  getLimitedProducts,
  getFeaturedProducts
} = DataService; 