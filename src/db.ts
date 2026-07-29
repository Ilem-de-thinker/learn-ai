const RAW_URL = import.meta.env.VITE_DATABASE_URL;
const CONN_STRING = RAW_URL.split('?')[0];
const NEON_HOST = new URL(RAW_URL).hostname.replace('-pooler', '');
const SQL_ENDPOINT = `https://${NEON_HOST}/sql`;

async function query(queryText: string, params?: any[]) {
  const res = await fetch(SQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': CONN_STRING,
    },
    body: JSON.stringify({ query: queryText, params }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon query failed (${res.status}): ${text}`);
  }
  const result = await res.json();
  return result;
}

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
  await query(`CREATE TABLE IF NOT EXISTS registrations (
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
  )`);
  try {
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email)`);
  } catch {}
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const rows = await query(`SELECT * FROM registrations ORDER BY created_at DESC`);
  return rows.map(rowToRecord);
}

export async function getRegistrationByEmail(email: string): Promise<RegistrationRecord | null> {
  const rows = await query(`SELECT * FROM registrations WHERE email = $1`, [email.toLowerCase()]);
  return rows.length ? rowToRecord(rows[0]) : null;
}

export async function insertRegistration(record: RegistrationRecord): Promise<void> {
  await query(
    `INSERT INTO registrations (id, full_name, email, phone, country, state, occupation, experience, source, referral_code, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [record.id, record.fullName, record.email, record.phone, record.country, record.state, record.occupation, record.experience, record.source, record.referralCode || null, record.createdAt]
  );
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM registrations WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

export async function deleteAllRegistrations(): Promise<number> {
  const result = await query(`DELETE FROM registrations`);
  return result.rowCount || 0;
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

  const countResult = await query(`SELECT COUNT(*) FROM registrations ${whereClause}`, values);
  const total = parseInt(countResult[0].count, 10);

  const dataResult = await query(
    `SELECT * FROM registrations ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  return {
    items: dataResult.map(rowToRecord),
    total,
  };
}

export async function getStats() {
  const totalResult = await query(`SELECT COUNT(*) FROM registrations`);
  const totalRegistrations = parseInt(totalResult[0].count, 10);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const last24h = new Date(now.getTime() - 86400000).toISOString();

  const todayResult = await query(`SELECT COUNT(*) FROM registrations WHERE created_at >= $1`, [startOfToday]);
  const todayRegistrations = parseInt(todayResult[0].count, 10);

  const recentResult = await query(`SELECT COUNT(*) FROM registrations WHERE created_at >= $1`, [last24h]);
  const recentRegistrations = parseInt(recentResult[0].count, 10);

  const expResult = await query(`SELECT experience, COUNT(*) as count FROM registrations GROUP BY experience`);
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
