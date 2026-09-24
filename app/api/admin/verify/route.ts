import { NextResponse } from 'next/server';
import { extractAuthHeader } from '@/lib/auth';

export async function GET(request: Request) {
  const isAuthorized = extractAuthHeader(request);

  if (!isAuthorized) {
    const response = NextResponse.json(
      { success: false, authenticated: false, error: 'Sesi tidak valid.' },
      { status: 401 }
    );
    // Clear invalid cookie
    response.cookies.delete('pos_admin_token');
    return response;
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
  });
}
