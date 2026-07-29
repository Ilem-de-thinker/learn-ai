import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getAllRegistrations,
  getRegistrationByEmail,
  insertRegistration,
  deleteRegistration,
  deleteAllRegistrations,
  getFilteredRegistrations,
  getStats,
  initDatabase,
  seedRegistrations,
  RegistrationRecord,
} from './src/db.js';

const PORT = 3000;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 * 15 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const adminPassword = process.env.ADMIN_PASSWORD || '@Ilemilem';
  const authHeader = req.headers['authorization'];
  const customPass = req.headers['x-admin-password'];

  let token = '';
  if (typeof customPass === 'string') {
    token = customPass;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token === adminPassword) return next();
  res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
}

function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json());

  app.get('/api/stats', async (_req: Request, res: Response) => {
    try {
      const stats = await getStats();
      res.json({
        ...stats,
        upcomingCohortDate: 'August 2026',
        totalCapacity: 200,
        seatsRemaining: Math.max(0, 200 - stats.totalRegistrations),
      });
    } catch (err) {
      console.error('Stats error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Too many registration attempts. Please try again later.' });
      }

      const fullName = sanitizeString(req.body.fullName);
      const email = sanitizeString(req.body.email).toLowerCase();
      const phone = sanitizeString(req.body.phone);
      const country = sanitizeString(req.body.country);
      const state = sanitizeString(req.body.state);
      const occupation = sanitizeString(req.body.occupation);
      const experience = sanitizeString(req.body.experience) as 'Beginner' | 'Intermediate' | 'Advanced';
      const source = sanitizeString(req.body.source);
      const referralCode = sanitizeString(req.body.referralCode);
      const agreeToTerms = Boolean(req.body.agreeToTerms);

      if (!fullName || fullName.length < 2) {
        return res.status(400).json({ error: 'Full Name must be at least 2 characters long.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      if (!phone || phone.length < 5) {
        return res.status(400).json({ error: 'Please enter a valid phone number.' });
      }
      if (!country || !state || !occupation || !source) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
      }
      if (!['Beginner', 'Intermediate', 'Advanced'].includes(experience)) {
        return res.status(400).json({ error: 'Invalid experience level selected.' });
      }
      if (!agreeToTerms) {
        return res.status(400).json({ error: 'You must agree to the Terms & Conditions.' });
      }

      const existing = await getRegistrationByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'This email address is already registered for the course.' });
      }

      const newRecord: RegistrationRecord = {
        id: 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        fullName,
        email,
        phone,
        country,
        state,
        occupation,
        experience,
        source,
        referralCode: referralCode || undefined,
        createdAt: new Date().toISOString(),
      };

      await insertRegistration(newRecord);

      res.status(201).json({
        message: 'Registration successful!',
        registration: newRecord,
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const password = req.body.password;
    const requiredPassword = process.env.ADMIN_PASSWORD || '@Ilemilem';
    if (password === requiredPassword) {
      return res.json({ success: true, token: requiredPassword });
    }
    res.status(401).json({ error: 'Incorrect admin password.' });
  });

  app.get('/api/admin/registrations', adminAuth, async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string || '').toLowerCase().trim();
      const expFilter = req.query.experience as string;
      const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
      const limit = Math.max(1, parseInt(req.query.limit as string || '10', 10));

      const { items, total } = await getFilteredRegistrations({ q, experience: expFilter, page, limit });
      const totalPages = Math.ceil(total / limit) || 1;
      const stats = await getStats();

      res.json({ items, total, page, totalPages, limit, stats });
    } catch (err) {
      console.error('Admin list error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/admin/registrations', adminAuth, async (_req: Request, res: Response) => {
    try {
      const deleted = await deleteAllRegistrations();
      res.json({ message: `Deleted ${deleted} registration(s).` });
    } catch (err) {
      console.error('Clear error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/admin/registrations/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const deleted = await deleteRegistration(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Registration record not found.' });
      }
      res.json({ message: 'Registration deleted successfully.' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/export', adminAuth, async (_req: Request, res: Response) => {
    try {
      const all = await getAllRegistrations();
      const headers = [
        'Registration ID', 'Full Name', 'Email', 'Phone', 'Country', 'State',
        'Occupation', 'Experience Level', 'How Heard', 'Referral Code', 'Registered At',
      ];

      const rows = all.map((r) => [
        `"${r.id}"`,
        `"${r.fullName.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        `"${r.phone.replace(/"/g, '""')}"`,
        `"${r.country.replace(/"/g, '""')}"`,
        `"${r.state.replace(/"/g, '""')}"`,
        `"${r.occupation.replace(/"/g, '""')}"`,
        `"${r.experience}"`,
        `"${r.source.replace(/"/g, '""')}"`,
        `"${(r.referralCode || '').replace(/"/g, '""')}"`,
        `"${new Date(r.createdAt).toLocaleString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="course_registrations_${Date.now()}.csv"`);
      res.status(200).send(csvContent);
    } catch (err) {
      console.error('Export error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/seed', adminAuth, async (_req: Request, res: Response) => {
    try {
      const sampleNames = ['Emma Watson', 'David Miller', 'Yuki Tanaka', 'Lucas Silva', 'Elena Rostova', 'Kofi Mensah', 'Hannah Schmidt'];
      const countries = ['Germany', 'Japan', 'Brazil', 'South Africa', 'France', 'Australia', 'United States'];
      const occupations = ['Product Manager', 'Data Analyst', 'Frontend Developer', 'UI Designer', 'Student', 'Tech Consultant'];
      const experiences: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
      const sources = ['Social Media', 'Google Search', 'YouTube', 'Friend / Referral', 'Newsletter'];

      const newEntries: RegistrationRecord[] = sampleNames.map((name, i) => {
        const email = name.toLowerCase().replace(' ', '.') + (Math.floor(Math.random() * 899) + 100) + '@example.com';
        return {
          id: 'reg_seed_' + Date.now().toString(36) + i,
          fullName: name,
          email,
          phone: `+1 (555) 01${i} ${100 + i * 11}`,
          country: countries[i % countries.length],
          state: 'Main Region',
          occupation: occupations[i % occupations.length],
          experience: experiences[i % experiences.length],
          source: sources[i % sources.length],
          referralCode: i % 2 === 0 ? 'GOLD_PASS' : undefined,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
        };
      });

      let inserted = 0;
      for (const entry of newEntries) {
        try {
          await insertRegistration(entry);
          inserted++;
        } catch (err: any) {
          if (err?.code !== '23505') console.error('Seed insert error:', err.message);
        }
      }

      const total = (await getStats()).totalRegistrations;
      res.json({ message: `Added ${inserted} test registrations!`, total });
    } catch (err) {
      console.error('Seed error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
