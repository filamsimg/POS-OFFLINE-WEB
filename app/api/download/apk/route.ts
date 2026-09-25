import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { syncOrderPaymentStatus } from '@/lib/order-sync';
import { getApkBinaryStream } from '@/lib/apk-download';
import { verifyAdminToken } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * Direct APK Download Endpoint
 *
 * GET /api/download/apk?orderId=<ORDER_ID>
 *
 * Security & Streaming:
 *  - Verifies that the order exists and is 'paid' before allowing download.
 *  - Streams the APK binary directly to the client with attachment headers.
 *  - The client's browser immediately starts downloading POS-OFFLINE.apk without
 *    ever visiting Google Drive or seeing virus scan warning screens.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const orderId = searchParams.get('orderId')?.trim();
    const adminToken = searchParams.get('token')?.trim();

    // Only allow direct admin bypass if a cryptographically signed admin token is provided
    const isAuthorizedAdmin = Boolean(adminToken && verifyAdminToken(adminToken));

    if (!isAuthorizedAdmin) {
      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID wajib disertakan untuk mengunduh APK resmi.' },
          { status: 400 }
        );
      }

      let order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json(
          { error: 'Pesanan tidak ditemukan.' },
          { status: 404 }
        );
      }

      // If pending, attempt a quick real-time reconciliation with Mayar
      if (order.paymentStatus === 'pending' && order.mayarPaymentId) {
        const syncResult = await syncOrderPaymentStatus(order);
        if (syncResult.order) {
          order = syncResult.order;
        }
      }

      if (order.paymentStatus !== 'paid') {
        return NextResponse.json(
          {
            error:
              'Pesanan belum berstatus lunas. Silakan selesaikan pembayaran terlebih dahulu untuk mengunduh APK.',
          },
          { status: 403 }
        );
      }
    }

    // Directly fetch and stream the binary APK from source
    const apkStream = await getApkBinaryStream();
    if (!apkStream) {
      return NextResponse.json(
        { error: 'File APK sedang tidak dapat diakses saat ini. Silakan hubungi admin.' },
        { status: 502 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.android.package-archive');
    headers.set('Content-Disposition', `attachment; filename="${apkStream.filename}"`);
    if (apkStream.contentLength) {
      headers.set('Content-Length', apkStream.contentLength);
    }
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return new NextResponse(apkStream.stream, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
    console.error('[API/Download/APK] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
