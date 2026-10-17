import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getTestimonials } from "@/lib/content";

function Stars() {
  return (
    <div className="flex gap-1 text-rose-500" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
          <path d="M12 2.5 14.9 8.6l6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  return (
    <section className="bg-night-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            kicker="Ils en parlent"
            title="La parole aux membres"
          />
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className="h-full">
              <figure className="card-lift flex h-full flex-col rounded-3xl border border-night-200 bg-white p-8">
                <Stars />
                <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-night-950/75">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5">
                  <span className="display flex h-11 w-11 items-center justify-center rounded-full bg-night-800 text-lg text-rose-400">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-night-950">{t.name}</span>
                    <span className="block text-xs text-night-950/50">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
