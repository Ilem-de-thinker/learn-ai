import { neon } from '@neondatabase/serverless';

export interface RegistrationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  referralCode?: string;
  createdAt: string;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return neon(url);
}

export async function initDatabase() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS registrations (id VARCHAR(50) PRIMARY KEY, full_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, occupation VARCHAR(255) NOT NULL, experience VARCHAR(20) NOT NULL CHECK (experience IN ('Beginner', 'Intermediate', 'Advanced')), source VARCHAR(100) NOT NULL, referral_code VARCHAR(100), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  try { await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email)`; } catch {}
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const rows = await getSql()`SELECT * FROM registrations ORDER BY created_at DESC`;
  return (rows || []).map(rowToRecord);
}

export async function getRegistrationByEmail(email: string): Promise<RegistrationRecord | null> {
  const rows = await getSql()`SELECT * FROM registrations WHERE email = ${email.toLowerCase()}`;
  return rows?.length ? rowToRecord(rows[0]) : null;
}

export async function insertRegistration(record: RegistrationRecord): Promise<void> {
  await getSql()`INSERT INTO registrations (id, full_name, email, phone, occupation, experience, source, referral_code, created_at) VALUES (${record.id}, ${record.fullName}, ${record.email}, ${record.phone}, ${record.occupation}, ${record.experience}, ${record.source}, ${record.referralCode || null}, ${record.createdAt})`;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const result = await getSql()`DELETE FROM registrations WHERE id = ${id}`;
  return (result as any)?.rowCount > 0;
}

export async function deleteAllRegistrations(): Promise<number> {
  const result = await getSql()`DELETE FROM registrations`;
  return (result as any)?.rowCount || 0;
}

export async function getFilteredRegistrations(params: { q?: string; experience?: string; page: number; limit: number }): Promise<{ items: RegistrationRecord[]; total: number }> {
  const { q, experience, page, limit } = params;
  const conditions: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (q) {
    conditions.push(`(full_name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx} OR occupation ILIKE $${idx})`);
    values.push(`%${q}%`);
    idx++;
  }
  if (experience && ['Beginner','Intermediate','Advanced'].includes(experience)) {
    conditions.push(`experience = $${idx}`);
    values.push(experience);
    idx++;
  }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const s = getSql() as any;
  const countResult = await s.unsafe(`SELECT COUNT(*) FROM registrations ${where}`, values);
  const total = parseInt(countResult?.[0]?.count ?? 0, 10);
  const dataResult = await s.unsafe(`SELECT * FROM registrations ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...values, limit, offset]);
  return { items: (dataResult || []).map(rowToRecord), total };
}

export async function getStats() {
  const sql = getSql();
  const totalResult = await sql`SELECT COUNT(*) FROM registrations`;
  const totalRegistrations = parseInt(totalResult?.[0]?.count ?? 0, 10);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const last24h = new Date(now.getTime() - 86400000).toISOString();
  const todayResult = await sql`SELECT COUNT(*) FROM registrations WHERE created_at >= ${startOfToday}`;
  const todayRegistrations = parseInt(todayResult?.[0]?.count ?? 0, 10);
  const recentResult = await sql`SELECT COUNT(*) FROM registrations WHERE created_at >= ${last24h}`;
  const recentRegistrations = parseInt(recentResult?.[0]?.count ?? 0, 10);
  const expResult = await sql`SELECT experience, COUNT(*) as count FROM registrations GROUP BY experience`;
  const breakdown: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0 };
  if (expResult) {
    for (const row of expResult) breakdown[row.experience] = parseInt((row as any).count ?? 0, 10);
  }
  return { totalRegistrations, todayRegistrations, recentRegistrations, experienceBreakdown: { beginner: breakdown['Beginner'], intermediate: breakdown['Intermediate'], advanced: breakdown['Advanced'] } };
}

function rowToRecord(row: any): RegistrationRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    occupation: row.occupation,
    experience: row.experience,
    source: row.source,
    referralCode: row.referral_code || undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}
