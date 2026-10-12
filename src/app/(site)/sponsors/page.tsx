import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M12 17v4m-4 0h8" />
      </svg>
    ),
  },
  {
    title: "Présence lors des tournois",
    text: "Tournois open, fête du club, portes ouvertes : votre marque associée aux temps forts qui rassemblent tout le village.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    title: "Votre logo sur le site",
    text: "Une place sur cette page et sur la page d'accueil, avec un lien vers votre activité pour les centaines de visiteurs du site.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      </svg>
    ),
  },
];

export default async function SponsorsPage() {
  const [site, sponsors] = await Promise.all([getSettings(), getSponsors()]);
  return (
    <>
      <PageHero
        kicker="Sponsors"
        title="Ils font gagner le club"
        text="Commerçants, artisans et entreprises de la région soutiennent le TPCS saison après saison. Sans eux, pas de tournois, pas de piste de padel, pas de fête du club : merci à eux !"
      />

      {/* Grille des sponsors */}
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Nos partenaires"
              title="Merci à eux, saison après saison"
              text="Pensez à eux pour vos projets : ce sont eux qui font vivre le club. Réservez-leur le même accueil qu'ils nous réservent."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {sponsors.map((sponsor, i) => (
              <Reveal key={sponsor.name} delay={(i % 4) * 80} className="h-full">
                <div className="card-lift flex h-full flex-col items-center rounded-3xl border border-pine-100 bg-white p-5 text-center sm:p-6">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                    <Image
                      src={sponsor.logo}
                      alt={`Logo ${sponsor.name}`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="display mt-4 text-lg leading-snug text-pine-950">
                    {sponsor.name}
                  </h3>
                  {sponsor.detail ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-pine-950/55">
                      {sponsor.detail}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Devenir partenaire"
              title="Et si votre logo était ici ?"
              text="Le club vit grâce à ses partenaires locaux. En échange, il vous offre une visibilité unique au cœur du village, auprès de centaines de joueurs et de familles."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 100} className="h-full">
                <div className="card-lift flex h-full flex-col items-center rounded-3xl border border-pine-100 bg-cream-50 p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-800 text-gold-400">
                    {benefit.icon}
                  </span>
                  <h3 className="display mt-5 text-xl text-pine-950">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-pine-950/65">
                    {benefit.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA partenariat */}
      <section className="relative overflow-hidden bg-pine-950 py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50rem 25rem at 15% 110%, rgba(237,177,17,0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <span className="kicker text-gold-400">Rejoignez-les</span>
            <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
              Devenez sponsor du TPCS
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Panneau au bord des courts, visibilité lors des tournois et sur le
              site : contactez le président pour recevoir le dossier de
              partenariat.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn btn-gold">
                Demander le dossier de partenariat
              </Link>
              <a href={telHref(site.phonePresident)} className="btn btn-outline-light">
                {site.president} · {site.phonePresident}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
