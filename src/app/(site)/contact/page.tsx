import type { Metadata } from "next";
import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    title: "E-mails",
    lines: [site.emails.president, site.emails.secretariat],
    href: `mailto:${site.emails.president}`,
    action: "Écrire un e-mail",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    title: "Adresse",
    lines: [site.address.street, site.address.city],
    href: site.links.itineraire,
    action: "Voir l'itinéraire",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

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
      />

      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            {/* Coordonnées */}
            <div>
              <Reveal>
                <SectionHeader
                  align="left"
                  kicker="Coordonnées"
                  title="Toutes les portes d'entrée"
                />
              </Reveal>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {cards.map((card, i) => (
                  <Reveal key={card.title} delay={i * 80} className="h-full">
                    <div className="card-lift flex h-full flex-col rounded-3xl border border-pine-100 bg-white p-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-800 text-gold-400">
                        {card.icon}
                      </span>
                      <h3 className="mt-4 font-bold text-pine-950">{card.title}</h3>
                      <div className="mt-1.5 space-y-0.5">
                        {card.lines.map((line) => (
                          <p key={line} className="break-all text-sm text-pine-950/65">
                            {line}
                          </p>
                        ))}
                      </div>
                      <a
                        href={card.href}
                        {...(card.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-clay-500 hover:underline"
                      >
                        {card.action}
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7m0 0H8m9 0v9" />
                        </svg>
                      </a>
                    </div>
                  </Reveal>
                ))}

                {/* Réseaux sociaux */}
                <Reveal delay={cards.length * 80} className="sm:col-span-2">
                  <div className="card-lift rounded-3xl border border-pine-100 bg-white p-6">
                    <h3 className="font-bold text-pine-950">
                      Suivez la vie du club
                    </h3>
                    <p className="mt-1.5 text-sm text-pine-950/65">
                      Résultats, événements, coulisses : le TPCS est aussi sur
                      les réseaux.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-pine-100 px-4 py-2 text-sm font-medium text-pine-950/80 transition-colors hover:border-gold-400 hover:text-clay-500"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                          >
                            <path d={socialIconPaths[social.icon] ?? socialIconPaths.globe} />
                          </svg>
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Formulaire */}
            <Reveal direction="right" delay={100}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Nous trouver"
              title="Rue de Koenigsbruck, Soufflenheim"
              text="À deux pas du centre du village des potiers — parking gratuit et illimité sur place."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 overflow-hidden rounded-3xl border border-pine-100 shadow-xl shadow-pine-950/5">
              <iframe
                title="Carte — Tennis Padel Club Soufflenheim"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.9414%2C48.8203%2C7.9914%2C48.8443&layer=mapnik&marker=48.8323%2C7.9664"
                className="h-[420px] w-full border-0"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ complète — cible du lien « FAQ » du menu (/contact#faq) */}
      <section id="faq" className="scroll-mt-20 bg-cream-50 py-24">
        <JsonLd data={faqJsonLd(faqs)} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="FAQ"
              title="Foire aux questions"
              text="Réservations, licences, matériel, sponsoring : les réponses aux questions les plus fréquentes."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <Accordion items={faqs} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
