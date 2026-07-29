import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertRegistration, getStats, RegistrationRecord } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers['x-admin-password'] as string;
  const required = process.env.ADMIN_PASSWORD || 'admin123';
  if (auth !== required) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const names = ['Emma Watson','David Miller','Yuki Tanaka','Lucas Silva','Elena Rostova','Kofi Mensah','Hannah Schmidt'];
    const countries = ['Germany','Japan','Brazil','South Africa','France','Australia','United States'];
    const occupations = ['Product Manager','Data Analyst','Frontend Developer','UI Designer','Student','Tech Consultant'];
    const experiences: ('Beginner'|'Intermediate'|'Advanced')[] = ['Beginner','Intermediate','Advanced'];
    const sources = ['Social Media','Google Search','YouTube','Friend / Referral','Newsletter'];
    let inserted = 0;
    for (let i = 0; i < names.length; i++) {
      const entry: RegistrationRecord = {
        id: 'reg_seed_' + Date.now().toString(36) + i,
        fullName: names[i],
        email: names[i].toLowerCase().replace(' ','.') + (Math.floor(Math.random()*899)+100) + '@example.com',
        phone: `+1 (555) 01${i} ${100 + i * 11}`,
        country: countries[i % countries.length],
        state: 'Main Region',
        occupation: occupations[i % occupations.length],
        experience: experiences[i % experiences.length],
        source: sources[i % sources.length],
        referralCode: i % 2 === 0 ? 'GOLD_PASS' : undefined,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
      };
      try { await insertRegistration(entry); inserted++; } catch {}
    }
    const total = (await getStats()).totalRegistrations;
    res.json({ message: `Added ${inserted} test registrations!`, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Seed failed' });
  }
}
