import { db, initializeDatabase } from '@/lib/database';
import { fail, head, ok, preflight } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET() {
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getEducation());
}
