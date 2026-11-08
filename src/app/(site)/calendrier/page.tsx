import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/home/CtaBand";
import NightFx from "@/components/landing/NightFx";
import { getEvents, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Calendrier des tournois et événements",
  description:
    "Tournois de tennis et de padel, initiations, soirées : tous les prochains rendez-vous du Tennis Padel Garden Club de Soufflenheim (Bas-Rhin).",
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
      />

      {/* Les prochaines dates, en cartes : la date en grand, le reste en dessous */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" beams floaters={[]} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Agenda"
            title="Les prochains rendez-vous"
            text="Notez les dates — et pour les tournois, pensez à vous inscrire au club house ou par téléphone."
          />

          <ul className="mt-16 grid gap-5 sm:grid-cols-2">
            {events.map((event) => {
              const [place, ...rest] = event.meta.split(" · ");
              return (
                <li
                  key={event.title}
                  data-tilt
                  className="relative flex gap-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-rose-400/40 sm:p-8"
                >
                  <p className="flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-rose-500 py-4 text-night-950">
                    <span className="display text-4xl leading-none">{event.day}</span>
                    <span className="mt-1 text-xs font-bold uppercase tracking-[0.2em]">{event.month}</span>
                  </p>
                  <div className="min-w-0 self-center">
                    <h3 className="display text-2xl leading-tight text-white sm:text-3xl">{event.title}</h3>
                    <p className="mt-2 text-sm text-white/70">
                      {place}
                      {rest.length ? <span className="block text-rose-300">{rest.join(" · ")}</span> : null}
                    </p>
                  </div>
                  <div className="nfx-shine" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
