import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllRegistrations } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers['x-admin-password'] as string;
  const required = process.env.ADMIN_PASSWORD || 'admin123';
  if (auth !== required) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const all = await getAllRegistrations();
    const headers = ['Registration ID','Full Name','Email','Phone','Country','State','Occupation','Experience Level','How Heard','Referral Code','Registered At'];
    const rows = all.map(r => [
      `"${r.id}"`, `"${r.fullName.replace(/"/g,'""')}"`, `"${r.email.replace(/"/g,'""')}"`,
      `"${r.phone.replace(/"/g,'""')}"`, `"${r.country.replace(/"/g,'""')}"`, `"${r.state.replace(/"/g,'""')}"`,
      `"${r.occupation.replace(/"/g,'""')}"`, `"${r.experience}"`, `"${r.source.replace(/"/g,'""')}"`,
      `"${(r.referralCode||'').replace(/"/g,'""')}"`, `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="course_registrations_${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Export failed' });
  }
}
