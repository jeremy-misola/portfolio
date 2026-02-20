// Admin utilities and middleware

import crypto from 'crypto';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const SESSION_TTL_SECONDS = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS || '604800', 10); // 7 days

function getSessionSecret() {
  if (!SESSION_SECRET || SESSION_SECRET.length < 16) {
    return null;
  }
  return SESSION_SECRET;
}

function sign(value) {
  const secret = getSessionSecret();
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(encoded) {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// Generate a signed session token with expiry
export function generateSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: ADMIN_USERNAME,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const encoded = encodePayload(payload);
  const signature = sign(encoded);
  if (!signature) return null;
  return `${encoded}.${signature}`;
}

// Hash password for comparison
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SESSION_SECRET).digest('hex');
}

// Validate admin credentials
export function validateAdminCredentials(username, password) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !getSessionSecret()) {
    return false;
  }

  const hashedPassword = hashPassword(password);
  const expectedHash = hashPassword(ADMIN_PASSWORD);
  
  return username === ADMIN_USERNAME && hashedPassword === expectedHash;
}

// Check if session is valid
export function isValidSession(sessionToken) {
  if (typeof sessionToken !== 'string' || !sessionToken.includes('.')) {
    return false;
  }

  const [encoded, providedSignature] = sessionToken.split('.');
  if (!encoded || !providedSignature) {
    return false;
  }

  const expectedSignature = sign(encoded);
  if (!expectedSignature) {
    return false;
  }

  const signatureBuffer = Buffer.from(providedSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  const payload = decodePayload(encoded);
  if (!payload || payload.sub !== ADMIN_USERNAME || !payload.exp) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return now < payload.exp;
}

// Backward-compatible no-op
export function addActiveSession(sessionToken) {
  return Boolean(sessionToken);
}

// Backward-compatible no-op
export function removeActiveSession(sessionToken) {
  return Boolean(sessionToken);
}

// Backward-compatible no-op
export function clearAllSessions() {
  return true;
}

// Middleware to protect admin routes
export function requireAuth(req, res, next) {
  const sessionToken = req.cookies?.admin_session;
  
  if (!sessionToken || !isValidSession(sessionToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Data file paths
export const DATA_PATHS = {
  testimonials: './data/testimonials.json',
  projects: './data/projects.json',
  experience: './data/experience.json'
};

// Read data from JSON file
export async function readData(filePath) {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Write data to JSON file
export async function writeData(filePath, data) {
  try {
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}
