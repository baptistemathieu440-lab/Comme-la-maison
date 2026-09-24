import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · Conciergerie Airbnb à Bordeaux`,
    short_name: site.name,
    description: site.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5f0e7",
    theme_color: "#f5f0e7",
    lang: "fr",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
