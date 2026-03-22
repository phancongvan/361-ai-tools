import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  try {
    switch (req.method) {
      case 'GET': {
        const rows = await sql`
          SELECT id, email, name, status, created_at
          FROM subscribers
          ORDER BY created_at DESC
        `;
        const subscribers = rows.map(r => ({
          id: r.id,
          email: r.email,
          name: r.name || '',
          status: r.status || 'active',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
        }));
        return res.status(200).json(subscribers);
      }

      case 'POST': {
        const { id, email, name } = req.body;
        const result = await sql`
          INSERT INTO subscribers (id, email, name)
          VALUES (${id}, ${email}, ${name || ''})
          ON CONFLICT (email) DO NOTHING
          RETURNING *
        `;
        if (result.length === 0) {
          return res.status(409).json({ error: 'Email already subscribed' });
        }
        return res.status(201).json(result[0]);
      }

      case 'DELETE': {
        const deleteId = req.query.id as string;
        if (!deleteId) return res.status(400).json({ error: 'Missing id' });
        await sql`DELETE FROM subscribers WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', 'GET, POST, DELETE');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Subscribers API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
