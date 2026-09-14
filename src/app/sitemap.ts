import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Les priorités reflètent l'importance relative des pages pour les
   recherches locales (accueil, tarifs et présentation du club en tête). */
const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/le-club", priority: 0.9 },
  { path: "/tarifs", priority: 0.9 },
  { path: "/calendrier", priority: 0.7 },
  { path: "/actualites", priority: 0.7 },
  { path: "/galerie", priority: 0.6 },
  { path: "/comite", priority: 0.6 },
  { path: "/sponsors", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
  { path: "/reglement-interieur", priority: 0.4 },
  { path: "/mentions-legales", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/actualites" || path === "/calendrier" ? "weekly" : "monthly",
    priority,
  }));
}
