import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Calendrier",
  description:
    "Tous les prochains rendez-vous du Tennis Padel Club Soufflenheim : tournois, animations padel et pickleball, soirées et événements du club.",
  alternates: { canonical: "/calendrier" },
};

export default async function CalendrierPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero
        kicker="Calendrier"
        title="Le calendrier du club"
        text="Tournois, animations, soirées : notez les dates pour ne rien manquer de la vie du club rue de Koenigsbruck."
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Agenda"
              title="Les prochains rendez-vous"
              text="Notez les dates — et pour les tournois, pensez à vous inscrire au club house ou par téléphone."
            />
          </Reveal>
          <div className="mt-14 space-y-4">
            {events.map((event, i) => (
              <Reveal key={event.title} delay={i * 80}>
                <div className="card-lift flex items-center gap-5 rounded-2xl border border-pine-100 bg-cream-50 p-5 sm:gap-7 sm:p-6">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-pine-800 leading-none text-white shadow-lg shadow-pine-800/20">
                    <span className="display text-2xl text-gold-400">{event.day}</span>
                    <span className="mt-0.5 text-[0.6rem] font-bold uppercase text-white/70">
                      {event.month}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pine-950">{event.title}</h3>
                    <p className="mt-0.5 text-sm text-pine-950/55">{event.meta}</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="hidden h-5 w-5 text-pine-950/25 sm:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
