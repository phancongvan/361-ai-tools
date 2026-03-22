import type { VercelRequest, VercelResponse } from '@vercel/node';
import seed from './lib/seed.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const result = await seed();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Seed API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
