import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStats } from './_db';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const stats = await getStats();
    res.json({ ...stats, upcomingCohortDate: 'August 15, 2026', totalCapacity: 500, seatsRemaining: Math.max(0, 500 - stats.totalRegistrations) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}
