import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import HistoireChrono from "@/components/HistoireChrono";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/home/CtaBand";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import {
  getCommittee,
  getFacilities,
  getHistoireChapitres,
  getHistoireInfos,
  getSettings,
} from "@/lib/content";
import { telHref } from "@/lib/format";
import { logoHistorique } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Le club : histoire et installations",
  description:
    "Depuis 1979, le Tennis Padel Club Soufflenheim fait vivre le tennis et le padel en Alsace du Nord (Bas-Rhin) : histoire, comité, courts, padel couvert et club house.",
  path: "/le-club",
});

/* Les petits plus, en autocollants inclinés (une rotation par position). */
const EXTRAS = ["Terrain de pétanque", "Espace vert", "Parking gratuit illimité", "Terrasse ombragée", "Cuisine équipée"];
const TILTS = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6", "-rotate-3"];

/* ------------------------------------------------------------------ */
/*  Le club : frise néon de l'histoire, mot du président en enseigne, */
/*  souvenir en polaroïd scotché, mur des bénévoles qui défile en     */
/*  trois rubans, installations en cartes qui s'empilent au           */
/*  défilement (position sticky), petits plus en autocollants.        */
/* ------------------------------------------------------------------ */
export default async function LeClubPage() {
  const [site, committee, facilities, histoireChapitres, histoireInfos] =
    await Promise.all([
      getSettings(),
      getCommittee(),
      getFacilities(),
      getHistoireChapitres(),
      getHistoireInfos(),
    ]);
  const names = committee.map((m) => m.name);
  const wall = [...names, ...names];

  return (
    <>
      <PageHero
        kicker="Le club"
        title="Une histoire de famille depuis 1979"
        text="Du premier échange rue de Koenigsbruck à la piste de padel dernière génération : presque un demi-siècle de passion, porté par des bénévoles qui ne lâchent rien."
        echo="1979"
        effect="neon"
        tape={["Depuis 1979", "Bénévoles", "Famille", "Padel", "Tennis", "Fêtes du club", "Soufflenheim"]}
      />

      {/* Histoire du club, en ordre chronologique */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="left"
            kicker="Notre histoire"
            title="Presque 50 ans de petites et grandes victoires"
            text="De la fondation en 1979 à l'arrivée du padel : replongez dans les archives du club, année après année. Cliquez sur une photo pour l'agrandir et feuilleter l'album."
          />
          <div className="mt-20">
            <HistoireChrono chapitres={histoireChapitres} />
          </div>
        </div>
      </section>

      {/* Le mot du président, en enseigne néon */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx beams floaters={[]} />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span aria-hidden="true" className="hero-neon display block text-[10rem] leading-[0.6] text-rose-400">
            &ldquo;
          </span>
          <p className="kicker kicker-center mt-6 text-rose-300">Le mot du président</p>
          <blockquote className="mt-8 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-light leading-snug text-white">
            {site.motPresident}
          </blockquote>
          <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-rose-400/40 bg-rose-500/10 py-2 pl-2 pr-6 text-left backdrop-blur">
            <span className="display flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-ultra-500 text-xl text-white">
              {site.president.charAt(0)}
            </span>
            <span>
              <span className="block font-bold">{site.president}</span>
              <span className="block text-xs text-white/70">
                Président ·{" "}
                <a href={telHref(site.phonePresident)} className="hover:text-rose-300">
                  {site.phonePresident}
                </a>
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Remerciements, souvenir et bénévoles de l'histoire */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <figure data-tilt className="relative mx-auto max-w-lg -rotate-3 bg-white p-3 pb-12 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)]">
            <span aria-hidden="true" className="absolute -top-4 left-1/2 z-10 h-8 w-32 -translate-x-1/2 rotate-2 bg-rose-300/70" />
            <Image
              src={logoHistorique}
              alt="L'ancien logo du Tennis Club Soufflenheim, sur terre battue"
              placeholder="blur"
              sizes="(max-width: 1024px) 90vw, 32rem"
              className="h-auto w-full"
            />
            <figcaption className="absolute inset-x-3 bottom-3 text-center font-display text-sm text-night-900">
              Souvenir : la bannière historique du Tennis Club
            </figcaption>
            <div className="nfx-shine" />
          </figure>
          <div>
            <p className="kicker text-rose-300">Merci à eux</p>
            <p className="mt-6 text-xl leading-relaxed text-white/85">{histoireInfos.remerciements}</p>
            <div className="mt-10">
              <Accordion
                defaultOpen={null}
                items={[
                  {
                    q: `Les membres du comité au fil des années (${histoireInfos.membresComite.length})`,
                    a: histoireInfos.membresComite.join(" · "),
                  },
                  {
                    q: `Les éducateurs et animateurs sportifs (${histoireInfos.educateurs.length})`,
                    a: histoireInfos.educateurs.join(" · "),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comité : le mur des bénévoles qui défile */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Le comité"
            title="Une équipe de bénévoles engagés"
            text={`Derrière chaque tournoi, chaque soirée et chaque court entretenu, il y a des mains bénévoles : ${committee.length} membres répartis entre le bureau et quatre commissions.`}
          />
        </div>
        <div aria-hidden="true" className="marquee mt-16 -rotate-2 space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="overflow-hidden">
              <div
                className={`marquee-track flex ${row % 2 ? "marquee-reverse" : ""}`}
                style={{ animationDuration: `${30 + row * 8}s` }}
              >
                {wall.map((n, i) => (
                  <span
                    key={i}
                    className={`display flex items-center gap-6 pr-6 text-[clamp(2.5rem,6vw,5rem)] leading-none ${
                      (i + row) % 3 === 0 ? "text-rose-400" : (i + row) % 3 === 1 ? "hero-outline" : "text-white"
                    }`}
                  >
                    {n}
                    <span className="text-2xl text-ultra-400">✦</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-16 text-center">
          <Link href="/comite" className="btn btn-rose">
            Découvrir le comité
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Installations : cartes qui s'empilent au défilement */}
      <section id="installations" className="relative scroll-mt-20 bg-night-950 py-28 text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Les installations"
            title="Tout pour jouer, tout pour rester"
            text="Courts, piste de padel, club house avec cuisine, pétanque et espace vert : le TPCS est pensé pour les sportifs comme pour les supporters."
          />
          <div className="mt-16">
            {facilities.map((facility, i) => (
              <article
                key={facility.title}
                className="sticky mb-10 last:mb-0"
                style={{ top: `${6 + i * 1.5}rem` }}
              >
                <div
                  className={`holo-frame rounded-[2rem] p-[2px] shadow-[0_-30px_80px_-30px_rgba(10,6,16,1),0_40px_90px_-40px_rgba(234,51,111,0.8)] ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  }`}
                >
                  <div className="grid overflow-hidden rounded-[calc(2rem-2px)] bg-night-900 md:grid-cols-2">
                    <div className={`relative h-64 md:h-[26rem] ${i % 2 ? "md:order-2" : ""}`}>
                      <Image
                        src={facility.image}
                        alt={facility.title}
                        fill
                        placeholder={facility.image.blurDataURL ? "blur" : "empty"}
                        sizes="(max-width: 768px) 92vw, 45vw"
                        className="object-cover"
                      />
                      <span className="absolute left-5 top-5 rounded-full bg-rose-500 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-night-950 shadow-lg">
                        {facility.tag}
                      </span>
                    </div>
                    <div className="relative flex flex-col justify-center p-8 sm:p-12">
                      <span aria-hidden="true" className="hero-outline display absolute right-6 top-4 text-[6rem] leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="display relative text-4xl text-white sm:text-5xl">{facility.title}</h3>
                      <p className="relative mt-4 leading-relaxed text-white/70">{facility.detail}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-20 flex flex-wrap items-center justify-center gap-4">
            {EXTRAS.map((extra, i) => (
              <li
                key={extra}
                className={`${TILTS[i % TILTS.length]} cursor-default rounded-2xl border-2 border-dashed border-night-950/40 bg-rose-400 px-5 py-3 font-display text-lg uppercase text-night-950 shadow-[0_15px_30px_-10px_rgba(234,51,111,0.8)] transition-transform duration-300 hover:rotate-0 hover:scale-110`}
              >
                {extra}
              </li>
            ))}
          </ul>

          <div className="mt-16 text-center">
            <Link href="/tarifs" className="link-arrow text-rose-300 hover:text-white">
              Voir les formules d&rsquo;adhésion
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
