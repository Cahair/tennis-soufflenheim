import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { getSettings, getSponsors } from "@/lib/content";
import { telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sponsors et partenaires",
  description:
    "Commerçants, artisans et entreprises d'Alsace du Nord soutiennent le Tennis Padel Club Soufflenheim saison après saison. Découvrez nos sponsors et rejoignez-les.",
  path: "/sponsors",
});

const benefits = [
  {
    title: "Visibilité au bord des courts",
    text: "Votre panneau installé face aux courts et à la piste de padel, vu par les joueurs et les visiteurs toute l'année.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M12 17v4m-4 0h8" />
      </svg>
    ),
  },
  {
    title: "Présence lors des tournois",
    text: "Tournois open, fête du club, portes ouvertes : votre marque associée aux temps forts qui rassemblent tout le village.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    title: "Votre logo sur le site",
    text: "Une place sur cette page et sur la page d'accueil, avec un lien vers votre activité pour les centaines de visiteurs du site.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Sponsors : panneaux LED de bord de terrain qui défilent en sens   */
/*  inverse (comme autour d'un stade), logos en panneaux             */
/*  holographiques inclinables, et une case vide qui clignote         */
/*  « votre logo ici ».                                               */
/* ------------------------------------------------------------------ */
export default async function SponsorsPage() {
  const [site, sponsors] = await Promise.all([getSettings(), getSponsors()]);
  const names = sponsors.map((s) => s.name);
  const led = [...names, ...names];

  return (
    <>
      <PageHero
        kicker="Sponsors"
        title="Ils font gagner le club"
        text="Commerçants, artisans et entreprises de la région soutiennent le club saison après saison. Sans eux, pas de tournois, pas de piste de padel, pas de fête du club : merci à eux !"
        echo="Merci"
        effect="drop"
        tape={["Merci", "Partenaires", "Alsace du Nord", "Padel", "Saison après saison", "Merci"]}
      />

      {/* Panneaux LED de bord de terrain */}
      <div aria-hidden="true" className="relative space-y-2 bg-night-950 py-10">
        {[0, 1].map((row) => (
          <div key={row} className="relative overflow-hidden border-y border-rose-500/30 bg-[#07040b] py-4">
            <div
              className={`marquee-track flex ${row ? "marquee-reverse" : ""}`}
              style={{ animationDuration: `${28 + row * 10}s` }}
            >
              {led.map((n, i) => (
                <span
                  key={i}
                  className={`ix-led-text display flex items-center gap-8 whitespace-nowrap pr-8 text-3xl sm:text-5xl ${
                    (i + row) % 2 ? "text-ultra-300" : "text-rose-400"
                  }`}
                >
                  {row ? `Merci ${n}` : n}
                  <span className="text-white/70">✦</span>
                </span>
              ))}
            </div>
            <span className="ix-led-dots pointer-events-none absolute inset-0" />
          </div>
        ))}
      </div>

      {/* Grille des sponsors */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Nos partenaires"
            title="Merci à eux, saison après saison"
            text="Pensez à eux pour vos projets : ce sont eux qui font vivre le club. Réservez-leur le même accueil qu'ils nous réservent."
          />

          <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4">
            {sponsors.map((sponsor, i) => (
              <div
                key={sponsor.name}
                data-tilt
                className={`holo-frame relative rounded-[1.6rem] p-[2px] shadow-[0_30px_60px_-30px_rgba(234,51,111,0.8)] ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[calc(1.6rem-2px)] bg-night-900 p-4 text-center sm:p-5">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
                    <Image
                      src={sponsor.logo}
                      alt={`Logo ${sponsor.name}`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="display mt-4 text-lg leading-snug text-white">{sponsor.name}</h3>
                  {sponsor.detail ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">{sponsor.detail}</p>
                  ) : null}
                  <div className="nfx-shine" />
                </div>
              </div>
            ))}

            {/* La case libre */}
            <Link
              href="/contact"
              className="ix-dash group relative flex min-h-[14rem] flex-col items-center justify-center rounded-[1.6rem] p-5 text-center transition-transform duration-500 hover:scale-105"
            >
              <span className="ix-blink display text-4xl text-rose-400">?</span>
              <span className="display mt-3 text-xl text-white">Votre logo ici</span>
              <span className="mt-2 text-xs text-white/65">Cette place vous attend</span>
              <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-night-950 transition-transform duration-500 group-hover:rotate-90">
                +
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floor floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Devenir partenaire"
            title="Et si votre logo était ici ?"
            text="Le club vit grâce à ses partenaires locaux. En échange, il vous offre une visibilité unique au cœur du village, auprès de centaines de joueurs et de familles."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                data-tilt
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur transition-colors duration-500 hover:border-rose-400/60"
              >
                <span aria-hidden="true" className="hero-outline display pointer-events-none absolute -left-2 -top-6 text-[7rem] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-ultra-500 text-white shadow-[0_0_40px_rgba(234,51,111,0.5)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  {benefit.icon}
                </span>
                <h3 className="display relative mt-6 text-2xl text-white">{benefit.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/70">{benefit.text}</p>
                <div className="nfx-shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA partenariat */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx beams />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="kicker kicker-center text-rose-300">Rejoignez-les</span>
          <h2 className="display mt-5 text-[clamp(3rem,8vw,6.5rem)] leading-[0.9]">
            Devenez sponsor <span className="brand-gradient-text">du club</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Panneau au bord des courts, visibilité lors des tournois et sur le site : contactez le président
            pour recevoir le dossier de partenariat.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-rose">
              Demander le dossier de partenariat
              <ArrowRight />
            </Link>
            <a href={telHref(site.phonePresident)} className="btn btn-outline-light">
              {site.president} · {site.phonePresident}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
