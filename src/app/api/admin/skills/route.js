import { db, initializeDatabase } from '@/lib/database';
import { cleanString, fail, head, ok, parseId, preflight, requireAdmin } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getSkills());
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

  const created = await db.createSkill({
    name_en,
    name_fr,
    category: cleanString(body.category, 120),
    level: cleanString(body.level, 50),
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
  if (!id) return fail('Invalid skill id');

  const updated = await db.updateSkill(id, {
    name_en: body.name_en !== undefined ? cleanString(body.name_en, 255) : undefined,
    name_fr: body.name_fr !== undefined ? cleanString(body.name_fr, 255) : undefined,
    category: body.category !== undefined ? cleanString(body.category, 120) : undefined,
    level: body.level !== undefined ? cleanString(body.level, 50) : undefined,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
  });

  if (!updated) return fail('Skill not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid skill id');

  const deleted = await db.deleteSkill(id);
  if (!deleted) return fail('Skill not found', 404);
  return ok({ success: true });
}
