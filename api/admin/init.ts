import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initDatabase } from '../_db';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await initDatabase();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Init failed' });
  }
}
