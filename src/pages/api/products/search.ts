import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../data/products';
import { DirectusService, convertDirectusToLocalProduct } from '../../../utils/directus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      
      // 只從 Directus 搜索
      const directusResults = await DirectusService.searchProducts(query, localeStr);
      const searchResults: Product[] = directusResults.map(convertDirectusToLocalProduct);
      
      console.log(`Found ${searchResults.length} search results from Directus for "${query}"`);
      
      res.status(200).json({
        success: true,
        data: searchResults,
        query: query,
        locale: localeStr,
        total: searchResults.length,
        source: 'directus'
      });
    } catch (error) {
      console.error('Search API Error:', error);
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