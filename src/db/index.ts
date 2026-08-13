import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const databaseUrl = process.env.DATABASE_URL;
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
    const password = process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD;
    const database = process.env.SQL_DB_NAME;

    if (databaseUrl) {
      global._postgresPool = new Pool({
        connectionString: databaseUrl,
        max: 20, // Increased for advanced connection pooling
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else if (host && user && database) {
      global._postgresPool = new Pool({
        host,
        user,
        password,
        database,
        max: 20, // Increased for advanced connection pooling
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      // In development / fallback mode when SQL_* variables are not provided in local sandbox
      console.warn(
        '[Cloud SQL Config Warning] Missing complete Cloud SQL environment variables (SQL_HOST, SQL_USER, SQL_DB_NAME or DATABASE_URL). Using fallback configuration.'
      );
      global._postgresPool = new Pool({
        host: host || 'localhost',
        user: user || 'postgres',
        password: password || 'postgres',
        database: database || 'satset_db',
        max: 10,
        connectionTimeoutMillis: 5000,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

let db: any;
try {
  db = drizzle(pool as any, { schema });
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = { findMany: async () => [], findFirst: async () => null,
    findUnique: async () => null, create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {}, delete: async () => ({}) };
  db = new Proxy({}, {
    get: (_, prop) => prop === 'query'
      ? new Proxy({}, { get: () => noOp }) : async () => [],
  });
}
export { db };
export { schema };
