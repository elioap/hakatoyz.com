import { NextApiRequest, NextApiResponse } from 'next';
import { products, Product } from '../../../data/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 獲取查詢參數
      const { category, tag, search, limit, page } = req.query;
      
      let filteredProducts = [...products];
      
      // 按類別篩選
      if (category) {
        const categoryStr = Array.isArray(category) ? category[0] : category;
        filteredProducts = filteredProducts.filter(product => 
          product.category.en.toLowerCase() === categoryStr.toLowerCase() ||
          product.category.zh === categoryStr
        );
      }
      
      // 按標籤篩選
      if (tag) {
        const tagStr = Array.isArray(tag) ? tag[0] : tag;
        filteredProducts = filteredProducts.filter(product => 
          product.tag === tagStr || 
          (product.tags && product.tags.includes(tagStr.toUpperCase()))
        );
      }
      
      // 搜索功能
      if (search) {
        const searchStr = Array.isArray(search) ? search[0] : search;
        filteredProducts = filteredProducts.filter(product =>
          product.name.en.toLowerCase().includes(searchStr.toLowerCase()) ||
          product.name.zh.includes(searchStr) ||
          product.description.en.toLowerCase().includes(searchStr.toLowerCase()) ||
          product.description.zh.includes(searchStr)
        );
      }
      
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
        }
      });
    } catch (error) {
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