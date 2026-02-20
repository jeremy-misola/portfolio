import { db, initializeDatabase } from '@/lib/database';
import { cleanString, cleanText, fail, head, ok, parseId, preflight, requireAdmin } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getHobbies());
}

export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const name_en = cleanString(body.name_en, 255);
  const name_fr = cleanString(body.name_fr, 255);
  if (!name_en || !name_fr) return fail('English and French names are required');

  const created = await db.createHobby({
    name_en,
    name_fr,
    description_en: cleanText(body.description_en, 1000),
    description_fr: cleanText(body.description_fr, 1000),
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
  if (!id) return fail('Invalid hobby id');

  const updated = await db.updateHobby(id, {
    name_en: body.name_en !== undefined ? cleanString(body.name_en, 255) : undefined,
    name_fr: body.name_fr !== undefined ? cleanString(body.name_fr, 255) : undefined,
    description_en: body.description_en !== undefined ? cleanText(body.description_en, 1000) : undefined,
    description_fr: body.description_fr !== undefined ? cleanText(body.description_fr, 1000) : undefined,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
  });

  if (!updated) return fail('Hobby not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid hobby id');

  const deleted = await db.deleteHobby(id);
  if (!deleted) return fail('Hobby not found', 404);
  return ok({ success: true });
}
