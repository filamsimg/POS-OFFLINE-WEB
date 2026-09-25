import crypto from 'crypto';

/**
 * Normalizes any user-inputted Device ID to the standard canonical POS OFFLINE format:
 * POS-XXXX-XXXX-XXXX
 *
 * Handles:
 * - Missing "POS-" prefix (e.g. "8F92-4B21-7A09" or "8f924b217a09")
 * - Missing hyphens (e.g. "POS8F924B217A09")
 * - Lowercase / mixed case
 * - Extra spaces
 */
export function normalizeDeviceId(deviceId: string): string {
  if (!deviceId) return '';
  const raw = deviceId.trim().toUpperCase();
  const clean = raw.replace(/[^A-Z0-9]/g, '');
  if (!clean) return '';

  // If user entered 12 characters without POS prefix:
  if (!clean.startsWith('POS') && clean.length === 12) {
    return `POS-${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
  }

  // If starts with POS and has 15 characters (POS + 12 chars):
  if (clean.startsWith('POS') && clean.length === 15) {
    return `POS-${clean.slice(3, 7)}-${clean.slice(7, 11)}-${clean.slice(11, 15)}`;
  }

  // If already has hyphens or standard length, sanitize characters
  return raw.replace(/[^A-Z0-9-]/g, '');
}

/**
 * Validates whether a device ID conforms to the POS OFFLINE format.
 */
export function isValidDeviceIdFormat(deviceId: string): boolean {
  if (!deviceId) return false;
  const normalized = normalizeDeviceId(deviceId);
  const clean = normalized.replace(/[^A-Z0-9]/g, '');
  return clean.length >= 8;
}

/**
 * Server-only function to generate a 16-character Serial Key
 * from Device ID. Safe from browser inspection.
 *
 * Uses normalizeDeviceId so that identical device IDs (with/without hyphens or prefix)
 * produce 100% consistent Serial Keys across both Landing Page and Admin Dashboard.
 */
export function generateSerialKey(deviceId: string): string {
  const normalized = normalizeDeviceId(deviceId);
  const cleanId = normalized.replace(/[^A-Z0-9]/g, '');
  if (!cleanId) return '';

  const salt = process.env.LICENSE_SALT?.trim();
  if (!salt) {
    throw new Error('[License] Variabel lingkungan LICENSE_SALT wajib dikonfigurasi di file .env.');
  }
  const hash = crypto.createHash('sha256').update(`${cleanId}:${salt}`).digest('hex');

  // Base32 characters excluding ambiguous glyphs (no 0, O, 1, I)
  const baseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let keyChars = '';

  for (let i = 0; i < 16; i++) {
    const chunk = hash.substring(i * 3, i * 3 + 3);
    const num = parseInt(chunk, 16);
    keyChars += baseChars[num % baseChars.length];
  }

  // Format into: XXXX-XXXX-XXXX-XXXX
  return `${keyChars.slice(0, 4)}-${keyChars.slice(4, 8)}-${keyChars.slice(8, 12)}-${keyChars.slice(12, 16)}`;
}

/**
 * Verifies if a given Serial Key matches the Device ID.
 */
export function verifySerialKey(deviceId: string, inputKey: string): boolean {
  if (!deviceId || !inputKey) return false;
  const expected = generateSerialKey(deviceId);
  const normalized = inputKey.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  return expected === normalized;
}
