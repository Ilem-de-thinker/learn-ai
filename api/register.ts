import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRegistrationByEmail, insertRegistration, initDatabase, RegistrationRecord } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await initDatabase();
    const body = req.body || {};
    const { fullName, email, phone, occupation, experience, source, agreeToTerms } = body;
    if (!fullName || fullName.length < 2) return res.status(400).json({ error: 'Full Name must be at least 2 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email required.' });
    if (!phone || phone.length < 5) return res.status(400).json({ error: 'Valid phone required.' });
    if (!occupation || !source) return res.status(400).json({ error: 'All fields required.' });
    if (!['Beginner','Intermediate','Advanced'].includes(experience)) return res.status(400).json({ error: 'Invalid experience level.' });
    if (!agreeToTerms) return res.status(400).json({ error: 'Must agree to terms.' });

    const existing = await getRegistrationByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const record: RegistrationRecord = {
      id: 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      fullName, email: email.toLowerCase(), phone, occupation, experience, source,
      createdAt: new Date().toISOString(),
    };
    await insertRegistration(record);
    res.status(201).json({ message: 'Registration successful!', registration: record });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}
