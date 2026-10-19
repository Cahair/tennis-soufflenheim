import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "@/lib/content-types";
import { ArrowRight } from "./Arrow";

/* Partenaires — deux rubans de logos sur tuiles blanches qui défilent
   en sens contraires, sur fond de nuit. Les logos (fonds blancs) restent
   lisibles ; au survol, la tuile se soulève, s'incline et s'illumine. */
export default function Partners({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  const loop = [...sponsors, ...sponsors];
  const rows = [
    { reverse: false, tilt: "-rotate-[1.5deg]" },
    { reverse: true, tilt: "rotate-[1.5deg]" },
  ];

  return (
    <section
      aria-label="Nos partenaires"
      className="relative overflow-clip bg-night-950 py-24 text-white lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[min(80rem,160%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-rose-500/20 via-ultra-500/10 to-transparent to-70%"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="kicker text-rose-300">Ils soutiennent le club</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.9]">
            Merci à nos <span className="brand-gradient-text">partenaires</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/sponsors" className="link-arrow text-white">
            Tous nos sponsors
            <ArrowRight />
          </Link>
          <Link href="/contact" className="link-arrow text-rose-300">
            Devenir partenaire
            <ArrowRight />
          </Link>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-6">
        {rows.map((row, r) => (
          <div key={r} aria-hidden={r === 1 ? true : undefined} className={`marquee relative -mx-[3%] ${row.tilt}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night-950 to-transparent sm:w-48" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-night-950 to-transparent sm:w-48" />
            {/* pr = gap : les deux moitiés identiques bouclent sans à-coup */}
            <ul className={`marquee-track flex items-center gap-6 py-6 pr-6 ${row.reverse ? "marquee-reverse" : ""}`}>
              {loop.map((sponsor, i) => {
                const copy = r === 1 || i >= sponsors.length;
                return (
                  <li
                    key={`${sponsor.name}-${i}`}
                    aria-hidden={copy ? true : undefined}
                    title={sponsor.name}
                    className="partner-tile group flex h-28 w-40 shrink-0 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_18px_40px_-20px_rgba(234,51,111,0.6)] ring-1 ring-white/10 transition duration-500 hover:-translate-y-2 hover:rotate-[-4deg] hover:scale-110 hover:shadow-[0_0_0_3px_var(--color-rose-400),0_25px_60px_-15px_rgba(234,51,111,0.95)] sm:h-32 sm:w-48"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={copy ? "" : `Logo ${sponsor.name}`}
                      sizes="192px"
                      className="max-h-full w-auto object-contain transition duration-500 group-hover:scale-105"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
