import { NextResponse } from 'next/server';
import { deleteOrder, getOrderById } from '@/lib/db';
import { extractAuthHeader, verifyAdminPassword } from '@/lib/auth';

export async function POST(request: Request) {
  // ── Auth check ──────────────────────────────────────────────────────────
  const isAuthorized = extractAuthHeader(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Sesi Admin tidak valid atau telah kedaluwarsa. Silakan login kembali.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const orderId       = body.orderId;
    const adminPassword = body.adminPassword ?? body.confirmPassword;

    if (!orderId || !adminPassword) {
      return NextResponse.json(
        { error: 'ID Pesanan dan Password Admin wajib diisi untuk menghapus data.' },
        { status: 400 }
      );
    }

    // Double-confirm with admin password for destructive action
    const isPasswordValid = verifyAdminPassword(adminPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password konfirmasi admin salah. Penghapusan dibatalkan.' },
        { status: 401 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    await deleteOrder(orderId);

    return NextResponse.json({
      success: true,
      message: `Pesanan / Lisensi #${orderId.slice(0, 8).toUpperCase()} (${order.customerName}) berhasil dihapus secara permanen.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus pesanan.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
