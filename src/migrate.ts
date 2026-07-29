import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase, seedRegistrations, getPool } from './db.js';

dotenv.config();

async function migrate() {
  console.log('Running migration...');

  await initDatabase();

  const dataPath = path.join(process.cwd(), 'data', 'registrations.json');
  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const records = JSON.parse(raw);
    console.log(`Found ${records.length} records in JSON file. Seeding to database...`);
    const inserted = await seedRegistrations(records);
    console.log(`Inserted ${inserted} records into database.`);
  } else {
    console.log('No registrations.json found, starting fresh.');
  }

  const pool = getPool();
  const count = await pool.query('SELECT COUNT(*) FROM registrations');
  console.log(`Total registrations in database: ${count.rows[0].count}`);

  await pool.end();
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
