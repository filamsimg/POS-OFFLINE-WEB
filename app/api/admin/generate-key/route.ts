import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateSerialKey, normalizeDeviceId, isValidDeviceIdFormat } from '@/lib/license';
import { extractAuthHeader } from '@/lib/auth';
import { getOrderById, attachLicenseToOrder, createOrder } from '@/lib/db';
import { PACKAGES, Order } from '@/lib/types';

export async function POST(request: Request) {
  const isAuthorized = extractAuthHeader(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Sesi Admin tidak valid atau telah kedaluwarsa. Silakan login kembali.' },
      { status: 401 }
    );
  }

  try {
    const {
      deviceId,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      storeName,
      businessType,
      amount,
      notes,
    } = await request.json();

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

    let resolvedOrderId = orderId;
    let resolvedName = customerName?.trim() || 'Pelanggan Langsung (Admin)';
    let resolvedStore = storeName?.trim() || 'Toko Anda';
    let savedOrder: Order | null = null;

    if (orderId) {
      const order = await getOrderById(orderId);
      if (order) {
        resolvedName = order.customerName ?? resolvedName;
        resolvedStore = order.storeName ?? resolvedStore;

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
        savedOrder = {
          ...order,
          deviceId: cleanDeviceId,
          serialKey,
          activatedAt: new Date().toISOString(),
          paymentStatus: 'paid',
        };
      }
    } else {
      // Standalone Order: Catat ke database agar masuk ke daftar pesanan, tracking device & pendapatan
      const newOrderId = uuidv4();
      resolvedOrderId = newOrderId;
      const orderAmount =
        typeof amount === 'number' && amount >= 0
          ? amount
          : PACKAGES.software_only.price;

      const defaultNotes = orderAmount === 0
        ? 'Lisensi Gratis (Properti Konten / Demo) via Dashboard Admin'
        : 'Order Standalone dibuat via Dashboard Admin';

      savedOrder = {
        id: newOrderId,
        customerName: resolvedName,
        customerPhone: customerPhone?.trim() || '-',
        customerEmail: customerEmail?.trim() || undefined,
        storeName: resolvedStore !== 'Toko Anda' ? resolvedStore : undefined,
        businessType: businessType?.trim() || 'Retail & Toko',
        packageType: 'software_only',
        amount: orderAmount,
        paymentMethod: 'manual_transfer',
        paymentStatus: 'paid', // Standalone generation by admin is officially paid
        deviceId: cleanDeviceId,
        serialKey: serialKey,
        activatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        notes: notes?.trim() || defaultNotes,
      };

      await createOrder(savedOrder);
    }

    const isFreeLicense = savedOrder?.amount === 0;
    const greeting = isFreeLicense
      ? `Halo Kak ${resolvedName}! Berikut adalah lisensi POS OFFLINE (Properti / Konten / Demo) Anda 😊\n\n`
      : `Halo Kak ${resolvedName}! Terima kasih atas pesanannya di POS OFFLINE 😊\n\n`;

    // WhatsApp message template dengan backtick agar pengguna di WhatsApp cukup 1-tap untuk salin serial key
    const waText =
      greeting +
      `Berikut rincian aktivasi lisensi resmi Anda:\n` +
      `🏪 Nama Toko: ${resolvedStore}\n` +
      `📱 Device ID: ${cleanDeviceId}\n` +
      `🔑 SERIAL KEY (Ketuk kode untuk menyalin):\n` +
      `\`${serialKey}\`\n\n` +
      `Cara Aktivasi:\n` +
      `1. Buka aplikasi POS OFFLINE di HP Anda.\n` +
      `2. Ketuk kode Serial Key di atas untuk menyalin, lalu tempelkan ke kolom yang tersedia di aplikasi.\n` +
      `3. Klik tombol "Aktivasi Aplikasi".\n\n` +
      `Aplikasi Anda langsung aktif permanen seumur hidup! ` +
      `Jika ada pertanyaan, jangan ragu hubungi kami kembali ya Kak. 🙏`;

    return NextResponse.json({
      success: true,
      orderId: resolvedOrderId,
      order: savedOrder,
      deviceId: cleanDeviceId,
      serialKey,
      whatsappTemplate: waText,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal membuat serial key.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
