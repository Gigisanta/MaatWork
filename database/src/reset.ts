import { db } from './index';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

async function main() {
  console.log('Dropping schema public...');
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  await db.execute(sql`CREATE SCHEMA public;`);
  console.log('Done!');
  process.exit(0);
}
main().catch(console.error);
