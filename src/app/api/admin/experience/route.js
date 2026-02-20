import { db, initializeDatabase } from '@/lib/database';
import {
  cleanArray,
  cleanString,
  cleanText,
  fail,
  head,
  ok,
  parseId,
  preflight,
  requireAdmin,
} from '@/lib/api';

export async function OPTIONS() {
  return preflight();
}

export async function HEAD() {
  return head();
}

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getExperience());
}

export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const company = cleanString(body.company, 255);
  const positionEn = cleanString(body.position_en || body.position, 255);
  const positionFr = cleanString(body.position_fr || body.position, 255);

  if (!company || !positionEn || !body.startDate) {
    return fail('Company, position and start date are required');
  }

  const created = await db.createExperience({
    company,
    position: positionEn,
    position_en: positionEn,
    position_fr: positionFr || positionEn,
    startDate: body.startDate,
    endDate: body.endDate || null,
    description: cleanText(body.description || body.description_en, 4000),
    description_en: cleanText(body.description_en || body.description, 4000),
    description_fr: cleanText(body.description_fr || body.description, 4000),
    technologies: cleanArray(body.technologies, 30, 80),
    achievements: cleanArray(body.achievements, 30, 200),
    achievements_en: cleanArray(body.achievements_en, 30, 200),
    achievements_fr: cleanArray(body.achievements_fr, 30, 200),
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
  if (!id) return fail('Invalid experience id');

  const updated = await db.updateExperience(id, {
    company: body.company !== undefined ? cleanString(body.company, 255) : undefined,
    position: body.position !== undefined ? cleanString(body.position, 255) : undefined,
    position_en: body.position_en !== undefined ? cleanString(body.position_en, 255) : undefined,
    position_fr: body.position_fr !== undefined ? cleanString(body.position_fr, 255) : undefined,
    startDate: body.startDate,
    endDate: body.endDate,
    description: body.description !== undefined ? cleanText(body.description, 4000) : undefined,
    description_en: body.description_en !== undefined ? cleanText(body.description_en, 4000) : undefined,
    description_fr: body.description_fr !== undefined ? cleanText(body.description_fr, 4000) : undefined,
    technologies: body.technologies !== undefined ? cleanArray(body.technologies, 30, 80) : undefined,
    achievements: body.achievements !== undefined ? cleanArray(body.achievements, 30, 200) : undefined,
    achievements_en: body.achievements_en !== undefined ? cleanArray(body.achievements_en, 30, 200) : undefined,
    achievements_fr: body.achievements_fr !== undefined ? cleanArray(body.achievements_fr, 30, 200) : undefined,
  });

  if (!updated) return fail('Experience not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid experience id');

  const deleted = await db.deleteExperience(id);
  if (!deleted) return fail('Experience not found', 404);

  return ok({ success: true });
}
