// lib/auth.js
import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(value) {
  const hmac = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${hmac}`;
}

function verify(signed) {
  if (!signed) return false;
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return false;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  try {
    return (
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) &&
      Number(value) > Date.now()
    );
  } catch {
    return false;
  }
}

export function createSessionCookie() {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  const token = sign(String(expiresAt));
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isValidSessionCookie(cookieHeader) {
  if (!cookieHeader) return false;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const token = match.slice(COOKIE_NAME.length + 1);
  return verify(token);
}

export { COOKIE_NAME };
