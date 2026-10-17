import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getEvents, getNews } from "@/lib/content";

export default async function NewsAgenda() {
  const [news, events] = await Promise.all([getNews(), getEvents()]);
  return (
    <section id="actualites" className="scroll-mt-20 bg-night-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              align="left"
              kicker="La vie du club"
              title="Actualités & agenda"
              text="Tournois, nouveautés, soirées : il se passe toujours quelque chose rue de Koenigsbruck."
            />
            <Link href="/actualites" className="btn btn-outline-night shrink-0">
              Toutes les actualités
            </Link>
          </div>
        </Reveal>

        {/* Actualités */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {news.slice(0, 3).map((item, i) => (
            <Reveal key={item.slug} delay={i * 120} className="h-full">
              <Link href="/actualites" className="group block h-full">
                <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-night-200 bg-white">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      placeholder={item.image.blurDataURL ? "blur" : "empty"}
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-night-950/80 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-rose-300 backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">
                      {item.date}
                    </time>
                    <h3 className="mt-2.5 text-lg font-bold leading-snug text-night-950 transition-colors group-hover:text-rose-600">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-night-950/60">
                      {item.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-night-800">
                      Lire la suite
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Agenda */}
        <Reveal delay={150}>
          <div className="mt-16 overflow-hidden rounded-3xl bg-night-800 p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="lg:w-64 lg:shrink-0">
                <span className="kicker text-rose-400">Agenda</span>
                <h3 className="display mt-3 text-3xl text-white">
                  Prochains rendez-vous
                </h3>
                <Link
                  href="/calendrier"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-rose-400 transition-colors hover:text-rose-300"
                >
                  Voir tout le calendrier
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                  </svg>
                </Link>
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className="flex items-center gap-4 rounded-2xl bg-white/[0.07] p-4 transition-colors hover:bg-white/[0.12]"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-500 leading-none text-night-950">
                      <span className="display text-xl">{event.day}</span>
                      <span className="text-[0.6rem] font-bold uppercase">
                        {event.month}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold leading-snug text-white">{event.title}</p>
                      <p className="mt-1 text-xs text-white/55">{event.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
