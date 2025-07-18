import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../data/products';
import { DirectusService, convertDirectusToLocalProduct } from '../../../utils/directus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const productId = parseInt(Array.isArray(id) ? id[0] : id || '0');
      
      // 只從 Directus 獲取產品
      const directusProduct = await DirectusService.getProductById(productId);
      let product: Product | null = null;
      
      if (directusProduct) {
        product = convertDirectusToLocalProduct(directusProduct);
        console.log(`Found product ${productId} in Directus`);
      } else {
        console.log(`Product ${productId} not found in Directus`);
      }
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: product,
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