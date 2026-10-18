import { NextResponse } from 'next/server';
import { getDynamicPaymentOptions } from '@/lib/midtrans';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await getDynamicPaymentOptions();
    return NextResponse.json(
      {
        success: true,
        options,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    console.error('[API Payment Methods] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memuat metode pembayaran dinamis.',
        options: [],
      },
      { status: 500 }
    );
  }
}
