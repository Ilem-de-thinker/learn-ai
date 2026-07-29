import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_D9fTCOhBsa5H@ep-super-queen-ax0uh0jj-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

export interface RegistrationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  occupation: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  referralCode?: string;
  createdAt: string;
}

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id VARCHAR(50) PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      country VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      occupation VARCHAR(255) NOT NULL,
      experience VARCHAR(20) NOT NULL CHECK (experience IN ('Beginner', 'Intermediate', 'Advanced')),
      source VARCHAR(100) NOT NULL,
      referral_code VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email)`;
  } catch {}
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
  return rows.map(rowToRecord);
}

export async function getRegistrationByEmail(email: string): Promise<RegistrationRecord | null> {
  const rows = await sql`SELECT * FROM registrations WHERE email = ${email.toLowerCase()}`;
  return rows.length ? rowToRecord(rows[0]) : null;
}

export async function insertRegistration(record: RegistrationRecord): Promise<void> {
  await sql`
    INSERT INTO registrations (id, full_name, email, phone, country, state, occupation, experience, source, referral_code, created_at)
    VALUES (${record.id}, ${record.fullName}, ${record.email}, ${record.phone}, ${record.country}, ${record.state}, ${record.occupation}, ${record.experience}, ${record.source}, ${record.referralCode || null}, ${record.createdAt})
  `;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM registrations WHERE id = ${id}`;
  return (result as any).rowCount > 0;
}

export async function deleteAllRegistrations(): Promise<number> {
  const result = await sql`DELETE FROM registrations`;
  return (result as any).rowCount || 0;
}

export async function getFilteredRegistrations(params: {
  q?: string;
  experience?: string;
  page: number;
  limit: number;
}): Promise<{ items: RegistrationRecord[]; total: number }> {
  const { q, experience, page, limit } = params;
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (q) {
    conditions.push(`(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR country ILIKE $${paramIndex} OR state ILIKE $${paramIndex} OR occupation ILIKE $${paramIndex})`);
    values.push(`%${q}%`);
    paramIndex++;
  }

  if (experience && ['Beginner', 'Intermediate', 'Advanced'].includes(experience)) {
    conditions.push(`experience = $${paramIndex}`);
    values.push(experience);
    paramIndex++;
  }

  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;

  const countResult = await sql.unsafe(`SELECT COUNT(*) FROM registrations ${whereClause}`, values);
  const total = parseInt(countResult[0].count, 10);

  const dataResult = await sql.unsafe(
    `SELECT * FROM registrations ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  return {
    items: dataResult.map(rowToRecord),
    total,
  };
}

export async function getStats() {
  const totalResult = await sql`SELECT COUNT(*) FROM registrations`;
  const totalRegistrations = parseInt(totalResult[0].count, 10);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const last24h = new Date(now.getTime() - 86400000).toISOString();

  const todayResult = await sql`SELECT COUNT(*) FROM registrations WHERE created_at >= ${startOfToday}`;
  const todayRegistrations = parseInt(todayResult[0].count, 10);

  const recentResult = await sql`SELECT COUNT(*) FROM registrations WHERE created_at >= ${last24h}`;
  const recentRegistrations = parseInt(recentResult[0].count, 10);

  const expResult = await sql`SELECT experience, COUNT(*) as count FROM registrations GROUP BY experience`;
  const breakdown: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0 };
  for (const row of expResult) {
    breakdown[row.experience] = parseInt(row.count, 10);
  }

  return {
    totalRegistrations,
    todayRegistrations,
    recentRegistrations,
    experienceBreakdown: {
      beginner: breakdown['Beginner'],
      intermediate: breakdown['Intermediate'],
      advanced: breakdown['Advanced'],
    },
  };
}

function rowToRecord(row: any): RegistrationRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    state: row.state,
    occupation: row.occupation,
    experience: row.experience,
    source: row.source,
    referralCode: row.referral_code || undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}
