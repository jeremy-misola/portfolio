import { db, initializeDatabase } from '@/lib/database';
import { cleanEmail, cleanString, cleanText, cleanUrl, fail, head, ok, preflight, requireAdmin } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getSettings());
}

export async function PUT(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();

  const updated = await db.updateSettings({
    fullName: body.fullName !== undefined ? cleanString(body.fullName, 255) : undefined,
    headline_en: body.headline_en !== undefined ? cleanString(body.headline_en, 255) : undefined,
    headline_fr: body.headline_fr !== undefined ? cleanString(body.headline_fr, 255) : undefined,
    bio_en: body.bio_en !== undefined ? cleanText(body.bio_en, 4000) : undefined,
    bio_fr: body.bio_fr !== undefined ? cleanText(body.bio_fr, 4000) : undefined,
    resumeUrl: body.resumeUrl !== undefined ? cleanUrl(body.resumeUrl) : undefined,
    email: body.email !== undefined ? cleanEmail(body.email) : undefined,
    phone: body.phone !== undefined ? cleanString(body.phone, 100) : undefined,
    location: body.location !== undefined ? cleanString(body.location, 255) : undefined,
    linkedinUrl: body.linkedinUrl !== undefined ? cleanUrl(body.linkedinUrl) : undefined,
    githubUrl: body.githubUrl !== undefined ? cleanUrl(body.githubUrl) : undefined,
  });

  return ok(updated);
}
