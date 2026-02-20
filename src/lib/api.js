import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/admin';

export function applyJsonCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE, CONNECT'
  );
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export function ok(data, status = 200) {
  return applyJsonCors(NextResponse.json(data, { status }));
}

export function fail(message, status = 400) {
  return applyJsonCors(NextResponse.json({ error: message }, { status }));
}

export function preflight() {
  return applyJsonCors(new NextResponse(null, { status: 204 }));
}

export function head() {
  return applyJsonCors(new NextResponse(null));
}

export function isAdminRequest(request) {
  const token = request.cookies.get('admin_session')?.value;
  return Boolean(token && isValidSession(token));
}

export function requireAdmin(request) {
  if (!isAdminRequest(request)) {
    return fail('Authentication required', 401);
  }
  return null;
}

export function cleanString(value, maxLength = 5000) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function cleanText(value, maxLength = 10000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function cleanUrl(value) {
  const cleaned = cleanString(value, 500);
  if (!cleaned) return '';
  try {
    const parsed = new URL(cleaned);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

export function cleanEmail(value) {
  const cleaned = cleanString(value, 255).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

export function cleanArray(value, maxItems = 50, maxItemLength = 120) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(item, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function parseId(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}
