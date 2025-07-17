import { createDirectus, rest, readItems, readItem, createItem, updateItem, deleteItem, staticToken } from '@directus/sdk';

// Directus client configuration
const directus = createDirectus(process.env.DIRECTUS_URL || 'https://directus-production-619f.up.railway.app')
  .with(rest({
    credentials: 'include',
  }))
  .with(staticToken(process.env.DIRECTUS_TOKEN || 'zh5SYQSXdWpZzgxLDGh4mGGYBHm1TimE'));

// Type definitions for Directus collections
export interface DirectusProduct {
  id?: number;
  name_zh: string;
  name_en: string;
  price: number;
  original_price?: number;
  category_zh: string;
  category_en: string;
  image: string;
  images?: string[];
  description_zh: string;
  description_en: string;
  specs?: any[];
  features?: any[];
  tag?: 'hot' | 'new' | 'limited' | null;
  tags?: string[];
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
  status?: 'published' | 'draft' | 'archived';
}

export interface DirectusBrand {
  id?: number;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  featured: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// Product service functions
export const DirectusService = {
  // Get all products
  async getProducts(): Promise<DirectusProduct[]> {
    try {
      const response = await directus.request(
        readItems('product', {
          sort: ['id']
        })
      );
      return response as DirectusProduct[];
    } catch (error) {
      console.error('Error fetching products from Directus:', error);
      return [];
    }
  },

  // Get product by ID
  async getProductById(id: number): Promise<DirectusProduct | null> {
    try {
      const response = await directus.request(
        readItem('product', id)
      );
      return response as DirectusProduct;
    } catch (error) {
      console.error(`Error fetching product ${id} from Directus:`, error);
      return null;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string, locale: string = 'en'): Promise<DirectusProduct[]> {
    try {
      const categoryField = locale === 'zh' ? 'category_zh' : 'category_en';
      const response = await directus.request(
        readItems('product', {
          filter: {
            [categoryField]: {
              _icontains: category
            }
          },
          sort: ['id']
        })
      );
      return response as DirectusProduct[];
    } catch (error) {
      console.error('Error fetching products by category from Directus:', error);
      return [];
    }
  },

  // Search products
  async searchProducts(query: string, locale: string = 'en'): Promise<DirectusProduct[]> {
    try {
      const nameField = locale === 'zh' ? 'name_zh' : 'name_en';
      const descField = locale === 'zh' ? 'description_zh' : 'description_en';
      
      const response = await directus.request(
        readItems('product', {
          filter: {
            _or: [
              {
                [nameField]: {
                  _icontains: query
                }
              },
              {
                [descField]: {
                  _icontains: query
                }
              }
            ]
          },
          sort: ['id']
        })
      );
      return response as DirectusProduct[];
    } catch (error) {
      console.error('Error searching products in Directus:', error);
      return [];
    }
  },

  // Get products by tag
  async getProductsByTag(tag: string): Promise<DirectusProduct[]> {
    try {
      const response = await directus.request(
        readItems('product', {
          filter: {
            _or: [
              {
                tag: {
                  _eq: tag
                }
              },
              {
                tags: {
                  _contains: tag
                }
              }
            ]
          },
          sort: ['id']
        })
      );
      return response as DirectusProduct[];
    } catch (error) {
      console.error('Error fetching products by tag from Directus:', error);
      return [];
    }
  },

  // Create new product (admin function)
  async createProduct(productData: Omit<DirectusProduct, 'id' | 'created_at' | 'updated_at'>): Promise<DirectusProduct | null> {
    try {
      const response = await directus.request(
        createItem('product', productData)
      );
      return response as DirectusProduct;
    } catch (error) {
      console.error('Error creating product in Directus:', error);
      return null;
    }
  },

  // Update product (admin function)
  async updateProduct(id: number, productData: Partial<DirectusProduct>): Promise<DirectusProduct | null> {
    try {
      const response = await directus.request(
        updateItem('product', id, productData)
      );
      return response as DirectusProduct;
    } catch (error) {
      console.error('Error updating product in Directus:', error);
      return null;
    }
  },

  // Delete product (admin function)
  async deleteProduct(id: number): Promise<boolean> {
    try {
      await directus.request(deleteItem('product', id));
      return true;
    } catch (error) {
      console.error('Error deleting product from Directus:', error);
      return false;
    }
  },

  // Brand service functions
  // Get all brands
  async getBrands(): Promise<DirectusBrand[]> {
    try {
      const response = await directus.request(
        readItems('brand', {
          sort: ['sort_order', 'name']
        })
      );
      return response as DirectusBrand[];
    } catch (error) {
      console.error('Error fetching brands from Directus:', error);
      return [];
    }
  },

  // Get featured brands
  async getFeaturedBrands(): Promise<DirectusBrand[]> {
    try {
      const response = await directus.request(
        readItems('brand', {
          filter: {
            featured: {
              _eq: true
            }
          },
          sort: ['sort_order', 'name']
        })
      );
      return response as DirectusBrand[];
    } catch (error) {
      console.error('Error fetching featured brands from Directus:', error);
      return [];
    }
  },

  // Get brand by ID
  async getBrandById(id: number): Promise<DirectusBrand | null> {
    try {
      const response = await directus.request(
        readItem('brand', id)
      );
      return response as DirectusBrand;
    } catch (error) {
      console.error(`Error fetching brand ${id} from Directus:`, error);
      return null;
    }
  },

  // Create new brand (admin function)
  async createBrand(brandData: Omit<DirectusBrand, 'id' | 'created_at' | 'updated_at'>): Promise<DirectusBrand | null> {
    try {
      const response = await directus.request(
        createItem('brand', brandData)
      );
      return response as DirectusBrand;
    } catch (error) {
      console.error('Error creating brand in Directus:', error);
      return null;
    }
  },

  // Update brand (admin function)
  async updateBrand(id: number, brandData: Partial<DirectusBrand>): Promise<DirectusBrand | null> {
    try {
      const response = await directus.request(
        updateItem('brand', id, brandData)
      );
      return response as DirectusBrand;
    } catch (error) {
      console.error('Error updating brand in Directus:', error);
      return null;
    }
  },

  // Delete brand (admin function)
  async deleteBrand(id: number): Promise<boolean> {
    try {
      await directus.request(deleteItem('brand', id));
      return true;
    } catch (error) {
      console.error('Error deleting brand from Directus:', error);
      return false;
    }
  }
};

// Utility function to convert Directus product to local product format
export function convertDirectusToLocalProduct(directusProduct: DirectusProduct): any {
  return {
    id: directusProduct.id,
    name: {
      zh: directusProduct.name_zh,
      en: directusProduct.name_en
    },
    price: directusProduct.price,
    originalPrice: directusProduct.original_price,
    category: {
      zh: directusProduct.category_zh,
      en: directusProduct.category_en
    },
    image: directusProduct.image,
    images: directusProduct.images || [directusProduct.image],
    description: {
      zh: directusProduct.description_zh,
      en: directusProduct.description_en
    },
    specs: directusProduct.specs || [],
    features: directusProduct.features || [],
    tag: directusProduct.tag,
    tags: directusProduct.tags || [],
    inStock: directusProduct.in_stock,
    createdAt: directusProduct.created_at,
    updatedAt: directusProduct.updated_at
  };
}

// Utility function to convert local product to Directus format
export function convertLocalToDirectusProduct(localProduct: any): Omit<DirectusProduct, 'id' | 'created_at' | 'updated_at'> {
  return {
    name_zh: localProduct.name.zh,
    name_en: localProduct.name.en,
    price: localProduct.price,
    original_price: localProduct.originalPrice,
    category_zh: localProduct.category.zh,
    category_en: localProduct.category.en,
    image: localProduct.image,
    images: localProduct.images,
    description_zh: localProduct.description.zh,
    description_en: localProduct.description.en,
    specs: localProduct.specs,
    features: localProduct.features,
    tag: localProduct.tag,
    tags: localProduct.tags,
    in_stock: localProduct.inStock
  };
}

// Utility function to convert Directus brand to local brand format
export function convertDirectusToLocalBrand(directusBrand: DirectusBrand): any {
  return {
    id: directusBrand.id,
    name: directusBrand.name,
    logo: directusBrand.logo,
    description: directusBrand.description,
    website: directusBrand.website,
    featured: directusBrand.featured,
    sortOrder: directusBrand.sort_order,
    createdAt: directusBrand.created_at,
    updatedAt: directusBrand.updated_at
  };
}

// Utility function to convert local brand to Directus format
export function convertLocalToDirectusBrand(localBrand: any): Omit<DirectusBrand, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: localBrand.name,
    logo: localBrand.logo,
    description: localBrand.description,
    website: localBrand.website,
    featured: localBrand.featured || false,
    sort_order: localBrand.sortOrder || 0
  };
}

export default DirectusService; 