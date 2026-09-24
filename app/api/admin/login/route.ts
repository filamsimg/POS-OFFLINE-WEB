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
    return NextResponse.json({
      success: true,
      token,
      user: { username: username.trim() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal memproses autentikasi.' },
      { status: 500 }
    );
  }
}
