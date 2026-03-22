import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  try {
    switch (req.method) {
      case 'GET': {
        const { type, status, id } = req.query;

        // Single article by ID (with tools)
        if (id) {
          const articles = await sql`
            SELECT a.*, c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.id = ${id as string}
          `;
          if (articles.length === 0) return res.status(404).json({ error: 'Not found' });

          const article = mapArticleRow(articles[0]);

          // Get linked tools if listicle
          if (article.type === 'listicle') {
            const toolRows = await sql`
              SELECT t.*, c.name as category_name, at2.sort_order
              FROM article_tools at2
              JOIN tools t ON at2.tool_id = t.id
              LEFT JOIN categories c ON t.category_id = c.id
              WHERE at2.article_id = ${id as string}
              ORDER BY at2.sort_order ASC
            `;
            article.items = toolRows.map((r: any) => ({
              toolId: r.id,
              name: r.name,
              badge: r.badge || '',
              pricingTier: r.pricing_tier || '',
              pricingAmount: r.pricing_amount || '',
              verdict: r.verdict || '',
              features: r.features || [],
              pros: r.pros || [],
              cons: r.cons || [],
              externalLink: r.external_link || '',
              image: r.image || '',
              rating: parseFloat(r.rating) || 0,
            }));
          }

          return res.status(200).json(article);
        }

        // List articles (optionally filtered)
        let rows;
        if (type && status) {
          rows = await sql`
            SELECT a.*, c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.type = ${type as string} AND a.status = ${status as string}
            ORDER BY a.created_at DESC
          `;
        } else if (type) {
          rows = await sql`
            SELECT a.*, c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.type = ${type as string}
            ORDER BY a.created_at DESC
          `;
        } else {
          rows = await sql`
            SELECT a.*, c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            ORDER BY a.created_at DESC
          `;
        }

        const articles = rows.map(mapArticleRow);
        return res.status(200).json(articles);
      }

      case 'POST': {
        const article = req.body;
        const result = await sql`
          INSERT INTO articles (id, type, title, slug, category_id, excerpt, subtitle, image, 
            author, author_avatar, status, tags, featured, introduction, conclusion, content)
          VALUES (${article.id}, ${article.type}, ${article.title}, ${article.slug},
            ${article.categoryId || null}, ${article.excerpt || ''}, ${article.subtitle || ''},
            ${article.image || ''}, ${article.author || ''}, ${article.authorAvatar || ''},
            ${article.status || 'draft'}, ${JSON.stringify(article.tags || [])}::jsonb,
            ${article.featured || false}, ${article.introduction || ''}, 
            ${article.conclusion || ''}, ${article.content || ''})
          RETURNING *
        `;

        // Insert article_tools if listicle
        if (article.type === 'listicle' && article.items?.length > 0) {
          for (let i = 0; i < article.items.length; i++) {
            const item = article.items[i];
            const atId = `at-${article.id}-${i}`;
            await sql`
              INSERT INTO article_tools (id, article_id, tool_id, sort_order)
              VALUES (${atId}, ${article.id}, ${item.toolId}, ${i + 1})
              ON CONFLICT (article_id, tool_id) DO UPDATE SET sort_order = ${i + 1}
            `;
          }
        }

        return res.status(201).json(mapArticleRow(result[0]));
      }

      case 'PUT': {
        const article = req.body;
        const result = await sql`
          UPDATE articles SET
            title = ${article.title}, slug = ${article.slug}, category_id = ${article.categoryId || null},
            excerpt = ${article.excerpt || ''}, subtitle = ${article.subtitle || ''},
            image = ${article.image || ''}, author = ${article.author || ''},
            author_avatar = ${article.authorAvatar || ''}, status = ${article.status || 'draft'},
            tags = ${JSON.stringify(article.tags || [])}::jsonb, featured = ${article.featured || false},
            introduction = ${article.introduction || ''}, conclusion = ${article.conclusion || ''},
            content = ${article.content || ''}, updated_at = NOW()
          WHERE id = ${article.id}
          RETURNING *
        `;

        // Re-sync article_tools
        if (article.type === 'listicle') {
          await sql`DELETE FROM article_tools WHERE article_id = ${article.id}`;
          if (article.items?.length > 0) {
            for (let i = 0; i < article.items.length; i++) {
              const item = article.items[i];
              const atId = `at-${article.id}-${i}`;
              await sql`
                INSERT INTO article_tools (id, article_id, tool_id, sort_order)
                VALUES (${atId}, ${article.id}, ${item.toolId}, ${i + 1})
              `;
            }
          }
        }

        return res.status(200).json(mapArticleRow(result[0]));
      }

      case 'DELETE': {
        const deleteId = req.query.id as string;
        if (!deleteId) return res.status(400).json({ error: 'Missing id' });
        await sql`DELETE FROM articles WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Articles API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function mapArticleRow(row: any) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    category: row.category_name || '',
    categoryId: row.category_id,
    excerpt: row.excerpt || '',
    subtitle: row.subtitle || '',
    image: row.image || '',
    author: row.author || '',
    authorAvatar: row.author_avatar || '',
    date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
    status: row.status || 'draft',
    tags: row.tags || [],
    featured: row.featured || false,
    introduction: row.introduction || '',
    conclusion: row.conclusion || '',
    content: row.content || '',
    items: [],
  };
}
