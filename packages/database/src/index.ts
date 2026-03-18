import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: resolve(__dirname, '../../../.env') });
}

// Initialize DB if DATABASE_URL is available - for build-time safety, 
// if not available we use a placeholder that will fail at runtime if actually used
let _dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

function tryInitDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('dummy')) {
    return undefined;
  }
  try {
    const sql = neon(connectionString);
    return drizzle(sql, { schema });
  } catch {
    return undefined;
  }
}

_dbInstance = tryInitDb();

// Create a properly typed db instance that's guaranteed to exist (even if fake)
// TypeScript will allow property access; runtime will fail if actually used without DB
const _fakeDb = {} as ReturnType<typeof drizzle<typeof schema>>;

// Export db - at build time it may be undefined, but we handle that in usage
export const db = _dbInstance ?? _fakeDb;

// Runtime accessor with guaranteed initialization
export function getDb() {
  if (!_dbInstance) {
    throw new Error('❌ DATABASE_URL is missing or invalid. Database not initialized.');
  }
  return _dbInstance;
}

export * from './schema';
