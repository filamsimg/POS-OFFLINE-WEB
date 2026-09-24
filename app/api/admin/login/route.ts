import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminToken } from '@/lib/auth';

export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: 'Username atau Password admin salah.' },
        { status: 401 }
      );
    }

    const token = createAdminToken(username.trim());
    const response = NextResponse.json({
      success: true,
      token,
      user: { username: username.trim() },
    });

    // Set cookie for browser session support
    response.cookies.set('pos_admin_token', token, {
      httpOnly: false,
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
