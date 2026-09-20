import crypto from 'crypto';

const DEFAULT_SALT = 'POS_PRO_OFFLINE_SECRET_SALT_V1_2026';

/**
 * Server-only function to generate a 16-character Serial Key
 * from Device ID. Safe from browser inspection.
 */
export function generateSerialKey(deviceId: string): string {
  const cleanId = (deviceId || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleanId) return '';

  const salt = process.env.LICENSE_SALT || DEFAULT_SALT;
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
