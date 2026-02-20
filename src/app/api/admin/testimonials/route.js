import { db, initializeDatabase } from '@/lib/database';
import {
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

  return ok(await db.getTestimonials('all'));
}

export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const name = cleanString(body.name, 255);
  const content = cleanText(body.content, 2000);
  if (!name || !content) return fail('Name and content are required');

  const created = await db.createTestimonial({
    name,
    company: cleanString(body.company, 255),
    position: cleanString(body.position, 255),
    content,
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    status: ['pending', 'approved', 'rejected'].includes(body.status) ? body.status : 'pending',
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
  if (!id) return fail('Invalid testimonial id');

  const updated = await db.updateTestimonial(id, {
    name: body.name !== undefined ? cleanString(body.name, 255) : undefined,
    company: body.company !== undefined ? cleanString(body.company, 255) : undefined,
    position: body.position !== undefined ? cleanString(body.position, 255) : undefined,
    content: body.content !== undefined ? cleanText(body.content, 2000) : undefined,
    rating: body.rating !== undefined ? Math.min(5, Math.max(1, Number(body.rating) || 5)) : undefined,
    status: body.status !== undefined ? (['pending', 'approved', 'rejected'].includes(body.status) ? body.status : 'pending') : undefined,
  });

  if (!updated) return fail('Testimonial not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid testimonial id');

  const deleted = await db.deleteTestimonial(id);
  if (!deleted) return fail('Testimonial not found', 404);

  return ok({ success: true });
}
