import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import ApproveCheck from "@/components/fx/ApproveCheck";
import ReadProgress from "@/components/fx/ReadProgress";
import { ArrowUpRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { getSettings } from "@/lib/content";
import { bureau, reglementArticles, reglementMeta } from "@/lib/reglement";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Règlement intérieur",
  description:
    "Membres, cotisations, licence FFT, réservations, discipline : le règlement intérieur du Tennis Padel Club Soufflenheim.",
  path: "/reglement-interieur",
});

const anchor = (i: number) => `article-${i + 1}`;

/* ------------------------------------------------------------------ */
/*  Règlement : barre de lecture à balle, sommaire collant, chaque    */
/*  article en « carton d'arbitre » rose avec numéro géant, bureau en */
/*  cartes de verre, et une case « Lu et approuvé » qui déclenche un  */
/*  feu d'artifice et une pluie de balles.                            */
/* ------------------------------------------------------------------ */
export default async function ReglementPage() {
  const site = await getSettings();
  return (
    <>
      <ReadProgress />
      <PageHero
        kicker={`Règlement intérieur — ${reglementMeta.saison}`}
        title="Les règles du jeu, noir sur blanc"
        text={reglementMeta.preambule}
        echo="Fair-play"
        effect="scramble"
        tape={["Fair-play", "Respect", "Réservations", "Licence FFT", "Bonne humeur", "Règles du jeu"]}
      />

      {/* Articles */}
      <section className="relative bg-night-950 py-28 text-white">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
          <nav aria-label="Sommaire du règlement" className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker text-rose-300">Sommaire</p>
            <ol className="mt-6 space-y-1 border-l border-white/10">
              {reglementArticles.map((article, i) => (
                <li key={article.title}>
                  <a
                    href={`#${anchor(i)}`}
                    className="group -ml-px flex items-baseline gap-3 border-l-2 border-transparent py-1.5 pl-4 text-sm text-white/65 transition-all hover:border-rose-400 hover:pl-6 hover:text-white"
                  >
                    <span className="font-display text-rose-400">{String(i + 1).padStart(2, "0")}</span>
                    {article.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {reglementArticles.map((article, i) => (
              <article
                key={article.title}
                id={anchor(i)}
                className="group relative scroll-mt-28 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/50 sm:p-10 sm:pl-24"
              >
                {/* Le carton : bande rose qui s'agite au survol */}
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-8 hidden h-16 w-11 origin-bottom rounded-md bg-gradient-to-b from-rose-400 to-rose-600 shadow-[0_10px_30px_-5px_rgba(234,51,111,0.8)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 sm:block"
                />
                <span aria-hidden="true" className="hero-outline display pointer-events-none absolute -right-3 -top-8 text-[8rem] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="display relative text-3xl text-white">{article.title}</h2>
                <div className="relative mt-6 space-y-6">
                  {article.sections.map((section, j) => (
                    <div key={section.title ?? j}>
                      {section.title ? (
                        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-rose-300">{section.title}</h3>
                      ) : null}
                      {section.intro ? (
                        <p className="mt-2 text-sm leading-relaxed text-white/75">{section.intro}</p>
                      ) : null}
                      {section.points ? (
                        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/75">
                          {section.points.map((point) => (
                            <li key={point} className="flex items-start gap-2.5">
                              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m5 13 4 4L19 7" />
                              </svg>
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
            <p className="text-center text-sm italic text-white/60">{reglementMeta.approbation}</p>
          </div>
        </div>
      </section>

      {/* Bureau */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Le bureau"
            title="Liste des membres du bureau"
            text="Une question sur le règlement, les cotisations ou la vie du club ? Les membres du bureau sont à votre écoute."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bureau.map((membre) => (
              <div
                key={`${membre.role}-${membre.name}`}
                data-tilt
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-colors duration-500 hover:border-rose-400/60"
              >
                <span aria-hidden="true" className="absolute inset-x-7 top-0 h-[2px] bg-gradient-to-r from-rose-400 to-ultra-500" />
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rose-300">{membre.role}</p>
                <h3 className="display mt-2 text-2xl text-white">{membre.name}</h3>
                <div className="mt-4 space-y-1.5 text-sm text-white/75">
                  <p>
                    <a href={`tel:+33${membre.phone.replaceAll(" ", "").slice(1)}`} className="transition-colors hover:text-rose-300">
                      {membre.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${membre.email}`} className="break-all transition-colors hover:text-rose-300">
                      {membre.email}
                    </a>
                  </p>
                </div>
                <div className="nfx-shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lu et approuvé */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx beams floor fx={false} />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.92]">
            Règlement lu <span className="brand-gradient-text">et approuvé</span>&nbsp;?
          </h2>
          <p className="mt-5 text-lg text-white/75">
            Il ne reste plus qu&rsquo;à choisir votre formule et à remplir le dossier d&rsquo;inscription :
            bienvenue au club !
          </p>
          <div className="mt-10">
            <ApproveCheck />
          </div>
          <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-3">
            <a href={site.links.inscription} target="_blank" rel="noopener noreferrer" className="btn btn-rose">
              S&rsquo;inscrire en ligne
              <ArrowUpRight />
            </a>
            <Link href="/tarifs" className="btn btn-outline-light">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
