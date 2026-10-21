import type { Metadata } from "next";
import Link from "next/link";
import FitImage from "@/components/FitImage";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx, { PadelBall } from "@/components/landing/NightFx";
import { getNews } from "@/lib/content";
import type { NewsItem } from "@/lib/content-types";
import { frenchLongDate, isoFromFrenchDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Actualités",
  description:
    "Tournois, nouveautés padel et pickleball, résultats et coulisses : toute la vie du Tennis Padel Club Soufflenheim, en Alsace du Nord.",
  path: "/actualites",
});

/* Carte cliquable vers la page de l'article — sauf s'il n'a pas
   d'identifiant technique, sans lequel il n'a pas de page. */
function ArticleLink({
  item,
  className,
  children,
}: {
  item: NewsItem;
  className?: string;
  children: React.ReactNode;
}) {
  if (!item.slug) return <div className={className}>{children}</div>;
  return (
    <Link href={`/actualites/${item.slug}`} className={className}>
      {children}
    </Link>
  );
}

/* Date en rose sur les cartes : celle de l'événement annoncé s'il y en
   a une, sinon celle de publication. */
function shownDate(item: NewsItem) {
  const label = item.eventDate ? frenchLongDate(item.eventDate) : undefined;
  return label
    ? { iso: item.eventDate, label }
    : { iso: isoFromFrenchDate(item.date), label: item.date };
}

/* Coupures de presse punaisées : une inclinaison par position. */
const PIN_TILTS = ["-rotate-2", "rotate-1", "rotate-3", "-rotate-1", "rotate-2", "-rotate-3"];

/* ------------------------------------------------------------------ */
/*  Actualités en « Gazette du club » : bandeau Flash info qui        */
/*  défile, manchette de journal, article à la une avec tampon        */
/*  tournant, et les autres articles en coupures de presse punaisées  */
/*  par des balles de padel sur un tableau d'affichage de nuit.       */
/* ------------------------------------------------------------------ */
export default async function ActualitesPage() {
  const news = await getNews();
  const [featured, ...rest] = news;
  const flash = [...news, ...news];

  return (
    <>
      <PageHero
        kicker="Actualités"
        title="La vie du club, en direct"
        text="Résultats, nouveautés, coulisses et rendez-vous : suivez tout ce qui se passe rue de Koenigsbruck."
        echo="Flash"
        effect="slam"
        tape={["Dernière minute", "Tournois", "Résultats", "Coulisses", "Padel", "Exclusif"]}
      />

      {/* Flash info */}
      <div className="relative z-10 flex overflow-hidden border-y-2 border-night-950 bg-rose-500 text-night-950">
        <span className="ix-blink display relative z-10 flex shrink-0 items-center gap-2 bg-night-950 px-5 py-3 text-lg text-rose-400 sm:text-xl">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          Flash info
        </span>
        <div className="marquee flex-1 overflow-hidden py-3">
          <div className="marquee-track flex" style={{ animationDuration: "60s" }}>
            {flash.map((item, i) => (
              <span key={i} className="display flex items-center gap-6 whitespace-nowrap pr-6 text-lg sm:text-xl">
                {item.title}
                <span aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="relative overflow-clip bg-night-950 pb-32 pt-20 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Manchette */}
          <header className="border-b-4 border-double border-white/20 pb-6 text-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-rose-300">
              Édition n° {news.length} · Soufflenheim · Gratuit
            </p>
            <p className="display mt-3 text-[clamp(3rem,10vw,8rem)] leading-[0.85]">
              La Gazette <span className="hero-outline">du club</span>
            </p>
          </header>

          {/* À la une */}
          <ArticleLink item={featured} className="group mt-14 block">
            <article className="grid items-center gap-10 lg:grid-cols-12">
              <div data-tilt className="holo-frame relative rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.85)] lg:col-span-7">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[calc(2rem-3px)]">
                  <FitImage
                    image={featured.image}
                    alt={featured.title}
                    sizes="(max-width: 1024px) 92vw, 58vw"
                    className="transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rose-600/50 to-transparent" />
                  <div className="nfx-shine" />
                </div>
                {/* Tampon « À la une » qui tourne */}
                <span aria-hidden="true" className="absolute -right-6 -top-8 flex h-28 w-28 items-center justify-center sm:-right-10 sm:h-32 sm:w-32">
                  <svg viewBox="0 0 200 200" className="spin-text absolute inset-0 h-full w-full">
                    <defs>
                      <path id="une-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                    </defs>
                    <circle cx="100" cy="100" r="98" className="fill-rose-500" />
                    <text className="fill-night-950 font-display text-[22px] font-semibold uppercase">
                      <textPath href="#une-circle" textLength="452" lengthAdjust="spacing">
                        À la une ✦ À la une ✦ À la une ✦
                      </textPath>
                    </text>
                  </svg>
                  <PadelBall className="relative h-10 w-10" />
                </span>
              </div>
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
                  <time dateTime={shownDate(featured).iso} className="text-rose-300">
                    {shownDate(featured).label}
                  </time>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="text-white/60">{featured.category}</span>
                </div>
                <h2 className="display mt-5 text-[clamp(2.4rem,4.5vw,4rem)] leading-[0.95] transition-colors group-hover:text-rose-300">
                  {featured.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">{featured.excerpt}</p>
                <span className="link-arrow mt-8 text-rose-300">
                  Lire l&rsquo;article complet
                  <ArrowRight />
                </span>
              </div>
            </article>
          </ArticleLink>

          {/* Le tableau d'affichage */}
          <p className="kicker mt-28 text-rose-300">Épinglé au tableau</p>
          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => (
              <ArticleLink key={item.slug || item.title} item={item} className={`group block h-full ${i % 3 === 1 ? "lg:mt-10" : ""}`}>
                <article
                  className={`relative flex h-full flex-col bg-night-100 p-3 pb-6 text-night-950 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] transition-[rotate,scale,box-shadow] duration-500 group-hover:rotate-0 group-hover:scale-[1.03] group-hover:shadow-[0_40px_80px_-25px_rgba(234,51,111,0.7)] ${
                    PIN_TILTS[i % PIN_TILTS.length]
                  }`}
                >
                  {/* La punaise : une balle de padel */}
                  <span aria-hidden="true" className="absolute -top-4 left-1/2 z-10 h-9 w-9 -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-180">
                    <PadelBall className="h-full w-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)]" />
                  </span>
                  <div className="relative h-48 overflow-hidden">
                    <FitImage
                      image={item.image}
                      alt={item.title}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="grayscale-[35%] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <span className="absolute left-3 top-3 bg-night-950 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-rose-300">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-2 pt-4">
                    <time dateTime={shownDate(item).iso} className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">
                      {shownDate(item).label}
                    </time>
                    <h3 className="display mt-2 text-2xl leading-tight">{item.title}</h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-night-950/75">{item.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-rose-600">
                      Lire la suite
                      <ArrowRight />
                    </span>
                  </div>
                </article>
              </ArticleLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
