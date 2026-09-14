import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getDisciplines } from "@/lib/content";

export default async function Disciplines() {
  const disciplines = await getDisciplines();
  return (
    <section id="disciplines" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            kicker="Nos sports"
            title="Trois façons de faire vibrer la raquette"
            text="Du tennis historique au padel qui cartonne, sans oublier le pickleball tout juste arrivé : il y a forcément un terrain pour vous."
          />
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Reveal key={d.name} delay={i * 120} className="h-full">
              <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-pine-100 bg-cream-50">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    placeholder={d.image.blurDataURL ? "blur" : "empty"}
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-pine-950 shadow-lg">
                    {d.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="display text-3xl text-pine-950">{d.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-pine-950/65">
                    {d.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {d.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-pine-950/80">
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={d.cta.href}
                    {...(d.cta.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group/link mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-pine-800 transition-colors hover:text-clay-500"
                  >
                    {d.cta.label}
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
