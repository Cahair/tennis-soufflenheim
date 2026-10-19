import type { MetadataRoute } from "next";
import { getNews } from "@/lib/content";
import { isoFromFrenchDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { contentUpdatedAt } from "@/lib/storage";

/* Régénéré au plus toutes les heures : les dates suivent les
   modifications faites dans l'admin sans attendre un nouveau build. */
export const revalidate = 3600;

/* Chaque page déclare les contenus qui l'alimentent : sa date de
   dernière modification (lastmod) est celle du plus récent d'entre
   eux. Google se fie à lastmod tant qu'il reste exact — d'où des
   dates réelles plutôt que « maintenant » à chaque visite. Les
   priorités reflètent l'importance des pages pour la recherche
   locale (accueil, pages sports et tarifs en tête). */
const routes: { path: string; priority: number; content: string[] }[] = [
  {
    path: "",
    priority: 1,
    content: [
      "settings", "home-intro", "stats", "disciplines", "reservation", "news",
      "events", "gallery", "testimonials", "sponsors", "cta-band",
    ],
  },
  { path: "/padel", priority: 0.9, content: ["disciplines", "memberships", "facilities", "settings"] },
  { path: "/tarifs", priority: 0.9, content: ["memberships", "cotisation", "tennis-school", "extras", "infos-pratiques", "settings"] },
  { path: "/le-club", priority: 0.8, content: ["settings", "committee", "facilities", "histoire-chapitres", "histoire-infos"] },
  { path: "/contact", priority: 0.8, content: ["settings", "socials", "faqs"] },
  { path: "/calendrier", priority: 0.7, content: ["events"] },
  { path: "/actualites", priority: 0.7, content: ["news"] },
  { path: "/galerie", priority: 0.6, content: ["gallery", "histoire-chapitres"] },
  { path: "/comite", priority: 0.6, content: ["committee"] },
  { path: "/sponsors", priority: 0.6, content: ["sponsors", "settings"] },
  { path: "/reglement-interieur", priority: 0.4, content: ["settings"] },
  { path: "/mentions-legales", priority: 0.2, content: ["settings"] },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority, content }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: contentUpdatedAt(content),
    changeFrequency:
      path === "" || path === "/actualites" || path === "/calendrier" ? "weekly" : "monthly",
    priority,
  }));

  /* Une entrée par article (ceux qui ont un identifiant technique),
     datée du jour de publication affiché, à défaut de la dernière
     modification des actualités. */
  const news = await getNews();
  const articles: MetadataRoute.Sitemap = news
    .filter((item) => item.slug)
    .map((item) => {
      const published = isoFromFrenchDate(item.date);
      return {
        url: `${SITE_URL}/actualites/${item.slug}`,
        lastModified: published ? new Date(published) : contentUpdatedAt(["news"]),
        changeFrequency: "yearly",
        priority: 0.5,
      };
    });

  return [...pages, ...articles];
}
