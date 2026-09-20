import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { PACKAGES, PackageType, Order } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, storeName, businessType, packageType, paymentMethod, shippingAddress, notes } = body;

    if (!customerName || !customerPhone || !packageType) {
      return NextResponse.json(
        { error: 'Nama lengkap, nomor WhatsApp, dan pilihan paket wajib diisi.' },
        { status: 400 }
      );
    }

    const pkg = PACKAGES[packageType as PackageType];
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak valid.' }, { status: 400 });
    }

    // Generate readable Order ID: POS-YYMM-XXXX
    const datePrefix = new Date().toISOString().slice(2, 7).replace('-', '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `POS-${datePrefix}-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim().replace(/^0/, '62'),
      storeName: storeName?.trim() || 'Toko',
      businessType: businessType?.trim() || 'Retail / F&B',
      packageType: packageType as PackageType,
      amount: pkg.price,
      paymentMethod: paymentMethod === 'manual_transfer' ? 'manual_transfer' : 'qris',
      paymentStatus: 'pending',
      shippingAddress: shippingAddress?.trim(),
      notes: notes?.trim(),
      createdAt: new Date().toISOString(),
    };

    await createOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
      redirectUrl: `/order/${orderId}`,
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan saat memproses pesanan.' },
      { status: 500 }
    );
  }
}
