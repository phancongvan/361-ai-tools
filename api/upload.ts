import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { filename, contentType } = req.query;
    
    if (!filename) {
      return res.status(400).json({ error: 'Missing filename' });
    }

    const blob = await put(filename as string, req.body, {
      access: 'public',
      contentType: contentType as string || 'image/png',
    });

    return res.status(200).json({ url: blob.url });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
