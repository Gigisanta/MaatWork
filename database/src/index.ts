import { neon } from '@Neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from root using a path relative to the current file to avoid process.cwd() issues
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const connectionString = process.env.DATABASE_URL;

// Check if connection string is valid
const isValidConnection =
  connectionString &&
  !connectionString.includes('localhost:5432') &&
  connectionString.startsWith('postgres');

// Create mock query result that can be awaited and also supports chaining
class MockQueryBuilder {
  // This makes the object "thenable" so it can be awaited
  then(onfulfilled: (value: unknown) => void) {
    // Always return empty array for queries
    return onfulfilled([]);
  }

  // Support all chaining methods - return new MockQueryBuilder for chaining
  from(_table: unknown) {
    return new MockQueryBuilder();
  }
  orderBy(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  where(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  limit(_n: number) {
    return new MockQueryBuilder();
  }
  innerJoin(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  leftJoin(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  on(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  groupBy(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  having(..._args: unknown[]) {
    return new MockQueryBuilder();
  }
  offset(_n: number) {
    return new MockQueryBuilder();
  }
}

// Mock query object that supports findMany, findFirst, etc.
function createMockQueryTable() {
  return {
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({ count: 0 }),
    updateMany: () => Promise.resolve({ count: 0 }),
  };
}

function createMockDb() {
  return {
    // Handle select() - always return empty array when awaited
    select: () => new MockQueryBuilder(),
    // Raw SQL execution
    execute: () => Promise.resolve({ rows: [], rowCount: 0 }),
    query: {
      apps: createMockQueryTable(),
      users: createMockQueryTable(),
      clients: createMockQueryTable(),
      subscriptions: createMockQueryTable(),
      groups: createMockQueryTable(),
      invoices: createMockQueryTable(),
      activity_logs: createMockQueryTable(),
      templates: createMockQueryTable(),
      leads: createMockQueryTable(),
    },
    insert: () => ({ values: () => Promise.resolve({}) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve({}) }) }),
    delete: () => ({ where: () => Promise.resolve({}) }),
  };
}

// Log warning if using mock
if (!isValidConnection) {
  console.warn('⚠️ DATABASE_URL not valid - using mock for build');
}

// Always export db - use real or mock based on connection
export const db = isValidConnection
  ? drizzle(neon(connectionString), { schema })
  : (createMockDb() as any);

export * from './schema';
