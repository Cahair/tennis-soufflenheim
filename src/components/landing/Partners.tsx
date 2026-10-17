import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "@/lib/content-types";
import { ArrowRight } from "./Arrow";

/* Partenaires — un ruban discret de logos, en niveaux de gris. */
export default function Partners({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  const loop = [...sponsors, ...sponsors];

  return (
    <section
      aria-label="Nos partenaires"
      className="border-t border-night-950/10 bg-night-50 py-20 lg:py-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <p className="kicker text-rose-600">Ils soutiennent le club</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/sponsors" className="link-arrow text-night-900">
            Tous nos sponsors
            <ArrowRight />
          </Link>
          <Link href="/contact" className="link-arrow text-night-900/70">
            Devenir partenaire
            <ArrowRight />
          </Link>
        </div>
      </div>

      <div className="marquee relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night-50 to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-night-50 to-transparent sm:w-40" />
        {/* pr = gap : les deux moitiés identiques bouclent sans à-coup */}
        <ul className="marquee-track flex items-center gap-14 pr-14">
          {loop.map((sponsor, i) => {
            const copy = i >= sponsors.length;
            return (
              <li
                key={`${sponsor.name}-${i}`}
                aria-hidden={copy ? true : undefined}
                title={sponsor.name}
                className="flex h-20 w-32 shrink-0 items-center justify-center"
              >
                <Image
                  src={sponsor.logo}
                  alt={copy ? "" : `Logo ${sponsor.name}`}
                  sizes="128px"
                  className="max-h-full w-auto object-contain opacity-60 mix-blend-multiply grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
