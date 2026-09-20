import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderPayment } from '@/lib/db';

const ADMIN_PIN = process.env.ADMIN_PIN || '123456';

export async function GET(request: Request) {
  const pin = request.headers.get('x-admin-pin');
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: 'PIN Admin salah atau tidak valid.' }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memuat pesanan.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const pin = request.headers.get('x-admin-pin');
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: 'PIN Admin salah atau tidak valid.' }, { status: 401 });
  }

  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }

    await updateOrderPayment(orderId, status);
    return NextResponse.json({ success: true, message: `Status pesanan berhasil diubah menjadi ${status}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memperbarui status.' }, { status: 500 });
  }
}
