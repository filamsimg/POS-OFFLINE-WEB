import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { syncOrderPaymentStatus } from '@/lib/order-sync';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID wajib diisi.' }, { status: 400 });
    }

    let order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // Auto-reconciliation: If order is pending and has Mayar ID, check Mayar in real-time
    if (order.paymentStatus === 'pending' && order.mayarPaymentId) {
      const syncResult = await syncOrderPaymentStatus(order);
      if (syncResult.order) {
        order = syncResult.order;
      }
    }

    // Never expose sensitive fields to the client
    return NextResponse.json({
      order: {
        id:             order.id,
        customerName:   order.customerName,
        customerPhone:  order.customerPhone,
        customerEmail:  order.customerEmail,
        storeName:      order.storeName,
        businessType:   order.businessType,
        packageType:    order.packageType,
        amount:         order.amount,
        paymentStatus:  order.paymentStatus,
        deviceId:       order.deviceId,
        serialKey:      order.serialKey,
        activatedAt:    order.activatedAt,
        emailSentAt:    order.emailSentAt,
        mayarPaymentUrl: order.mayarPaymentUrl,
        createdAt:      order.createdAt,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Explicit trigger for the frontend "Cek Status Pembayaran" button.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID wajib diisi.' }, { status: 400 });
    }

    const { order, updated, status } = await syncOrderPaymentStatus(id);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updated,
      paymentStatus: order.paymentStatus,
      isPaid: order.paymentStatus === 'paid',
      status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

