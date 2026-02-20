import { db, initializeDatabase } from '@/lib/database';
import { cleanString, cleanText, fail, head, ok, preflight } from '@/lib/api';

export async function OPTIONS() {
  return preflight();
}

export async function HEAD() {
  return head();
}

export async function GET() {
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getTestimonials('approved'));
}

export async function POST(request) {
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const name = cleanString(body.name, 255);
  const content = cleanText(body.content, 2000);
  if (!name || !content) return fail('Name and testimonial content are required');

  const testimonial = await db.createTestimonial({
    name,
    company: cleanString(body.company, 255),
    position: cleanString(body.position, 255),
    content,
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    status: 'pending',
  });

  return ok({ message: 'Testimonial submitted for review', id: testimonial.id }, 201);
}
