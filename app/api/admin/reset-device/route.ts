import { NextResponse } from 'next/server';
import { resetOrderDevice, getOrderById } from '@/lib/db';
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
    // Accept either field name for backward compatibility
    const orderId         = body.orderId;
    const adminPassword   = body.adminPassword ?? body.confirmPassword;

    if (!orderId || !adminPassword) {
      return NextResponse.json(
        { error: 'ID Pesanan dan Password Admin wajib diisi.' },
        { status: 400 }
      );
    }

    // Double-confirm with admin password
    const isPasswordValid = verifyAdminPassword(adminPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password konfirmasi admin salah. Tindakan dibatalkan.' },
        { status: 401 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const previousDeviceId = order.deviceId || '-';
    await resetOrderDevice(orderId);

    return NextResponse.json({
      success: true,
      message: `Device ID (${previousDeviceId}) berhasil dilepaskan dari pesanan ${order.customerName}. Pelanggan sekarang dapat mengaktivasi di HP baru.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mereset Device ID pesanan.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
