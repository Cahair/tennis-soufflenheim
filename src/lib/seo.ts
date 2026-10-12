import type { Metadata } from "next";
import { SITE_URL } from "./site";

/* ------------------------------------------------------------------ */
/*  Métadonnées de page : titre, description, URL canonique et carte  */
/*  de partage (Open Graph) propres à chaque page. Next.js remplace   */
/*  l'objet openGraph du layout dès qu'une page en définit un : on    */
/*  repart donc toujours des valeurs communes ci-dessous.             */
/* ------------------------------------------------------------------ */

export const SITE_NAME = "Tennis Padel Club Soufflenheim";

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Tennis Padel Club Soufflenheim — la piste de padel du club",
};

export const openGraphDefaults = {
  locale: "fr_FR",
  type: "website",
  siteName: SITE_NAME,
  images: [OG_IMAGE],
} satisfies Metadata["openGraph"];

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults,
      title: `${title} · ${SITE_NAME}`,
      description,
      url: path,
    },
  };
}

/* Fil d'Ariane schema.org (Accueil › Page) : Google l'affiche à la
   place de l'URL brute dans ses résultats. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/* FAQ schema.org : décrit questions et réponses aux moteurs et aux
   assistants IA (le contenu doit être visible sur la page). */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
