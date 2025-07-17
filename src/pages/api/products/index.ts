import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../data/products';
import { DirectusService, convertDirectusToLocalProduct } from '../../../utils/directus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 獲取查詢參數
      const { category, tag, search, limit, page, locale } = req.query;
      
      let filteredProducts: Product[] = [];
      
      // 根據不同的查詢參數從 Directus 獲取數據
      if (search) {
        const searchStr = Array.isArray(search) ? search[0] : search;
        const localeStr = Array.isArray(locale) ? locale[0] : (locale || 'en');
        const directusProducts = await DirectusService.searchProducts(searchStr, localeStr);
        filteredProducts = directusProducts.map(convertDirectusToLocalProduct);
      } else if (category) {
        const categoryStr = Array.isArray(category) ? category[0] : category;
        const localeStr = Array.isArray(locale) ? locale[0] : (locale || 'en');
        const directusProducts = await DirectusService.getProductsByCategory(categoryStr, localeStr);
        filteredProducts = directusProducts.map(convertDirectusToLocalProduct);
      } else if (tag) {
        const tagStr = Array.isArray(tag) ? tag[0] : tag;
        const directusProducts = await DirectusService.getProductsByTag(tagStr);
        filteredProducts = directusProducts.map(convertDirectusToLocalProduct);
      } else {
        // 獲取所有產品
        const directusProducts = await DirectusService.getProducts();
        filteredProducts = directusProducts.map(convertDirectusToLocalProduct);
      }
      
      // Only return Directus data - no static fallback
      console.log(`Found ${filteredProducts.length} products from Directus`);
      
      // 分頁處理
      const pageNum = parseInt(Array.isArray(page) ? page[0] : page || '1');
      const limitNum = parseInt(Array.isArray(limit) ? limit[0] : limit || '10');
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      res.status(200).json({
        success: true,
        data: paginatedProducts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limitNum)
        },
        source: 'directus'
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
} 