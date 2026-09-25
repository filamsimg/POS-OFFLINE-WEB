import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminToken } from '@/lib/auth';

// ── Rate Limiting (In-Memory Sliding Window) ──────────────────────────────────
interface LoginAttempt {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const waitMinutes = Math.ceil((record.resetAt - now) / 60000);
    return { allowed: false, waitMinutes };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_WINDOW_MS });
  } else {
    record.count += 1;
  }
}

function resetAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  // Extract Client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // Check rate limit
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan login yang gagal. Silakan coba kembali dalam ${rateLimit.waitMinutes} menit demi keamanan akun.`,
      },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: 'Username atau Password admin salah.' },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful login
    resetAttempts(clientIp);

    const token = createAdminToken(username.trim());
    const response = NextResponse.json({
      success: true,
      token,
      user: { username: username.trim() },
    });

    // Set secure httpOnly cookie for session support
    response.cookies.set('pos_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memproses autentikasi.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
