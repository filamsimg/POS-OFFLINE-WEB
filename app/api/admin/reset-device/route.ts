import { NextResponse } from 'next/server';
import { resetOrderDevice, getOrderById } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { orderId, adminPassword } = await request.json();

    if (!orderId || !adminPassword) {
      return NextResponse.json(
        { error: 'ID Pesanan dan Password Admin wajib diisi.' },
        { status: 400 }
      );
    }

    // Double security confirmation: Verify admin password
    const isPasswordValid = verifyAdminPassword(adminPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password konfirmasi admin salah. Tindakan dibatalkan.' },
        { status: 401 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Pesanan tidak ditemukan.' },
        { status: 404 }
      );
    }

    const previousDeviceId = order.deviceId || '-';
    await resetOrderDevice(orderId);

    return NextResponse.json({
      success: true,
      message: `Device ID (${previousDeviceId}) berhasil dilepaskan dari pesanan ${order.customerName}. Pelanggan sekarang dapat memasukkan Device ID baru.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal mereset Device ID pesanan.' },
      { status: 500 }
    );
  }
}
