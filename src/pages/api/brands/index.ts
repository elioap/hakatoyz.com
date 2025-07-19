import { NextApiRequest, NextApiResponse } from 'next';
import { DirectusService, convertDirectusToLocalBrand } from '../../../utils/directus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { featured } = req.query;
      
      // 從 Directus 獲取品牌數據
      const directusBrands = await DirectusService.getBrands();
      let brands = directusBrands.map(convertDirectusToLocalBrand);
      
      // 如果請求特色品牌，過濾結果
      if (featured === 'true') {
        brands = brands.filter(brand => brand.featured);
      }
      
      console.log(`Found ${brands.length} brands from Directus${featured === 'true' ? ' (featured only)' : ''}`);
      
      res.status(200).json({
        success: true,
        data: brands,
        total: brands.length,
        source: 'directus'
      });
    } catch (error) {
      console.error('Brands API Error:', error);
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