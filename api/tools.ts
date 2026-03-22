import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  try {
    switch (req.method) {
      case 'GET': {
        const { category, popular } = req.query;
        
        let rows;
        if (popular === 'true') {
          rows = await sql`
            SELECT t.*, c.name as category_name
            FROM tools t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.popular = true
            ORDER BY t.name ASC
          `;
        } else if (category) {
          rows = await sql`
            SELECT t.*, c.name as category_name
            FROM tools t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE c.name = ${category as string}
            ORDER BY t.name ASC
          `;
        } else {
          rows = await sql`
            SELECT t.*, c.name as category_name
            FROM tools t
            LEFT JOIN categories c ON t.category_id = c.id
            ORDER BY t.name ASC
          `;
        }

        const tools = rows.map(mapToolRow);
        return res.status(200).json(tools);
      }

      case 'POST': {
        const tool = req.body;
        const result = await sql`
          INSERT INTO tools (id, name, slug, category_id, badge, pricing_tier, pricing_amount, verdict,
            features, pros, cons, external_link, image, rating, api_available, open_source, mobile_app, popular)
          VALUES (${tool.id}, ${tool.name}, ${tool.slug}, ${tool.categoryId || null}, ${tool.badge},
            ${tool.pricingTier}, ${tool.pricingAmount}, ${tool.verdict},
            ${JSON.stringify(tool.features || [])}::jsonb,
            ${JSON.stringify(tool.pros || [])}::jsonb, 
            ${JSON.stringify(tool.cons || [])}::jsonb,
            ${tool.externalLink || ''}, ${tool.image || ''}, ${tool.rating || 0},
            ${tool.apiAvailable || false}, ${tool.openSource || false}, ${tool.mobileApp || false},
            ${tool.popular || false})
          RETURNING *
        `;
        return res.status(201).json(mapToolRow(result[0]));
      }

      case 'PUT': {
        const tool = req.body;
        const result = await sql`
          UPDATE tools SET 
            name = ${tool.name}, slug = ${tool.slug}, category_id = ${tool.categoryId || null},
            badge = ${tool.badge}, pricing_tier = ${tool.pricingTier}, pricing_amount = ${tool.pricingAmount},
            verdict = ${tool.verdict},
            features = ${JSON.stringify(tool.features || [])}::jsonb,
            pros = ${JSON.stringify(tool.pros || [])}::jsonb,
            cons = ${JSON.stringify(tool.cons || [])}::jsonb,
            external_link = ${tool.externalLink || ''}, image = ${tool.image || ''},
            rating = ${tool.rating || 0}, api_available = ${tool.apiAvailable || false},
            open_source = ${tool.openSource || false}, mobile_app = ${tool.mobileApp || false},
            popular = ${tool.popular || false},
            updated_at = NOW()
          WHERE id = ${tool.id}
          RETURNING *
        `;
        return res.status(200).json(mapToolRow(result[0]));
      }

      case 'DELETE': {
        const deleteId = req.query.id as string;
        if (!deleteId) return res.status(400).json({ error: 'Missing id' });
        await sql`DELETE FROM tools WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Tools API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Map DB row (snake_case) → frontend Tool (camelCase)
function mapToolRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_name || '',
    categoryId: row.category_id,
    badge: row.badge || '',
    pricingTier: row.pricing_tier || '',
    pricingAmount: row.pricing_amount || '',
    verdict: row.verdict || '',
    features: row.features || [],
    pros: row.pros || [],
    cons: row.cons || [],
    externalLink: row.external_link || '',
    image: row.image || '',
    rating: parseFloat(row.rating) || 0,
    apiAvailable: row.api_available || false,
    openSource: row.open_source || false,
    mobileApp: row.mobile_app || false,
    popular: row.popular || false,
  };
}
