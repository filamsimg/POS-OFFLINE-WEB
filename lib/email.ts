/**
 * Email service using Resend (https://resend.com)
 *
 * Free tier: 3,000 emails/month, 100/day.
 * Docs: https://resend.com/docs/introduction
 */

import { Resend } from 'resend';

function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith('re_xxx')) {
    throw new Error('[Email] RESEND_API_KEY is not configured.');
  }
  return new Resend(key);
}

function getFromEmail(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error('[Email] Variabel lingkungan RESEND_FROM_EMAIL belum disetel di file .env.');
  }
  return from;
}

export interface SendPurchaseEmailParams {
  to:           string; // customer email
  customerName: string;
  storeName?:   string;
  orderId:      string;
  amount:       number;
  /** WhatsApp number of the admin (with country code, no +) */
  adminWaNumber: string;
}

/**
 * Sends the automatic post-purchase email.
 * - APK download link from environment variable
 * - Self-service portal link to claim serial key
 * - Activation steps (<10 minutes)
 * - WhatsApp support link (secondary, for help only)
 */
export async function sendPurchaseConfirmationEmail(
  params: SendPurchaseEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { to, customerName, storeName, orderId, amount, adminWaNumber } = params;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://posoffline.id')
  ).replace(/\/+$/, '');
  const portalUrl  = `${siteUrl}/order/${orderId}`;
  const apkUrl     = `${siteUrl}/api/download/apk?orderId=${orderId}`;


  const waHelpLink = `https://wa.me/${adminWaNumber}?text=${encodeURIComponent(
    `Halo Admin POS OFFLINE, saya butuh bantuan aktivasi.\n\nNomor Pesanan: #${orderId.slice(0, 8).toUpperCase()}\nNama: ${customerName}`
  )}`;

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style:                 'currency',
    currency:              'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pembayaran Berhasil – POS OFFLINE</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f0f2f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 580px; margin: 32px auto; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

    /* Header */
    .header { background: #0d0e18; padding: 28px 36px; display: flex; align-items: center; gap: 14px; }
    .header-logo { font-size: 18px; font-weight: 800; color: #22c55e; letter-spacing: -0.5px; }
    .header-sub  { color: #6b6f8e; font-size: 12px; margin-top: 3px; }

    /* Body */
    .body { padding: 32px 36px; }
    .badge-paid {
      display: inline-flex; align-items: center; gap: 6px;
      background: #dcfce7; color: #15803d;
      font-size: 11px; font-weight: 700; padding: 5px 12px;
      border-radius: 100px; margin-bottom: 20px; letter-spacing: 0.05em;
    }
    .badge-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; }

    h1 { font-size: 22px; font-weight: 800; color: #0f1023; line-height: 1.3; }
    p  { color: #4b5066; font-size: 14px; line-height: 1.7; margin-top: 12px; }

    /* Order summary */
    .order-box { background: #f5f6fc; border: 1px solid #e0e2f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .order-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #6b6f8e; }
    .order-row + .order-row { margin-top: 10px; }
    .order-row strong { color: #0f1023; font-weight: 600; }
    .order-divider { border: none; border-top: 1px solid #e0e2f0; margin: 14px 0; }
    .order-total  { font-size: 15px; font-weight: 800; color: #0f1023; }
    .order-total strong { color: #16a34a; }

    /* Steps */
    .step-section { margin: 28px 0; }
    .step-title { font-size: 14px; font-weight: 700; color: #0f1023; margin-bottom: 16px; }
    .step { display: flex; gap: 14px; margin-bottom: 16px; }
    .step-num {
      min-width: 28px; width: 28px; height: 28px;
      background: #22c55e; color: #fff;
      font-size: 12px; font-weight: 800; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .step-content h4 { font-size: 13px; font-weight: 700; color: #0f1023; }
    .step-content p  { font-size: 13px; color: #4b5066; margin-top: 2px; }

    /* Buttons */
    .btn { display: block; text-align: center; padding: 14px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; margin-top: 8px; }
    .btn-primary   { background: #22c55e; color: #ffffff; }
    .btn-portal    { background: #0f1023; color: #22c55e; }
    .btn-secondary { background: #f5f6fc; color: #16a34a; border: 1px solid #bbf7d0; }

    /* Notice box */
    .notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; margin: 20px 0; }
    .notice p { font-size: 13px; color: #92400e; margin: 0; }

    /* Footer */
    .footer { padding: 20px 36px; background: #f5f6fc; border-top: 1px solid #e0e2f0; }
    .footer p { font-size: 11px; color: #9599b8; text-align: center; line-height: 1.6; }
    .footer a { color: #22c55e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <div>
          <div class="header-logo">POS OFFLINE</div>
          <div class="header-sub">Konfirmasi Pembayaran Otomatis</div>
        </div>
      </div>

      <!-- Body -->
      <div class="body">
        <div class="badge-paid"><span class="badge-dot"></span>PEMBAYARAN BERHASIL</div>
        <h1>Terima kasih, ${customerName}! 🎉<br/>Akses Anda sudah siap.</h1>
        <p>
          Pembayaran Anda telah dikonfirmasi secara <strong>otomatis</strong>.
          Ikuti 3 langkah berikut untuk mulai menggunakan POS OFFLINE dalam
          <strong style="color:#16a34a;">kurang dari 10 menit</strong>.
        </p>

        <!-- Order Summary -->
        <div class="order-box">
          <div class="order-row"><span>No. Pesanan</span><strong>#${orderId.slice(0, 8).toUpperCase()}</strong></div>
          ${storeName ? `<div class="order-row"><span>Nama Toko</span><strong>${storeName}</strong></div>` : ''}
          <div class="order-row"><span>Produk</span><strong>Lisensi POS OFFLINE Permanen</strong></div>
          <hr class="order-divider" />
          <div class="order-row order-total"><span>Total Dibayar</span><strong>${formattedAmount}</strong></div>
        </div>

        <!-- Steps -->
        <div class="step-section">
          <div class="step-title">⚡ 3 Langkah Aktivasi (< 10 Menit):</div>

          <div class="step">
            <div class="step-num">1</div>
            <div class="step-content">
              <h4>Download &amp; Install APK</h4>
              <p>Klik tombol di bawah untuk download file APK POS OFFLINE ke HP Android Anda (via Google Drive).</p>
            </div>
          </div>
          <a class="btn btn-primary" href="${apkUrl}" target="_blank">⬇️ Download APK POS OFFLINE</a>

          <br/><br/>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-content">
              <h4>Buka Aplikasi → Salin Device ID</h4>
              <p>Setelah install, buka POS OFFLINE. Anda akan melihat layar aktivasi dengan <strong>Device ID</strong> unik HP Anda. Salin kode tersebut.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-num">3</div>
            <div class="step-content">
              <h4>Klaim Serial Key di Portal Anda</h4>
              <p>Buka link portal di bawah, tempelkan Device ID Anda, dan klik <strong>"Terbitkan Serial Key"</strong>. Sistem otomatis membuat kunci aktivasi permanen Anda dalam hitungan detik.</p>
            </div>
          </div>
          <a class="btn btn-portal" href="${portalUrl}" target="_blank">🔑 Buka Portal Aktivasi Saya</a>
        </div>

        <div class="notice">
          <p>💡 <strong>Penting:</strong> Simpan email ini. Link portal di atas terhubung langsung ke pesanan Anda dan bisa diakses kapan saja jika perlu mengambil kembali Serial Key.</p>
        </div>

        <p style="font-size:13px; color:#6b6f8e;">
          Butuh bantuan? Hubungi tim support kami via WhatsApp:
          <a href="${waHelpLink}" style="color:#22c55e; font-weight:700;">Chat Support WhatsApp →</a>
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          Email ini dikirim otomatis oleh sistem POS OFFLINE.<br/>
          Jika Anda tidak merasa melakukan pembelian ini, segera hubungi kami.<br/>
          <a href="${siteUrl}">posoffline.id</a> &nbsp;|&nbsp; <a href="https://wa.me/${adminWaNumber}">WhatsApp Support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from:    getFromEmail(),
      to:      [to],
      subject: `✅ Pembayaran Berhasil: Aktifkan POS OFFLINE Anda Sekarang (< 10 Menit)`,
      html,
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Email] sendPurchaseConfirmationEmail failed:', message);
    return { success: false, error: message };
  }
}
