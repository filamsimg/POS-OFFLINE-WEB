import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://www.posoffline.xyz'
  ).replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/order/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
