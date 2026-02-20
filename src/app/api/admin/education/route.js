import { db, initializeDatabase } from '@/lib/database';
import { cleanString, cleanText, fail, head, ok, parseId, preflight, requireAdmin } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getEducation());
}

export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const school = cleanString(body.school, 255);
  const degree_en = cleanString(body.degree_en, 255);
  const degree_fr = cleanString(body.degree_fr, 255);

  if (!school || !degree_en || !degree_fr || !body.startDate) {
    return fail('School, bilingual degree and start date are required');
  }

  const created = await db.createEducation({
    school,
    location: cleanString(body.location, 255),
    degree_en,
    degree_fr,
    startDate: body.startDate,
    endDate: body.endDate || null,
    description_en: cleanText(body.description_en, 2000),
    description_fr: cleanText(body.description_fr, 2000),
    displayOrder: Number(body.displayOrder) || 1,
  });

  return ok(created, 201);
}

export async function PUT(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid education id');

  const updated = await db.updateEducation(id, {
    school: body.school !== undefined ? cleanString(body.school, 255) : undefined,
    location: body.location !== undefined ? cleanString(body.location, 255) : undefined,
    degree_en: body.degree_en !== undefined ? cleanString(body.degree_en, 255) : undefined,
    degree_fr: body.degree_fr !== undefined ? cleanString(body.degree_fr, 255) : undefined,
    startDate: body.startDate,
    endDate: body.endDate,
    description_en: body.description_en !== undefined ? cleanText(body.description_en, 2000) : undefined,
    description_fr: body.description_fr !== undefined ? cleanText(body.description_fr, 2000) : undefined,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
  });

  if (!updated) return fail('Education record not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid education id');

  const deleted = await db.deleteEducation(id);
  if (!deleted) return fail('Education record not found', 404);
  return ok({ success: true });
}
