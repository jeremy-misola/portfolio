import { db, initializeDatabase } from '@/lib/database';
import { cleanString, cleanText, fail, head, ok, parseId, preflight, requireAdmin } from '@/lib/api';

export async function OPTIONS() { return preflight(); }
export async function HEAD() { return head(); }

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);
  return ok(await db.getMessages());
}

export async function PUT(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid message id');

  const updated = await db.updateMessage(id, {
    status: body.status !== undefined ? cleanString(body.status, 50) : undefined,
    subject: body.subject !== undefined ? cleanString(body.subject, 255) : undefined,
    message: body.message !== undefined ? cleanText(body.message, 5000) : undefined,
  });

  if (!updated) return fail('Message not found', 404);
  return ok(updated);
}

export async function DELETE(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const initialized = await initializeDatabase();
  if (!initialized) return fail('Database unavailable', 503);

  const body = await request.json();
  const id = parseId(body.id);
  if (!id) return fail('Invalid message id');

  const deleted = await db.deleteMessage(id);
  if (!deleted) return fail('Message not found', 404);
  return ok({ success: true });
}
