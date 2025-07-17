import { NextApiRequest, NextApiResponse } from 'next';
import { DirectusService, convertDirectusToLocalBrand } from '../../../utils/directus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const brandId = parseInt(Array.isArray(id) ? id[0] : id || '0');
      
      // Only fetch from Directus
      const directusBrand = await DirectusService.getBrandById(brandId);
      let brand: any = null;
      
      if (directusBrand) {
        brand = convertDirectusToLocalBrand(directusBrand);
        console.log(`Found brand ${brandId} in Directus`);
      } else {
        console.log(`Brand ${brandId} not found in Directus`);
      }
      
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: brand,
        source: 'directus'
      });
    } catch (error) {
      console.error('Brand API Error:', error);
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