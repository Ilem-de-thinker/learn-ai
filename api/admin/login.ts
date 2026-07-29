import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const password = req.body?.password;
  const required = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === required) return res.json({ success: true, token: required });
  res.status(401).json({ error: 'Incorrect admin password.' });
}
