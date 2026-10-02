import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cover images are served from Supabase Storage. The host is derived from
    // the public Supabase URL at build time when configured.
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) return [];
      try {
        const { hostname } = new URL(url);
        return [{ protocol: "https", hostname }];
      } catch {
        return [];
      }
    })(),
    formats: ["image/avif", "image/webp"],
  },
  // pdfjs ships its worker as an ESM asset; allow it to be bundled server-side.
  serverExternalPackages: ["pdf-to-img"],
};

export default withNextIntl(nextConfig);
