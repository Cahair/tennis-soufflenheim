import { getFacilities, getNews, getSettings, getSocials } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  /llms.txt — fiche du club en Markdown pour les assistants IA      */
/*  (convention llmstxt.org) : l'essentiel en quelques lignes et les  */
/*  pages à lire en priorité. Générée depuis le contenu de l'admin,   */
/*  elle suit les modifications sans retouche du code. Les chiffres   */
/*  (tarifs) restent sur leurs pages pour n'avoir qu'une source.      */
/* ------------------------------------------------------------------ */

export const revalidate = 3600;

const pages: { path: string; title: string; text: string }[] = [
  { path: "/padel", title: "Padel, tennis et pickleball", text: "règles du padel, réservation, adhésions padel ; tennis et pickleball en bref" },
  { path: "/tarifs", title: "Tarifs", text: "adhésions annuelles, entraînements padel, conditions de la saison" },
  { path: "/contact", title: "Contact et FAQ", text: "téléphone, e-mails, accès, horaires de permanence du club house, entraînements" },
  { path: "/le-club", title: "Le club", text: "histoire depuis 1979, installations, mot du président" },
  { path: "/calendrier", title: "Calendrier", text: "tournois, initiations et événements à venir" },
  { path: "/actualites", title: "Actualités", text: "vie du club, nouveautés, résultats" },
  { path: "/comite", title: "Comité", text: "membres du comité et commissions" },
  { path: "/reglement-interieur", title: "Règlement intérieur", text: "règles d'accès et de réservation des courts" },
];

export async function GET() {
  const [site, socials, facilities, news] = await Promise.all([
    getSettings(),
    getSocials(),
    getFacilities(),
    getNews(),
  ]);

  // Le champ city de l'admin combine code postal et ville (« 67620 Soufflenheim »).
  const [postalCode, ...cityParts] = site.address.city.split(" ");
  const city = cityParts.join(" ") || site.address.city;

  const lines = [
    `# ${site.name} (${site.shortName})`,
    "",
    `> Club associatif de tennis, padel et pickleball fondé en 1979 à ${city} (${postalCode}, Bas-Rhin, ${site.address.region}), affilié à la Fédération Française de Tennis. Les courts se réservent en ligne sur Ten'up.`,
    "",
    "## Coordonnées",
    "",
    `- Adresse : ${site.address.street}, ${site.address.city} (${site.address.directions.toLowerCase()})`,
    `- Téléphone du club : ${site.phoneClub}`,
    `- E-mail : ${site.emails.president}`,
    `- Président : ${site.president} (${site.phonePresident}, ${site.emails.president})`,
    `- Réservation des courts : ${site.links.tenup}`,
    ...socials.map((s) => `- ${s.label} : ${s.href}`),
    "",
    "## Pages principales",
    "",
    `- [Accueil](${SITE_URL}/) : présentation du club et des trois sports`,
    ...pages.map((p) => `- [${p.title}](${SITE_URL}${p.path}) : ${p.text}`),
    "",
    "## Installations",
    "",
    ...facilities.map((f) => `- ${f.title} (${f.tag}) : ${f.detail}`),
    "",
    "## Dernières actualités",
    "",
    ...news
      .filter((item) => item.slug)
      .slice(0, 6)
      .map((item) => `- [${item.title}](${SITE_URL}/actualites/${item.slug}) (${item.date}) : ${item.excerpt}`),
    "",
    "## Optional",
    "",
    `- [Galerie photos](${SITE_URL}/galerie)`,
    `- [Sponsors](${SITE_URL}/sponsors)`,
    `- [Mentions légales](${SITE_URL}/mentions-legales)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
