import { NextResponse } from 'next/server';
import { generateSerialKey } from '@/lib/license';
import { extractAuthHeader } from '@/lib/auth';

export async function POST(request: Request) {
  const isAuthorized = extractAuthHeader(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Sesi Admin tidak valid atau telah kedaluwarsa. Silakan login kembali.' }, { status: 401 });
  }

  try {
    const { deviceId, customerName, storeName } = await request.json();
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID wajib diisi.' }, { status: 400 });
    }

    const cleanDeviceId = deviceId.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const serialKey = generateSerialKey(cleanDeviceId);

    // Generate neat WhatsApp message for the buyer
    const waText = `Halo Kak ${customerName || 'Pelanggan'}! Terima kasih atas pesanannya di POS OFFLINE 😊

Berikut rincian aktivasi lisensi resmi Anda:
🏪 Nama Toko: ${storeName || 'Toko Anda'}
📱 Device ID: ${cleanDeviceId}
🔑 SERIAL KEY: ${serialKey}

Cara Aktivasi:
1. Buka aplikasi POS OFFLINE di HP Anda.
2. Salin dan tempelkan Serial Key di atas ke kolom yang tersedia.
3. Klik tombol 'Aktivasi Aplikasi'.

Aplikasi Anda langsung aktif permanen seumur hidup! Jika ada pertanyaan, jangan ragu untuk menghubungi kami kembali ya Kak. 🙏`;

    return NextResponse.json({
      success: true,
      deviceId: cleanDeviceId,
      serialKey,
      whatsappTemplate: waText,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal membuat serial key.' }, { status: 500 });
  }
}
