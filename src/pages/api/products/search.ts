import { NextApiRequest, NextApiResponse } from 'next';
import { products, Product } from '../../../data/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { q, locale = 'en' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const query = Array.isArray(q) ? q[0] : q;
      const localeStr = Array.isArray(locale) ? locale[0] : locale;
      
      const searchResults = products.filter(product => {
        const searchTerm = query.toLowerCase();
        
        // 根據語言進行搜索
        if (localeStr === 'zh') {
          return (
            product.name.zh.toLowerCase().includes(searchTerm) ||
            product.description.zh.toLowerCase().includes(searchTerm) ||
            product.category.zh.toLowerCase().includes(searchTerm) ||
            (product.features && product.features.some(feature => 
              feature.zh.toLowerCase().includes(searchTerm)
            ))
          );
        } else {
          return (
            product.name.en.toLowerCase().includes(searchTerm) ||
            product.description.en.toLowerCase().includes(searchTerm) ||
            product.category.en.toLowerCase().includes(searchTerm) ||
            (product.features && product.features.some(feature => 
              feature.en.toLowerCase().includes(searchTerm)
            ))
          );
        }
      });
      
      res.status(200).json({
        success: true,
        data: searchResults,
        query: query,
        locale: localeStr,
        total: searchResults.length
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