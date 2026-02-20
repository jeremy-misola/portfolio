import { db, initializeDatabase } from '@/lib/database';
import {
  cleanArray,
  cleanString,
  cleanText,
  cleanUrl,
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

  return ok(await db.getProjects());
}

export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const title = cleanString(body.title, 255);
  if (!title) return fail('Title is required');

  const project = await db.createProject({
    title,
    description: cleanText(body.description, 4000),
    description_en: cleanText(body.description_en, 4000),
    description_fr: cleanText(body.description_fr, 4000),
    technologies: cleanArray(body.technologies, 30, 80),
    githubUrl: cleanUrl(body.githubUrl),
    demoUrl: cleanUrl(body.demoUrl),
    status: ['planned', 'in-progress', 'completed'].includes(body.status) ? body.status : 'planned',
    priority: Number.isFinite(Number(body.priority)) ? Number(body.priority) : 1,
    images: cleanArray(body.images, 10, 500),
  });

  return ok(project, 201);
}

export async function PUT(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid project id');

  const updated = await db.updateProject(id, {
    title: body.title !== undefined ? cleanString(body.title, 255) : undefined,
    description: body.description !== undefined ? cleanText(body.description, 4000) : undefined,
    description_en: body.description_en !== undefined ? cleanText(body.description_en, 4000) : undefined,
    description_fr: body.description_fr !== undefined ? cleanText(body.description_fr, 4000) : undefined,
    technologies: body.technologies !== undefined ? cleanArray(body.technologies, 30, 80) : undefined,
    githubUrl: body.githubUrl !== undefined ? cleanUrl(body.githubUrl) : undefined,
    demoUrl: body.demoUrl !== undefined ? cleanUrl(body.demoUrl) : undefined,
    status: body.status !== undefined ? (['planned', 'in-progress', 'completed'].includes(body.status) ? body.status : 'planned') : undefined,
    priority: body.priority !== undefined ? Number(body.priority) : undefined,
    images: body.images !== undefined ? cleanArray(body.images, 10, 500) : undefined,
  });

  if (!updated) return fail('Project not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid project id');

  const deleted = await db.deleteProject(id);
  if (!deleted) return fail('Project not found', 404);

  return ok({ success: true });
}
