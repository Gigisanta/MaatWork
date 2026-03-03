import { sql } from 'drizzle-orm';
import { db } from '../src/index';

async function reset() {
  console.log('Dropping public schema...');
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  
  console.log('Recreating public schema...');
  await db.execute(sql`CREATE SCHEMA public;`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
  
  console.log('Done!');
  process.exit(0);
}
reset().catch(console.error);
