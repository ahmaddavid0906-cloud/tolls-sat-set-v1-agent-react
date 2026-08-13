import { db } from '../db';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';

/**
 * Advanced Database Utility Helper
 * Provides robust transaction management and query execution with retry logic.
 */

// Helper to execute a query with automatic retry on transient connection failures
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      const isTransient = error.code === 'ECONNRESET' || error.code === '08006' || error.code === '08003';
      
      if (!isTransient || attempt >= maxRetries) {
        console.error(`[DB Error] Operation failed after ${attempt} attempts:`, error);
        throw error;
      }
      
      console.warn(`[DB Warning] Transient error, retrying (${attempt}/${maxRetries}) in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Unreachable');
}

/**
 * Perform a database health check.
 * Useful for monitoring endpoints and liveness probes.
 */
export async function checkDatabaseHealth(): Promise<{ status: string; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return {
      status: 'healthy',
      latencyMs: Date.now() - start
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      latencyMs: Date.now() - start,
      error: error.message
    };
  }
}
