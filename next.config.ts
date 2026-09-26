import type { NextConfig } from "next";

// Photos du guide voyageurs : stockage public Supabase, optimisées par next/image.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF d'abord, WebP en repli : les photos pèsent 30 à 50 % de moins qu'en JPEG.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: supabaseHost.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseHost.hostname,
            port: supabaseHost.port,
            pathname: "/storage/v1/object/public/guide-photos/**",
          },
        ]
      : [],
  },
  // Anciennes adresses : les liens déjà partagés ou indexés continuent de fonctionner.
  async redirects() {
    return [
      { source: "/logements", destination: "/nos-biens", permanent: true },
      { source: "/logements/:slug", destination: "/nos-biens/:slug", permanent: true },
      { source: "/confidentialite", destination: "/politique-confidentialite", permanent: true },
      // Adresses courtes et alternatives du guide (QR codes, messages aux voyageurs).
      { source: "/guide-voyageur", destination: "/guide", permanent: true },
      { source: "/guide-voyageurs", destination: "/guide", permanent: true },
      { source: "/livret", destination: "/guide", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
