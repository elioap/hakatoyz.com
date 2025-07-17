import { NextApiRequest, NextApiResponse } from 'next';
import { DirectusService, convertLocalToDirectusBrand } from '../../utils/directus';

// Static brand data from the codebase
const staticBrands = [
  { name: "Funko", featured: true, sortOrder: 1 },
  { name: "Hot Topic", logo: "/images/brands/hot-topic.png", featured: true, sortOrder: 2 },
  { name: "BoxLunch", logo: "/images/brands/boxlunch.png", featured: true, sortOrder: 3 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const results = {
        success: [] as any[],
        failed: [] as any[],
        total: staticBrands.length
      };

      console.log(`Starting migration of ${staticBrands.length} brands to Directus...`);

      for (const brand of staticBrands) {
        try {
          // Convert local brand format to Directus format
          const directusBrandData = convertLocalToDirectusBrand({
            name: brand.name,
            logo: brand.logo || `/images/brands/${brand.name.toLowerCase().replace(/[@\s]/g, '').replace('&', '')}.png`,
            description: `${brand.name} is a featured brand in our collection.`,
            website: '',
            featured: brand.featured,
            sortOrder: brand.sortOrder
          });
          
          // Create brand in Directus
          const createdBrand = await DirectusService.createBrand(directusBrandData);
          
          if (createdBrand) {
            results.success.push({
              name: brand.name,
              directus_id: createdBrand.id,
              featured: brand.featured
            });
            console.log(`✅ Migrated brand: ${brand.name} (Directus ID: ${createdBrand.id})`);
          } else {
            results.failed.push({
              name: brand.name,
              error: 'Failed to create in Directus'
            });
            console.log(`❌ Failed to migrate brand: ${brand.name}`);
          }
        } catch (error) {
          results.failed.push({
            name: brand.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.log(`❌ Error migrating brand: ${brand.name} - ${error}`);
        }
      }

      console.log(`Brand migration completed: ${results.success.length} successful, ${results.failed.length} failed`);

      res.status(200).json({
        success: true,
        message: 'Brand migration completed',
        results: {
          successful: results.success.length,
          failed: results.failed.length,
          total: results.total,
          details: results
        }
      });

    } catch (error) {
      console.error('Brand migration error:', error);
      res.status(500).json({
        success: false,
        message: 'Brand migration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // Provide migration status and information
    res.status(200).json({
      message: 'Brand Migration API',
      description: 'Use POST to migrate brands from static data to Directus',
      staticBrandsCount: staticBrands.length,
      endpoint: '/api/migrate-brands-to-directus',
      instructions: {
        method: 'POST',
        description: 'This will migrate all brands from the static data to your Directus instance',
        warning: 'Make sure your Directus instance is properly configured and accessible'
      },
      brands: staticBrands.map(b => ({ name: b.name, featured: b.featured }))
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
} 