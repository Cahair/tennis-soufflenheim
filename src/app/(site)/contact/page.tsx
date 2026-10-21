import type { Metadata } from "next";
import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { ArrowUpRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { getFaqs, getSettings, getSocials } from "@/lib/content";
import { socialIconPaths } from "@/lib/nav";
import { telHref } from "@/lib/format";
import type { SiteSettings } from "@/lib/content-types";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact et accès",
  description:
    "Téléphone, e-mail, formulaire et plan d'accès du Tennis Padel Club Soufflenheim, 1 rue de Koenigsbruck à Soufflenheim (Bas-Rhin), à 20 min de Haguenau.",
  path: "/contact",
});

const contactCards = (site: SiteSettings) => [
  {
    title: "Téléphone du club",
    lines: [site.phoneClub],
    href: telHref(site.phoneClub),
    action: "Appeler le club",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.6 2Z" />
      </svg>
    ),
  },
  {
    title: `Président — ${site.president}`,
    lines: [site.phonePresident],
    href: telHref(site.phonePresident),
    action: "Appeler le président",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    title: "E-mail",
    lines: [site.emails.president],
    href: `mailto:${site.emails.president}`,
    action: "Écrire un e-mail",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    title: "Adresse",
    lines: [site.address.street, site.address.city, site.address.directions],
    href: site.links.itineraire,
    action: "Voir l'itinéraire",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Contact : standard téléphonique néon (l'icône sonne au survol),   */
/*  formulaire qui « smashe » à l'envoi, carte en mode nuit avec      */
/*  balise radar sur le club, FAQ complète.                           */
/* ------------------------------------------------------------------ */
export default async function ContactPage() {
  const [site, socials, faqs] = await Promise.all([
    getSettings(),
    getSocials(),
    getFaqs(),
  ]);
  const cards = contactCards(site);
  return (
    <>
      <PageHero
        kicker="Contact"
        title="On vous répond vite, promis"
        text="Une question sur les adhésions, l'école de tennis ou une réservation ? Appelez, écrivez ou passez directement au club house."
        echo="Allô ?"
        effect="slam"
        tape={["Allô le club", "On répond vite", "Padel", "Club house", "Soufflenheim", "Écrivez-nous"]}
      />

      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
            {/* Coordonnées */}
            <div>
              <SectionHeader align="left" kicker="Coordonnées" title="Toutes les portes d'entrée" />
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {cards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    data-tilt
                    {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-[border-color,box-shadow] duration-500 hover:border-rose-400/70 hover:shadow-[0_30px_70px_-30px_rgba(234,51,111,0.9)]"
                  >
                    <span aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/20 blur-2xl transition-transform duration-700 group-hover:scale-[2.5]" />
                    <span className="ix-ring relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-ultra-500 text-white shadow-[0_0_30px_rgba(234,51,111,0.5)]">
                      {card.icon}
                    </span>
                    <h3 className="relative mt-5 font-bold text-white">{card.title}</h3>
                    <div className="relative mt-1.5 space-y-0.5">
                      {card.lines.map((line) => (
                        <p key={line} className="break-all text-sm text-white/70">
                          {line}
                        </p>
                      ))}
                    </div>
                    <span className="relative mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-rose-300 transition-colors group-hover:text-white">
                      {card.action}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="nfx-shine" />
                  </a>
                ))}

                {/* Réseaux sociaux */}
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:col-span-2">
                  <h3 className="font-bold text-white">Suivez la vie du club</h3>
                  <p className="mt-1.5 text-sm text-white/70">
                    Résultats, événements, coulisses : le club est aussi sur les réseaux.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 transition-all hover:-translate-y-1 hover:border-rose-400 hover:bg-rose-500 hover:text-night-950"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d={socialIconPaths[social.icon] ?? socialIconPaths.globe} />
                        </svg>
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Carte en mode nuit, resserrée sur le club : le marqueur de la
          carte reste visible (pas de balle par-dessus) */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Nous trouver"
            title={`${site.address.street}, Soufflenheim`}
            text={`${site.address.directions}, à deux pas du centre du village des potiers — parking gratuit et illimité sur place.`}
          />
          <div className="holo-frame relative mt-14 rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.8)]">
            <div className="relative overflow-hidden rounded-[calc(2rem-3px)]">
              <iframe
                title="Carte — Tennis Padel Club Soufflenheim"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.9536%2C48.8304%2C7.9676%2C48.8360&layer=mapnik&marker=48.8332%2C7.9606"
                className="ix-map h-[460px] w-full border-0"
                loading="lazy"
              />
              {/* Teinte rose/violet par-dessus le plan inversé */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-600/25 via-transparent to-ultra-600/30 mix-blend-color" />
              <a
                href={site.links.itineraire}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rose absolute bottom-5 left-5"
              >
                Y aller
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ complète — cible du lien « FAQ » du menu (/contact#faq) */}
      <section id="faq" className="relative scroll-mt-20 overflow-clip bg-night-950 py-28 text-white">
        <JsonLd data={faqJsonLd(faqs)} />
        <NightFx glow="left" beams floaters={[]} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="FAQ"
            title="Foire aux questions"
            text="Réservations, licences, matériel, sponsoring : les réponses aux questions les plus fréquentes."
          />
          <div className="mt-14">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
