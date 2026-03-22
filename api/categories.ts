import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  try {
    switch (req.method) {
      case 'GET': {
        const rows = await sql`
          SELECT id, name, slug, description, parent_id, sort_order, created_at
          FROM categories
          ORDER BY sort_order ASC, name ASC
        `;

        // Build tree structure from flat list
        const tree = buildTree(rows);
        return res.status(200).json(tree);
      }

      case 'POST': {
        const { id, name, slug, description, parentId, sortOrder } = req.body;
        const result = await sql`
          INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
          VALUES (${id}, ${name}, ${slug}, ${description || ''}, ${parentId || null}, ${sortOrder || 0})
          RETURNING *
        `;
        return res.status(201).json(result[0]);
      }

      case 'PUT': {
        const { id: updateId, name, slug, description, parentId, sortOrder } = req.body;
        const result = await sql`
          UPDATE categories 
          SET name = ${name}, slug = ${slug}, description = ${description || ''}, 
              parent_id = ${parentId || null}, sort_order = ${sortOrder || 0}
          WHERE id = ${updateId}
          RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      case 'DELETE': {
        const deleteId = req.query.id as string;
        if (!deleteId) return res.status(400).json({ error: 'Missing id' });
        await sql`DELETE FROM categories WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Categories API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Build a tree structure from flat category rows
function buildTree(rows: any[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  // First pass: create lookup map
  rows.forEach(row => {
    map[row.id] = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      count: 0,
      children: []
    };
  });

  // Second pass: link children to parents
  rows.forEach(row => {
    if (row.parent_id && map[row.parent_id]) {
      map[row.parent_id].children.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  });

  // Remove empty children arrays
  const clean = (nodes: any[]) => {
    nodes.forEach(n => {
      if (n.children.length === 0) delete n.children;
      else clean(n.children);
    });
  };
  clean(roots);

  return roots;
}
