import { NextResponse } from 'next/server';
import { getOrderById, attachLicenseToOrder } from '@/lib/db';
import { generateSerialKey } from '@/lib/license';

export async function POST(request: Request) {
  try {
    const { orderId, deviceId } = await request.json();

    if (!orderId || !deviceId) {
      return NextResponse.json(
        { error: 'ID Pesanan dan Device ID wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanDeviceId = deviceId.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (cleanDeviceId.replace(/-/g, '').length < 8) {
      return NextResponse.json(
        { error: 'Format Device ID tidak valid. Periksa kembali Device ID di layar aplikasi POS OFFLINE Anda.' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // Generate valid serial key
    const serialKey = generateSerialKey(cleanDeviceId);

    // Save to database
    await attachLicenseToOrder(orderId, cleanDeviceId, serialKey);

    return NextResponse.json({
      success: true,
      deviceId: cleanDeviceId,
      serialKey,
      customerName: order.customerName,
      storeName: order.storeName,
      message: 'Lisensi berhasil diterbitkan!',
    });
  } catch (error: any) {
    console.error('Claim key error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menerbitkan lisensi.' },
      { status: 500 }
    );
  }
}
