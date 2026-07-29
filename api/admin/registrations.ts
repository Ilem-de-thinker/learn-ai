import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteAllRegistrations, getFilteredRegistrations, getStats } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers['x-admin-password'] as string;
  const required = process.env.ADMIN_PASSWORD || 'admin123';
  if (auth !== required) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'DELETE') {
    try {
      const count = await deleteAllRegistrations();
      return res.json({ message: `Deleted ${count} registrations.` });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Delete failed' });
    }
  }

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    const experience = req.query.experience as string;
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit as string || '10', 10));
    const { items, total } = await getFilteredRegistrations({ q, experience, page, limit });
    const totalPages = Math.ceil(total / limit) || 1;
    const stats = await getStats();
    res.json({ items, total, page, totalPages, limit, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}
