import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSettings, getSocials } from "@/lib/content";
import { telHref } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

/* Habillage du site public : navigation + pied de page, alimentés
   par le contenu géré dans l'administration. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, socials] = await Promise.all([getSettings(), getSocials()]);

  /* Le champ city de l'admin combine code postal et ville
     (« 67620 Soufflenheim ») : on les sépare pour schema.org. */
  const [postalCode, ...cityParts] = site.address.city.split(" ");
  const clubJsonLd = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "SportsOrganization"],
    "@id": `${SITE_URL}/#club`,
    name: site.name,
    alternateName: site.shortName,
    url: SITE_URL,
    image: `${SITE_URL}/images/og-image.jpg`,
    telephone: telHref(site.phoneClub).replace("tel:", ""),
    email: site.emails.secretariat,
    foundingDate: "1979",
    sport: ["Tennis", "Padel", "Pickleball"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode,
      addressLocality: cityParts.join(" ") || site.address.city,
      addressCountry: "FR",
    },
    sameAs: socials.map((s) => s.href),
  };

  return (
    <>
      <JsonLd data={clubJsonLd} />
      <Navbar site={site} socials={socials} />
      {/* overflow-x-clip : les Reveal gauche/droite encore masqués (translate-x)
          élargiraient sinon le document — sur mobile, une page plus large que
          l'écran détache le header position:fixed du viewport visuel. Posé ici
          et non sur <body>, dont l'overflow serait propagé au viewport. */}
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer site={site} socials={socials} />
    </>
  );
}
