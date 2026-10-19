import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SplitFlap from "@/components/fx/SplitFlap";
import { ArrowRight, ArrowUpRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import {
  getCotisationParts,
  getExtras,
  getInfosPratiques,
  getMemberships,
  getSettings,
  getTennisSchool,
} from "@/lib/content";
import { telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs et adhésions tennis & padel",
  description:
    "Adhésions tennis + padel 2026 / 27 : adulte, couple, étudiant, jeunes, joueurs non licenciés au club et entraînements padel. Tous les tarifs du Tennis Padel Club Soufflenheim (Bas-Rhin).",
  path: "/tarifs",
});

function Check({ className = "text-rose-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`mt-0.5 h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

/* Couleurs des trois parts de la cotisation (jauge et pastilles). */
const PART_COLORS = ["from-rose-400 to-rose-500", "from-rose-600 to-ultra-500", "from-ultra-500 to-ultra-700"];

/* ------------------------------------------------------------------ */
/*  Tarifs : prix en afficheurs à palettes (tableau des départs),     */
/*  formule phare en cadre holographique, jauge de cotisation en      */
/*  trois parts, coupon fiscal à découper (ciseaux qui courent sur    */
/*  les pointillés), école de tennis en tableau de score LED, petits  */
/*  plus en billets.                                                  */
/* ------------------------------------------------------------------ */
export default async function TarifsPage() {
  const [memberships, cotisationParts, tennisSchool, extras, infosPratiques, site] =
    await Promise.all([
      getMemberships(),
      getCotisationParts(),
      getTennisSchool(),
      getExtras(),
      getInfosPratiques().then((i) => i.items),
      getSettings(),
    ]);
  return (
    <>
      <PageHero
        kicker="Tarifs & conditions générales — 2026 / 27"
        title="Des formules simples, un club accessible"
        text="Une adhésion annuelle pour jouer au tennis et au padel, en solo, en couple, étudiant ou jeune. Choisissez la formule qui vous ressemble et inscrivez-vous sur Ten'up."
        echo="Tarifs"
        effect="scramble"
        tape={["Saison 2026 / 27", "Tennis + Padel", "Couple", "Étudiant", "Jeunes", "Inscription Ten'up"]}
      />

      {/* Adhésions */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Adhésions annuelles"
            title="Choisissez votre formule"
            text="Le prix affiché est la cotisation au club : la licence FFT s'y ajoute (33 € adulte, 23 € jeune), sauf pour les formules non licencié au club. Survolez un prix pour relancer l'afficheur."
          />
          <div className="mt-20 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {memberships.map((m) => (
              <article
                key={m.name}
                data-tilt
                className={`relative rounded-[2rem] p-[2px] ${
                  m.featured
                    ? "holo-frame shadow-[0_40px_90px_-30px_rgba(234,51,111,0.9)] xl:-translate-y-6"
                    : "bg-white/10"
                }`}
              >
                {m.featured ? (
                  <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 -rotate-3 whitespace-nowrap rounded-full bg-rose-500 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-night-950 shadow-[0_10px_30px_-5px_rgba(234,51,111,0.9)]">
                    ★ Le plus complet
                  </span>
                ) : null}
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-2px)] bg-night-950/95 p-7 backdrop-blur">
                  <h3 className="display text-2xl text-white">{m.name}</h3>
                  <div className="mt-6 flex flex-wrap items-end gap-2">
                    <SplitFlap
                      text={m.price}
                      className="display text-[2.6rem] leading-none"
                      cell={m.featured ? "bg-rose-500 text-night-950" : "bg-night-800 text-rose-300"}
                    />
                    <span className="pb-1 text-sm text-white/60">{m.period}</span>
                  </div>
                  <ul className="mt-7 space-y-3 text-sm text-white/80">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <a
                      href={site.links.inscription}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn w-full ${m.featured ? "btn-rose" : "btn-outline-light"}`}
                    >
                      S&rsquo;inscrire
                      <ArrowUpRight />
                    </a>
                  </div>
                  <div className="nfx-shine" />
                </div>
              </article>
            ))}
          </div>
          <p className="mt-12 text-center text-sm text-white/60">
            Inscription et paiement en ligne sur Ten&rsquo;up : chaque adhérent s&rsquo;inscrit et paie individuellement.
          </p>
        </div>
      </section>

      {/* La cotisation en trois parts */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" floaters={[]} beams />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Transparence"
            title="Cotisation + licence"
            text="Chaque adhésion se compose de deux parts distinctes : la cotisation au club et la licence de la Fédération Française de Tennis."
          />
          {/* Jauge en trois segments qui se remplissent */}
          <div aria-hidden="true" className="mt-16 flex h-6 gap-1.5 overflow-hidden rounded-full bg-white/5 p-1">
            {cotisationParts.map((part, i) => (
              <span
                key={part.name}
                className={`ix-gauge flex-1 rounded-full bg-gradient-to-r shadow-[0_0_20px_rgba(234,51,111,0.6)] ${PART_COLORS[i % 3]}`}
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {cotisationParts.map((part, i) => (
              <div key={part.name} className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                <span className={`display flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white ${PART_COLORS[i % 3]}`}>
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{part.name}</h3>
                <p className="mt-2 text-sm text-white/70">{part.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entraînements : tableau de score */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floor floaters={[]} />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Enseignement"
            title="Progresser avec un coach"
            text="Des entraînements de padel encadrés pour les adultes, à réserver en pack pour la saison."
          />
          <div className="ix-led-board relative mt-16 overflow-hidden rounded-[1.5rem] border-4 border-night-800 bg-[#07040b] shadow-[0_0_0_1px_rgba(234,51,111,0.3),0_40px_90px_-30px_rgba(234,51,111,0.7)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-rose-300 sm:px-10">
              <span>Tableau des cours</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> En direct du club
              </span>
            </div>
            {tennisSchool.map((course, i) => (
              <div
                key={course.name}
                className={`flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 ${
                  i % 2 === 0 ? "bg-white/[0.03]" : ""
                }`}
              >
                <div>
                  <h3 className="display text-xl tracking-wide text-white">{course.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{course.detail}</p>
                </div>
                <SplitFlap text={course.price} className="display text-3xl" cell="bg-night-900 text-rose-400" delay={i * 0.15} />
              </div>
            ))}
            <span aria-hidden="true" className="ix-led-dots pointer-events-none absolute inset-0" />
          </div>
          <p className="mt-8 text-center text-sm text-white/60">
            Paiement exigé dès le premier jour pour les cours, avec possibilité d&rsquo;étalement.
          </p>
        </div>
      </section>

      {/* Bon à savoir : billets */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Bon à savoir"
            title="Les petits plus du club"
            text="Badge d'accès, matériel prêté, remise chez notre partenaire : tout ce qui accompagne votre adhésion."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((extra, i) => (
              <div
                key={extra.name}
                className={`ix-ticket group relative flex overflow-hidden bg-white text-night-950 transition-transform duration-500 hover:-translate-y-2 ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <div className="flex-1 p-6">
                  <h3 className="font-bold">{extra.name}</h3>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-rose-600">{extra.note}</p>
                </div>
                <div className="ix-ticket-stub flex w-28 shrink-0 flex-col items-center justify-center bg-night-950 p-3 text-center text-white transition-transform duration-500 group-hover:rotate-6">
                  <span className="display text-3xl text-rose-300">{extra.price}</span>
                  <span className="mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-white/60">{extra.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur sm:p-12">
            <h3 className="display text-3xl text-white">Conditions générales de l&rsquo;année</h3>
            <ul className="mt-8 grid gap-x-10 gap-y-4 text-sm text-white/80 md:grid-cols-2">
              {infosPratiques.map((info) => (
                <li key={info} className="flex items-start gap-2.5">
                  <Check />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx beams floor fx />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95]">
            Un doute sur la <span className="brand-gradient-text">bonne formule</span>&nbsp;?
          </h2>
          <p className="mt-6 text-lg text-white/75">
            Passez nous voir au Club House pendant les heures de permanence, appelez le{" "}
            <a href={telHref(site.phonePresident)} className="font-bold text-rose-300 hover:underline">
              {site.phonePresident}
            </a>{" "}
            ou écrivez à{" "}
            <a href={`mailto:${site.emails.president}`} className="font-bold text-rose-300 hover:underline">
              {site.emails.president}
            </a>
            &nbsp;: on vous aiguille en deux minutes.
          </p>
          <div className="mt-10">
            <Link href="/contact" className="btn btn-rose">
              Nous contacter
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
