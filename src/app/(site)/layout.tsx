import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getFacilities, getSettings, getSocials } from "@/lib/content";
import { telHref } from "@/lib/format";
import { SITE_NAME } from "@/lib/seo";
import {
  CLUB_GEO,
  NEARBY_TOWNS,
  SITE_URL,
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from "@/lib/site";

/* Habillage du site public : navigation + pied de page, alimentés
   par le contenu géré dans l'administration. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, socials, facilities] = await Promise.all([
    getSettings(),
    getSocials(),
    getFacilities(),
  ]);

  /* Fiche du club pour Google (recherche locale, Knowledge Graph) :
     adresse, position GPS et zone desservie l'aident à rattacher le
     club aux recherches « padel Bas-Rhin », « tennis Haguenau »…
     Le champ city de l'admin combine code postal et ville
     (« 67620 Soufflenheim ») : on les sépare pour schema.org. */
  const [postalCode, ...cityParts] = site.address.city.split(" ");
  const clubId = `${SITE_URL}/#club`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SportsActivityLocation", "SportsOrganization"],
        "@id": clubId,
        name: site.name,
        alternateName: [site.shortName, "TPC Soufflenheim", "Tennis Club de Soufflenheim"],
        description: `Club de tennis, padel et pickleball fondé en 1979 à Soufflenheim, dans le Bas-Rhin (${site.address.region}).`,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-carre.jpg`,
        image: [
          `${SITE_URL}/images/og-image.jpg`,
          `${SITE_URL}/images/padel-court.webp`,
          `${SITE_URL}/images/courts-exterieurs.webp`,
          `${SITE_URL}/images/club-house.webp`,
        ],
        telephone: telHref(site.phoneClub).replace("tel:", ""),
        email: site.emails.secretariat,
        foundingDate: "1979",
        sport: ["Tennis", "Padel", "Pickleball"],
        priceRange: "€",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode,
          addressLocality: cityParts.join(" ") || site.address.city,
          addressRegion: "Grand Est",
          addressCountry: "FR",
        },
        geo: { "@type": "GeoCoordinates", ...CLUB_GEO },
        hasMap: site.links.itineraire,
        areaServed: [
          ...NEARBY_TOWNS.map((town) => ({ "@type": "City", name: town.name })),
          { "@type": "AdministrativeArea", name: "Bas-Rhin" },
          { "@type": "AdministrativeArea", name: "Alsace" },
        ],
        amenityFeature: facilities.map((f) => ({
          "@type": "LocationFeatureSpecification",
          name: f.title,
          value: true,
        })),
        memberOf: {
          "@type": "SportsOrganization",
          name: "Fédération Française de Tennis",
          url: "https://www.fft.fr",
        },
        sameAs: socials.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [site.shortName, "TPC Soufflenheim"],
        url: `${SITE_URL}/`,
        inLanguage: "fr-FR",
        publisher: { "@id": clubId },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar site={site} socials={socials} />
      {/* overflow-x-clip : les Reveal gauche/droite encore masqués (translate-x)
          élargiraient sinon le document — sur mobile, une page plus large que
          l'écran détache le header position:fixed du viewport visuel. Posé ici
          et non sur <body>, dont l'overflow serait propagé au viewport. */}
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer site={site} socials={socials} />
      {/* Statistiques Umami, posées ici et non dans le layout racine pour
          ne pas compter l'administration. data-domains limite le suivi au
          domaine de production : rien n'est remonté depuis localhost. */}
      {UMAMI_WEBSITE_ID && (
        <Script
          src={UMAMI_SCRIPT_URL}
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={new URL(SITE_URL).hostname}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
