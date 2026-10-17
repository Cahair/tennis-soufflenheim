import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getSponsors } from "@/lib/content";

export default async function Sponsors() {
  const sponsors = await getSponsors();
  const loop = [...sponsors, ...sponsors];
  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            kicker="Sponsors"
            title="Ils font gagner le club"
            text="Commerçants et artisans locaux soutiennent le TPCS saison après saison. Merci à eux !"
          />
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="marquee relative mt-14">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
          <div className="marquee-track flex items-center gap-5">
            {loop.map((sponsor, i) => (
              <div
                key={`${sponsor.name}-${i}`}
                className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-night-200 bg-night-50 p-3"
                title={sponsor.name}
              >
                <Image
                  src={sponsor.logo}
                  alt={`Logo ${sponsor.name}`}
                  sizes="160px"
                  className="h-full w-auto rounded-xl object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/sponsors" className="btn btn-night">
            Découvrir tous nos sponsors
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-dashed border-night-300 px-7 py-4 font-semibold text-night-700 transition-colors hover:border-rose-500 hover:text-rose-600"
          >
            Votre entreprise ici ? Devenez partenaire
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
