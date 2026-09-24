import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/transparence", priority: 0.7 },
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/confidentialite", priority: 0.2 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
