import { db, initializeDatabase } from '@/lib/database';
import { cleanEmail, cleanString, cleanText, fail, head, ok, preflight } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function POST(request) {
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const name = cleanString(body.name, 255);
  const email = cleanEmail(body.email);
  const subject = cleanString(body.subject, 255);
  const message = cleanText(body.message, 5000);

  if (!name || !email || !subject || !message) {
    return fail('Name, valid email, subject and message are required');
  }

  const created = await db.createMessage({ name, email, subject, message, status: 'unread' });
  return ok({ message: 'Message sent successfully', id: created.id }, 201);
}
