import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SplitFlap from "@/components/fx/SplitFlap";
import CtaBand from "@/components/home/CtaBand";
import NightFx from "@/components/landing/NightFx";
import { getEvents, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Calendrier des tournois et événements",
  description:
    "Tournois de tennis et de padel, initiations, soirées : tous les prochains rendez-vous du Tennis Padel Club Soufflenheim (Bas-Rhin).",
  path: "/calendrier",
});

export default async function CalendrierPage() {
  const [events, site] = await Promise.all([getEvents(), getSettings()]);

  /* Les événements dont la date complète est saisie dans l'admin sont
     décrits en schema.org (Event) : Google et les assistants IA
     peuvent alors les annoncer. Sans année, pas de données. */
  const [postalCode, ...cityParts] = site.address.city.split(" ");
  const club = { "@type": "SportsOrganization", "@id": `${SITE_URL}/#club`, name: site.name, url: SITE_URL };
  const eventsJsonLd = events
    .filter((event) => event.date)
    .map((event) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.meta,
      startDate: event.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: site.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode,
          addressLocality: cityParts.join(" ") || site.address.city,
          addressCountry: "FR",
        },
      },
      organizer: club,
      url: `${SITE_URL}/calendrier`,
    }));

  return (
    <>
      {eventsJsonLd.length ? <JsonLd data={eventsJsonLd} /> : null}
      <PageHero
        kicker="Calendrier"
        title="Le calendrier du club"
        text="Tournois, animations, soirées : notez les dates pour ne rien manquer de la vie du club rue de Koenigsbruck."
        echo="Agenda"
        effect="scramble"
        tape={["Départs imminents", "Tournois", "Initiations", "Soirées", "Portes ouvertes", "Padel"]}
      />

      {/* Tableau des départs, façon aéroport : tout passe en palettes */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" beams floaters={[]} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Agenda"
            title="Prochains départs depuis Soufflenheim"
            text="Notez les dates — et pour les tournois, pensez à vous inscrire au club house ou par téléphone. Survolez une ligne pour relancer l'affichage."
          />

          <div className="relative mt-16 overflow-hidden rounded-[1.5rem] border-4 border-night-800 bg-[#07040b] shadow-[0_0_0_1px_rgba(234,51,111,0.3),0_50px_100px_-40px_rgba(234,51,111,0.7)]">
            <div className="flex items-center justify-between gap-4 bg-rose-500 px-5 py-3 text-night-950 sm:px-8">
              <span className="display flex items-center gap-3 text-xl sm:text-2xl">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
                </svg>
                Départs · Departures
              </span>
              <span className="hidden text-xs font-black uppercase tracking-[0.25em] sm:block">Terminal du club</span>
            </div>

            {/* En-têtes de colonnes (grand écran) */}
            <div aria-hidden="true" className="hidden grid-cols-[7rem_1fr_14rem_9rem] gap-6 border-b border-white/10 px-8 py-3 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-rose-300/80 md:grid">
              <span>Date</span>
              <span>Destination</span>
              <span>Porte · Heure</span>
              <span className="text-right">Statut</span>
            </div>

            <ul>
              {events.map((event, i) => {
                const [place, ...rest] = event.meta.split(" · ");
                return (
                  <li
                    key={event.title}
                    className="group grid gap-3 border-b border-white/5 px-5 py-6 transition-colors last:border-b-0 hover:bg-rose-500/[0.07] sm:px-8 md:grid-cols-[7rem_1fr_14rem_9rem] md:items-center md:gap-6"
                  >
                    <SplitFlap
                      text={`${event.day} ${event.month.replace(".", "").slice(0, 4).toUpperCase()}`}
                      className="display text-xl"
                      cell="bg-night-800 text-rose-300"
                      delay={i * 0.1}
                    />
                    <h3 className="display text-2xl leading-tight text-white sm:text-3xl">
                      <SplitFlap text={event.title.toUpperCase()} tight delay={0.2 + i * 0.1} />
                    </h3>
                    <p className="text-sm text-white/70">
                      {place}
                      {rest.length ? <span className="block font-display text-lg text-rose-300">{rest.join(" · ")}</span> : null}
                    </p>
                    <p className="md:text-right">
                      <span
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-display text-sm uppercase tracking-[0.12em] ${
                          i === 0 ? "ix-blink bg-rose-500 text-night-950" : "bg-white/10 text-rose-200"
                        }`}
                      >
                        {i === 0 ? "Embarquement" : "À l'heure"}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <span aria-hidden="true" className="ix-led-dots pointer-events-none absolute inset-0" />
          </div>
          <p className="mt-6 text-center text-xs text-white/60">
            Aucun vol réel au départ du club. Mais côté ambiance, on décolle.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
