import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/home/CtaBand";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { presidentMicro } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Le mot du président",
  description:
    "Serge Moreau, président du Tennis Padel Garden Club de Soufflenheim : une belle aventure humaine, sportive et collective, et l'envie de continuer à l'écrire ensemble.",
  path: "/mot-du-president",
});

/* Texte transmis par le président (nov. 2026), tel quel. */
const paragraphs = [
  "Bienvenue au Tennis Padel Garden Club de Soufflenheim !",
  "Lorsque nous avons imaginé le développement de notre club, notre ambition était simple : créer un lieu où le sport serait bien plus qu’une activité physique, un véritable espace de rencontres, de partage et de convivialité.",
  "Aujourd’hui, lorsque je regarde le chemin parcouru, je ressens beaucoup de fierté, mais surtout une grande satisfaction de voir cette belle aventure prendre une telle dimension.",
  "En quelques années, notre club a profondément évolué. De nouvelles infrastructures ont vu le jour, avec deux pistes de padel couvertes, une piste extérieure, un espace tennis, un Club House rénové et notre espace Garden.",
  "Mais au-delà des équipements, ce qui fait véritablement la richesse de notre club, ce sont les femmes et les hommes qui le font vivre chaque jour.",
  "Ma conviction est que nous ne construisons pas simplement un club sportif, nous construisons un lieu de vie.",
  "Un lieu où les générations se rencontrent, où les débutants côtoient les joueurs confirmés, où les familles, les amis et les entreprises peuvent partager des moments privilégiés.",
  "Notre volonté est d’ouvrir toujours davantage notre association à tous les publics : les jeunes, les femmes, les seniors, les entreprises et les personnes en situation de handicap.",
  "Le développement du padel, du tennis et demain du pickleball nous offre de nouvelles perspectives passionnantes.",
  "Nous souhaitons également continuer à innover, à développer nos infrastructures et à proposer des événements sportifs et festifs qui donnent envie de se retrouver.",
  "Je suis convaincu que la réussite d’une association ne se mesure pas uniquement au nombre de terrains ou d’adhérents, mais avant tout à l’énergie collective, à l’engagement des bénévoles, à la fidélité de nos partenaires et au plaisir que chacun éprouve à venir au club.",
  "Je tiens à remercier sincèrement toutes celles et ceux qui nous accompagnent et qui contribuent à faire grandir ce projet.",
  "L’histoire du Tennis Padel Garden Club de Soufflenheim ne fait que commencer.",
  "Nous avons encore de belles ambitions, de nombreux projets et surtout l’envie de continuer à écrire cette histoire ensemble.",
  "Je vous souhaite à toutes et à tous de très beaux moments sportifs et humains parmi nous.",
  "Au plaisir de vous retrouver sur nos terrains ou autour d’un verre au Club House !",
];

/* La phrase forte du texte, mise en exergue entre deux paragraphes. */
const PULL_QUOTE_AFTER = 4;
const pullQuote =
  "Nous ne construisons pas simplement un club sportif, nous construisons un lieu de vie.";

/* ------------------------------------------------------------------ */
/*  Le mot du président : une lettre, en grand, avec sa photo. Aucun  */
/*  effet superflu, la lecture d'abord.                               */
/* ------------------------------------------------------------------ */
export default function MotDuPresidentPage() {
  return (
    <>
      <PageHero
        kicker="Le mot du président"
        title="Une belle aventure humaine, sportive et collective"
        echo="Bienvenue"
        effect="drop"
      />

      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" floaters={[]} />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Photo du président, collée façon souvenir, fixe au défilement */}
          <div className="lg:col-span-4">
            <figure
              data-tilt
              className="relative mx-auto max-w-xs -rotate-2 bg-white p-3 pb-14 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] lg:sticky lg:top-28"
            >
              <span aria-hidden="true" className="absolute -top-4 left-1/2 z-10 h-8 w-28 -translate-x-1/2 rotate-2 bg-rose-300/70" />
              <Image
                src={presidentMicro}
                alt="Serge Moreau, président du club, au micro lors de l'inauguration de la halle de padel"
                placeholder="blur"
                sizes="(max-width: 1024px) 80vw, 20rem"
                className="h-auto w-full"
              />
              <figcaption className="absolute inset-x-3 bottom-3 text-center font-display text-night-900">
                Serge Moreau
                <span className="block text-xs font-sans font-semibold uppercase tracking-[0.2em] text-night-900/60">
                  Président
                </span>
              </figcaption>
              <div className="nfx-shine" />
            </figure>
          </div>

          {/* La lettre */}
          <article className="lg:col-span-8">
            <div className="space-y-6 text-lg leading-relaxed text-white/80">
              {paragraphs.map((p, i) => (
                <div key={i}>
                  <p className={i === 0 ? "display text-3xl leading-tight text-white sm:text-4xl" : undefined}>{p}</p>
                  {i === PULL_QUOTE_AFTER ? (
                    <blockquote className="my-14 border-l-4 border-rose-500 pl-6">
                      <p className="display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-rose-300">
                        «&nbsp;{pullQuote}&nbsp;»
                      </p>
                    </blockquote>
                  ) : null}
                </div>
              ))}
            </div>

            <footer className="mt-14 border-t border-white/10 pt-8">
              <p className="display text-3xl text-white">Serge Moreau</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/60">
                Président du Tennis Padel Garden Club de Soufflenheim
              </p>
              <p className="display mt-8 text-2xl text-rose-400">Jouez, partagez, profitez&nbsp;!</p>
            </footer>

            <div className="mt-14 flex flex-wrap gap-4">
              <Link href="/le-club" className="btn btn-rose">
                L&rsquo;histoire du club
                <ArrowRight />
              </Link>
              <Link href="/comite" className="btn btn-outline-light">
                Le comité
              </Link>
            </div>
          </article>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
