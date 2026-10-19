import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import PageHero, { type HeroEffect } from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CourtDrop from "@/components/fx/CourtDrop";
import PadelRally from "@/components/fx/PadelRally";
import SplitFlap from "@/components/fx/SplitFlap";
import TownRadar from "@/components/fx/TownRadar";
import VelocityBands from "@/components/fx/VelocityBands";
import CtaBand from "@/components/home/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { getDisciplines, getMemberships, getSettings } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { NEARBY_TOWNS } from "@/lib/site";
import { sportOrder, sportPages, type SportPage } from "@/lib/sports";

/* Le titre du padel s'écrase. */
const HERO_EFFECT: Record<string, HeroEffect> = { padel: "slam", tennis: "drop", pickleball: "scramble" };

/* ------------------------------------------------------------------ */
/*  Page /padel, la page sports du club : le padel en grand, puis le  */
/*  tennis et le pickleball en version courte (/tennis et /pickleball */
/*  redirigent vers leurs ancres, voir next.config.ts). C'est la page */
/*  que Google propose sur « padel Haguenau », « club de tennis       */
/*  Bas-Rhin »… Textes dans lib/sports.ts ; photo, atouts et tarifs   */
/*  repris du contenu géré dans l'admin.                              */
/*                                                                    */
/*  Mise en scène « soirée padel » : règles jouées en rallye 3D au    */
/*  défilement, rubans qui s'emballent avec la vitesse, atouts qui    */
/*  tombent sur une piste en perspective, formules en billets à       */
/*  palettes, radar des communes voisines.                            */
/* ------------------------------------------------------------------ */
export default async function SportLanding({ sport }: { sport: SportPage }) {
  const [site, disciplines, memberships] = await Promise.all([
    getSettings(),
    getDisciplines(),
    getMemberships(),
  ]);
  const discipline = disciplines.find((d) => d.name === sport.discipline);
  const formulas = sport.memberships
    ? memberships.filter((m) => sport.memberships?.test(m.name))
    : [];
  const others = sportOrder.filter((s) => s !== sport.slug).map((s) => sportPages[s]);
  const ctaExternal = discipline?.cta.href.startsWith("http");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: sport.label, path: `/${sport.slug}` }])} />
      <JsonLd data={faqJsonLd(sport.faqs)} />

      <PageHero
        kicker={sport.hero.kicker}
        title={sport.hero.title}
        text={sport.hero.text}
        echo={sport.label}
        effect={HERO_EFFECT[sport.slug] ?? "drop"}
        tape={[sport.label, ...(discipline?.features ?? []), "Soufflenheim"]}
      />

      <PadelRally />

      {/* Présentation */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white lg:py-36">
        <NightFx glow="right" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
          <div className="lg:col-span-6">
            <SectionHeader align="left" kicker={sport.intro.kicker} title={sport.intro.title} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-white/75 sm:text-lg">
              {sport.intro.paragraphs.map((p, i) => (
                <p key={p} className={i === 0 ? "text-xl text-white first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-rose-400" : ""}>
                  {p}
                </p>
              ))}
            </div>
            {discipline && discipline.features.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {discipline.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1.5 text-xs text-rose-100 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:bg-rose-500/25 hover:shadow-[0_10px_30px_-10px_rgba(234,51,111,0.9)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-4">
              {discipline ? (
                <Link
                  href={discipline.cta.href}
                  {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="btn btn-rose"
                >
                  {discipline.cta.label}
                  {ctaExternal ? <ArrowUpRight /> : <ArrowRight />}
                </Link>
              ) : null}
              <Link href="/contact" className="btn btn-outline-light">
                Nous contacter
              </Link>
            </div>
          </div>
          {discipline ? (
            <div className="relative lg:col-span-5 lg:col-start-8">
              <div
                data-tilt
                className="holo-frame relative rotate-3 rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.8)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-3px)]">
                  <Image
                    src={discipline.image}
                    alt={`${sport.label} au Tennis Padel Club Soufflenheim`}
                    fill
                    placeholder={discipline.image.blurDataURL ? "blur" : "empty"}
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    className="animate-kenburns object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rose-600/60 to-transparent" />
                  <span className="display absolute bottom-5 left-6 text-5xl text-white [text-shadow:0_0_30px_rgba(234,51,111,0.9)]">
                    {sport.label}
                  </span>
                  <div className="nfx-shine" />
                </div>
              </div>
              <span className="absolute -bottom-6 -left-6 rotate-[-8deg] rounded-full bg-rose-500 px-5 py-2.5 font-display text-sm uppercase tracking-[0.2em] text-night-950 shadow-[0_15px_40px_-10px_rgba(234,51,111,0.9)]">
                {discipline.badge}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <VelocityBands
        top={["Padel", "À quatre", "Vitres", "Bandeja", "Víbora", "Smash", "Por tres"]}
        bottom={["Piste couverte", "Réservation 7j/7", "Un tournoi par mois", "Entraîneur padel", "Raquettes prêtées"]}
      />

      {/* Atouts : tombent sur la piste */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx floaters={[]} beams glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader kicker="Les atouts" title={`Pourquoi le ${sport.label.toLowerCase()} ici`} />
          <div className="mt-16">
            <CourtDrop items={sport.highlights} />
          </div>
        </div>
      </section>

      {/* Adhésions concernées : billets à palettes */}
      {formulas.length > 0 ? (
        <section className="relative overflow-clip bg-night-950 py-28 text-white">
          <NightFx glow="right" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker="Adhésions"
              title={`Votre billet ${sport.label.toLowerCase()}`}
              text="Une adhésion annuelle, valable du 1er septembre au 31 août : accès aux installations et réservation en ligne 7j/7."
            />
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formulas.map((m, i) => (
                <div
                  key={m.name}
                  data-tilt
                  className={`ix-ticket group relative flex overflow-hidden text-night-950 transition-transform duration-500 hover:-translate-y-2 ${
                    m.featured ? "bg-gradient-to-br from-rose-400 to-rose-500" : "bg-white"
                  } ${i % 2 ? "rotate-1" : "-rotate-1"}`}
                >
                  <div className="flex-1 p-6">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-night-950/90">
                      Admit one · Saison complète
                    </p>
                    <h3 className="display mt-3 text-2xl leading-tight">{m.name}</h3>
                    <p className="mt-2 text-xs font-semibold text-night-950/90">{m.features[0]}</p>
                  </div>
                  <div className="ix-ticket-stub flex w-28 shrink-0 flex-col items-center justify-center gap-1 bg-night-950 p-3 text-white transition-transform duration-500 group-hover:rotate-6">
                    <SplitFlap text={m.price} className="display text-2xl" cell="bg-night-800 text-rose-300" />
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/60">{m.period}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link href="/tarifs" className="link-arrow text-rose-300 hover:text-white">
                Tous les tarifs et conditions
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader kicker="Questions fréquentes" title={`${sport.label} : vos questions`} />
          <div className="mt-14">
            <Accordion items={sport.faqs} />
          </div>
        </div>
      </section>

      {/* Tennis et pickleball : version courte, le padel reste devant */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx floaters={[]} glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Et aussi au club"
            title="Tennis & pickleball"
            text="Le padel mène la danse, mais la raquette se joue aussi autrement au TPCS."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {others.map((other) => {
              const d = disciplines.find((x) => x.name === other.discipline);
              const external = d?.cta.href.startsWith("http");
              return (
                <article
                  key={other.slug}
                  id={other.slug}
                  className="group relative scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-white/10 bg-night-900/70 transition-colors duration-500 hover:border-rose-400/50"
                >
                  {d ? (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={d.image}
                        alt={`${other.label} au Tennis Padel Club Soufflenheim`}
                        fill
                        placeholder={d.image.blurDataURL ? "blur" : "empty"}
                        sizes="(max-width: 768px) 92vw, 45vw"
                        className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 to-transparent" />
                      <h3 className="display absolute bottom-4 left-7 text-5xl text-white">{other.label}</h3>
                    </div>
                  ) : (
                    <h3 className="display px-7 pt-7 text-5xl text-white">{other.label}</h3>
                  )}
                  <div className="p-7 pt-4">
                    <p className="leading-relaxed text-white/75">{other.hero.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {other.highlights.map((h) => (
                        <li key={h.title} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                          {h.title}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                      {d ? (
                        <Link
                          href={d.cta.href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="link-arrow text-rose-300 hover:text-white"
                        >
                          {d.cta.label}
                          {external ? <ArrowUpRight /> : <ArrowRight />}
                        </Link>
                      ) : null}
                      {other.memberships ? (
                        <Link href="/tarifs" className="link-arrow text-white/70 hover:text-white">
                          Tarifs {other.label.toLowerCase()}
                          <ArrowRight />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Venir au club : le radar des communes voisines */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx floor floaters={[]} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader
              align="left"
              kicker="Venir au club"
              title="Au cœur de l'Alsace du Nord"
              text={`${site.address.street}, ${site.address.city} (Bas-Rhin) : entre la forêt de Haguenau et le Rhin, à une quarantaine de minutes de Strasbourg. Parking gratuit sur place.`}
            />
            <p className="mt-5 text-xs text-white/60">Sur le radar : temps de trajet indicatifs en voiture.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={site.links.itineraire} target="_blank" rel="noopener noreferrer" className="btn btn-rose">
                Voir l&rsquo;itinéraire
                <ArrowUpRight />
              </a>
              <Link href="/contact" className="btn btn-outline-light">
                Accès et contact
              </Link>
            </div>
          </div>
          <TownRadar towns={NEARBY_TOWNS} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
