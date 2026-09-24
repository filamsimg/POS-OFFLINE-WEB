import { NextResponse } from 'next/server';
import { generateSerialKey, normalizeDeviceId, isValidDeviceIdFormat } from '@/lib/license';
import { extractAuthHeader } from '@/lib/auth';
import { getOrderById, attachLicenseToOrder } from '@/lib/db';

export async function POST(request: Request) {
  const isAuthorized = extractAuthHeader(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Sesi Admin tidak valid atau telah kedaluwarsa. Silakan login kembali.' },
      { status: 401 }
    );
  }

  try {
    const { deviceId, orderId, customerName, storeName } = await request.json();

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID wajib diisi.' }, { status: 400 });
    }

    const cleanDeviceId = normalizeDeviceId(deviceId);
    if (!isValidDeviceIdFormat(cleanDeviceId)) {
      return NextResponse.json(
        { error: 'Format Device ID tidak valid. Contoh yang benar: POS-8F92-4B21-7A09.' },
        { status: 400 }
      );
    }

    const serialKey = generateSerialKey(cleanDeviceId);

    // If an orderId is provided, persist the key to the order in DB
    let resolvedName  = customerName || 'Pelanggan';
    let resolvedStore = storeName    || 'Toko Anda';

    if (orderId) {
      const order = await getOrderById(orderId);
      if (order) {
        resolvedName  = order.customerName ?? resolvedName;
        resolvedStore = order.storeName    ?? resolvedStore;

        // If order is already locked to a different device, protect from accidental overwrite
        if (order.deviceId && normalizeDeviceId(order.deviceId) !== cleanDeviceId) {
          return NextResponse.json(
            {
              error: `Pesanan #${order.id.slice(0, 8).toUpperCase()} sudah terdaftar untuk perangkat ${order.deviceId}. Gunakan tombol Reset Device terlebih dahulu jika pelanggan berganti perangkat HP.`,
            },
            { status: 409 }
          );
        }

        await attachLicenseToOrder(orderId, cleanDeviceId, serialKey);
      }
    }


    // WhatsApp message template
    const waText =
      `Halo Kak ${resolvedName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n` +
      `Berikut rincian aktivasi lisensi resmi Anda:\n` +
      `🏪 Nama Toko: ${resolvedStore}\n` +
      `📱 Device ID: ${cleanDeviceId}\n` +
      `🔑 SERIAL KEY: ${serialKey}\n\n` +
      `Cara Aktivasi:\n` +
      `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
      `2. Salin dan tempelkan Serial Key di atas ke kolom yang tersedia.\n` +
      `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
      `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
      `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;

    return NextResponse.json({
      success:           true,
      deviceId:          cleanDeviceId,
      serialKey,
      whatsappTemplate:  waText,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal membuat serial key.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
