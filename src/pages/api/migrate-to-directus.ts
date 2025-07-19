import { NextApiRequest, NextApiResponse } from 'next';
import { products } from '../../data/products';
import { DirectusService, convertLocalToDirectusProduct } from '../../utils/directus';

interface MigrationResult {
  id: number;
  name: string;
  directus_id: number | undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const results: { success: MigrationResult[] } = {
        success: [],
      };

      console.log(`Starting migration of ${products.length} products to Directus...`);

      for (const product of products) {
        try {
          // Convert local product format to Directus format
          const directusProductData = convertLocalToDirectusProduct(product);
          
          // Create product in Directus
          const createdProduct = await DirectusService.createProduct(directusProductData);
          
          if (createdProduct && createdProduct.id && typeof createdProduct.id === 'number') {
            results.success.push({
              id: product.id,
              name: product.name.en,
              directus_id: createdProduct.id
            });
            console.log(`✅ Migrated product: ${product.name.en} (ID: ${product.id} -> Directus ID: ${createdProduct.id})`);
          } else {
            results.success.push({
              id: product.id,
              name: product.name.en,
              directus_id: undefined
            });
            console.log(`❌ Failed to migrate product: ${product.name.en} (ID: ${product.id})`);
          }
        } catch (error) {
          results.success.push({
            id: product.id,
            name: product.name.en,
            directus_id: undefined
          });
          console.log(`❌ Error migrating product: ${product.name.en} (ID: ${product.id}) - ${error}`);
        }
      }

      const successful = results.success.filter(item => item.directus_id !== undefined);
      const failed = results.success.filter(item => item.directus_id === undefined);

      console.log(`Migration completed: ${successful.length} successful, ${failed.length} failed`);

      res.status(200).json({
        success: true,
        message: 'Migration completed',
        results: {
          successful: successful.length,
          failed: failed.length,
          total: products.length,
          details: results
        }
      });

    } catch (error) {
      console.error('Migration error:', error);
      res.status(500).json({
        success: false,
        message: 'Migration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // 提供遷移狀態和說明
    res.status(200).json({
      message: 'Product Migration API',
      description: 'Use POST to migrate products from static data to Directus',
      staticProductsCount: products.length,
      endpoint: '/api/migrate-to-directus',
      instructions: {
        method: 'POST',
        description: 'This will migrate all products from the static data file to your Directus instance',
        warning: 'Make sure your Directus instance is properly configured and accessible'
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
} 