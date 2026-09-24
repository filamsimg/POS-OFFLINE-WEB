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

    // 1. Validasi Status Pembayaran
    if (order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Pembayaran belum terkonfirmasi lunas. Silakan selesaikan transfer atau hubungi admin kami untuk verifikasi.' },
        { status: 402 }
      );
    }

    // 2. Kunci 1-to-1 Device ID: Cek apakah pesanan sudah dikunci ke perangkat lain
    if (order.deviceId && order.deviceId !== cleanDeviceId) {
      return NextResponse.json(
        {
          error: `Pesanan ini sudah dikunci secara permanen untuk perangkat ${order.deviceId}. Satu pesanan berlaku untuk 1 perangkat. Jika HP Anda rusak/ganti perangkat, silakan hubungi admin untuk bantuan reset perangkat.`,
        },
        { status: 403 }
      );
    }

    // 3. Jika perangkat sama dan sudah memiliki Serial Key, kembalikan kunci yang tersimpan
    if (order.deviceId === cleanDeviceId && order.serialKey) {
      return NextResponse.json({
        success: true,
        deviceId: cleanDeviceId,
        serialKey: order.serialKey,
        customerName: order.customerName,
        storeName: order.storeName,
        message: 'Serial Key untuk perangkat ini berhasil dimuat kembali!',
      });
    }

    // 4. Generate Serial Key baru jika perangkat baru pertama kali didaftarkan
    const serialKey = generateSerialKey(cleanDeviceId);

    // Simpan ke database
    await attachLicenseToOrder(orderId, cleanDeviceId, serialKey);

    return NextResponse.json({
      success: true,
      deviceId: cleanDeviceId,
      serialKey,
      customerName: order.customerName,
      storeName: order.storeName,
      message: 'Serial Key resmi Anda berhasil diterbitkan!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Gagal menerbitkan lisensi.' },
      { status: 500 }
    );
  }
}
