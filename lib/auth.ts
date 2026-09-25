/**
 * Admin authentication utilities for POS Offline Web Portal
 */

import crypto from 'crypto';

function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!username || !password) {
    return null;
  }
  return { username, password };
}

function getAdminTokenSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (!secret) {
    throw new Error('[Auth] ADMIN_PASSWORD atau ADMIN_SECRET belum disetel di environment variables.');
  }
  return secret;
}

export function verifyAdminCredentials(username?: string | null, password?: string | null): boolean {
  if (!username || !password) return false;

  const creds = getAdminCredentials();
  if (!creds) {
    console.error('[Auth] ADMIN_USERNAME atau ADMIN_PASSWORD belum disetel di Environment Variables (.env)');
    return false;
  }

  const userMatch = username.trim() === creds.username;
  const bufInput = Buffer.from(password.trim());
  const bufExpected = Buffer.from(creds.password);
  const passMatch =
    bufInput.length === bufExpected.length &&
    crypto.timingSafeEqual(bufInput, bufExpected);

  return userMatch && passMatch;
}

export function verifyAdminPassword(password?: string | null): boolean {
  if (!password) return false;

  const creds = getAdminCredentials();
  if (!creds) return false;

  const bufInput = Buffer.from(password.trim());
  const bufExpected = Buffer.from(creds.password);
  return (
    bufInput.length === bufExpected.length &&
    crypto.timingSafeEqual(bufInput, bufExpected)
  );
}

export function createAdminToken(username: string): string {
  const payload = JSON.stringify({
    u: username.trim(),
    t: Date.now(),
  });
  const data = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getAdminTokenSecret())
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const creds = getAdminCredentials();
    if (!creds) return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [data, signature] = parts;
    if (!data || !signature) return false;

    const expectedSig = crypto
      .createHmac('sha256', getAdminTokenSecret())
      .update(data)
      .digest('base64url');

    const bufSig = Buffer.from(signature);
    const bufExpected = Buffer.from(expectedSig);

    if (bufSig.length !== bufExpected.length || !crypto.timingSafeEqual(bufSig, bufExpected)) {
      return false;
    }

    const raw = Buffer.from(data, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);

    if (!parsed || parsed.u !== creds.username) {
      return false;
    }

    // Token expiration: 7 days
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    if (!parsed.t || typeof parsed.t !== 'number' || Date.now() - parsed.t > MAX_AGE_MS) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function extractAuthHeader(request: Request): boolean {
  const authHeader = request.headers.get('authorization') || '';
  let token = authHeader.replace(/^Bearer\s+/i, '').trim() || request.headers.get('x-admin-token') || '';

  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/pos_admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  return verifyAdminToken(token);
}
