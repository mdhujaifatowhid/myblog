// lib/apiGuard.js
import { isValidSessionCookie } from './auth';

export function requireAdmin(req, res) {
  const ok = isValidSessionCookie(req.headers.cookie);
  if (!ok) {
    res.status(401).json({ error: 'Unauthorized. Please log in again.' });
    return false;
  }
  return true;
}
