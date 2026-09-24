/**
 * Admin authentication utilities for POS Offline Web Portal
 */

export const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'posoffline2026';

export function verifyAdminCredentials(username?: string | null, password?: string | null): boolean {
  if (!username || !password) return false;
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'posoffline2026';
  return username.trim() === expectedUser && password === expectedPass;
}

export function verifyAdminPassword(password?: string | null): boolean {
  if (!password) return false;
  const expectedPass = process.env.ADMIN_PASSWORD || 'posoffline2026';
  return password === expectedPass;
}

export function createAdminToken(username: string): string {
  const payload = JSON.stringify({
    u: username,
    t: Date.now(),
  });
  return Buffer.from(payload).toString('base64');
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(raw);
    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    return Boolean(parsed && parsed.u === expectedUser);
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
