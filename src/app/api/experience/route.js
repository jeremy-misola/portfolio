import { db } from '@/lib/database';
import { getPublicData, head, ok, preflight } from '@/lib/api';
import { getExperienceFallback } from '@/lib/publicData';

export async function OPTIONS() {
  return preflight();
}

export async function HEAD() {
  return head();
}

export async function GET() {
  return ok(await getPublicData(() => db.getExperience(), getExperienceFallback));
}
