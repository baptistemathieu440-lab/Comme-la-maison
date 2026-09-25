import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF d'abord, WebP en repli : les photos pèsent 30 à 50 % de moins qu'en JPEG.
    formats: ["image/avif", "image/webp"],
  },
  // Anciennes adresses : les liens déjà partagés ou indexés continuent de fonctionner.
  async redirects() {
    return [
      { source: "/logements", destination: "/nos-biens", permanent: true },
      { source: "/logements/:slug", destination: "/nos-biens/:slug", permanent: true },
      { source: "/confidentialite", destination: "/politique-confidentialite", permanent: true },
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
