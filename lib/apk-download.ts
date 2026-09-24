/**
 * APK Download Resolver & Binary Streamer
 *
 * Resolves direct, automatic downloads for POS OFFLINE APK.
 * Bypasses Google Drive large file warning pages (>25MB) by fetching with
 * the session cookie and dynamic confirmation UUID, streaming binary data directly
 * so the client browser downloads the APK immediately without any intermediary screens.
 */

export function extractGoogleDriveFileId(rawUrlOrId: string): string | null {
  if (!rawUrlOrId) return null;
  const trimmed = rawUrlOrId.trim();

  // If already a raw alphanumeric ID (25+ chars, no slashes)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches /file/d/ID/ or id=ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  return null;
}

export interface ApkStreamResult {
  stream: ReadableStream<Uint8Array>;
  contentLength?: string | null;
  filename: string;
}

/**
 * Fetches the binary APK stream directly from Google Drive (or configured storage).
 * Bypasses the 117MB Google virus warning page using session cookies + UUID.
 */
export async function getApkBinaryStream(): Promise<ApkStreamResult | null> {
  const rawDriveUrl = (
    process.env.APK_DRIVE_URL ||
    process.env.NEXT_PUBLIC_APK_DRIVE_URL ||
    ''
  ).trim();

  if (!rawDriveUrl) {
    throw new Error(
      '[APK Download] Variabel lingkungan APK_DRIVE_URL atau NEXT_PUBLIC_APK_DRIVE_URL belum dikonfigurasi di file .env.'
    );
  }

  // 1. Direct external CDN / Storage if configured
  if (process.env.APK_DIRECT_URL) {
    const res = await fetch(process.env.APK_DIRECT_URL.trim());
    if (res.ok && res.body) {
      return {
        stream: res.body as ReadableStream<Uint8Array>,
        contentLength: res.headers.get('content-length'),
        filename: 'POS-OFFLINE.apk',
      };
    }
  }

  const fileId = extractGoogleDriveFileId(rawDriveUrl);
  if (!fileId) {
    const res = await fetch(rawDriveUrl);
    if (res.ok && res.body) {
      return {
        stream: res.body as ReadableStream<Uint8Array>,
        contentLength: res.headers.get('content-length'),
        filename: 'POS-OFFLINE.apk',
      };
    }
    return null;
  }

  // 2. Fetch Google Drive warning page to get session cookies + dynamic UUID
  const warningPageUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
  const res1 = await fetch(warningPageUrl, {
    method: 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });

  const cookies = res1.headers.getSetCookie
    ? res1.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ')
    : '';
  const html = await res1.text();
  const uuidMatch = html.match(/name=["']uuid["']\s+value=["']([^"']+)["']/i);
  const uuid = uuidMatch ? uuidMatch[1] : '';

  // 3. Request actual binary stream with the cookie and confirmation
  const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t${
    uuid ? `&uuid=${uuid}` : ''
  }`;

  const res2 = await fetch(downloadUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...(cookies ? { Cookie: cookies } : {}),
    },
    cache: 'no-store',
  });

  if (res2.ok && res2.body) {
    return {
      stream: res2.body as ReadableStream<Uint8Array>,
      contentLength: res2.headers.get('content-length'),
      filename: 'POS-OFFLINE.apk',
    };
  }

  return null;
}
