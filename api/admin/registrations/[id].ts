import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteRegistration } from '../../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  const auth = req.headers['x-admin-password'] as string;
  const required = process.env.ADMIN_PASSWORD || 'admin123';
  if (auth !== required) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const deleted = await deleteRegistration(req.query.id as string);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
}
