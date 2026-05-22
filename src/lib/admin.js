// Admin utilities and middleware

import crypto from 'crypto';

const SESSION_TTL_SECONDS = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS || '604800', 10); // 7 days

function normalizeEnv(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function getAdminUsername() {
  return normalizeEnv(process.env.ADMIN_USERNAME);
}

function getAdminPassword() {
  return normalizeEnv(process.env.ADMIN_PASSWORD);
}

function getSessionSecret() {
  const secret = normalizeEnv(process.env.ADMIN_SESSION_SECRET);
  if (!secret || secret.length < 16) {
    return null;
  }
  return secret;
}

export function getAdminAuthConfigStatus() {
  const username = getAdminUsername();
  const password = getAdminPassword();
  const sessionSecret = getSessionSecret();

  return {
    hasUsername: Boolean(username),
    hasPassword: Boolean(password),
    hasSessionSecret: Boolean(sessionSecret),
    isReady: Boolean(username && password && sessionSecret),
  };
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
  const username = getAdminUsername();
  if (!username) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: username,
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
  const secret = getSessionSecret();
  if (!secret) return null;
  return crypto.createHash('sha256').update(password + secret).digest('hex');
}

// Validate admin credentials
export function validateAdminCredentials(username, password) {
  const adminUsername = getAdminUsername();
  const adminPassword = getAdminPassword();
  const secret = getSessionSecret();
  if (!adminUsername || !adminPassword || !secret) {
    return false;
  }

  const hashedPassword = hashPassword(password);
  const expectedHash = hashPassword(adminPassword);
  if (!hashedPassword || !expectedHash) {
    return false;
  }

  return username === adminUsername && hashedPassword === expectedHash;
}

// Check if session is valid
export function isValidSession(sessionToken) {
  const adminUsername = getAdminUsername();
  if (!adminUsername) {
    return false;
  }

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
  if (!payload || payload.sub !== adminUsername || !payload.exp) {
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
