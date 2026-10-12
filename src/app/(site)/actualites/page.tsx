import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getNews } from "@/lib/content";
import type { NewsItem } from "@/lib/content-types";
import { isoFromFrenchDate } from "@/lib/format";
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

export default async function ActualitesPage() {
  const news = await getNews();
  const [featured, ...rest] = news;

  return (
    <>
      <PageHero
        kicker="Actualités"
        title="La vie du club, en direct"
        text="Résultats, nouveautés, coulisses et rendez-vous : suivez tout ce qui se passe rue de Koenigsbruck."
      />

      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* À la une */}
          <Reveal>
            <ArticleLink item={featured} className="block">
              <article className="card-lift group grid overflow-hidden rounded-3xl border border-pine-100 bg-white lg:grid-cols-2">
                <div className="relative h-72 overflow-hidden lg:h-auto">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    placeholder={featured.image.blurDataURL ? "blur" : "empty"}
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-gold-500 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-pine-950 shadow-lg">
                    À la une
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
                    <span className="text-clay-500">{featured.date}</span>
                    <span className="h-1 w-1 rounded-full bg-pine-950/25" />
                    <span className="text-pine-950/50">{featured.category}</span>
                  </div>
                  <h2 className="display mt-4 text-3xl text-pine-950 sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-pine-950/65">
                    {featured.excerpt}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-pine-800">
                    Lire l&rsquo;article complet
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </article>
            </ArticleLink>
          </Reveal>

          {/* Autres articles */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 100} className="h-full">
                <ArticleLink item={item} className="block h-full">
                  <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-pine-100 bg-white">
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        placeholder={item.image.blurDataURL ? "blur" : "empty"}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-pine-950/80 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gold-300 backdrop-blur">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <time dateTime={isoFromFrenchDate(item.date)} className="text-xs font-semibold uppercase tracking-[0.14em] text-clay-500">
                        {item.date}
                      </time>
                      <h3 className="mt-2.5 text-lg font-bold leading-snug text-pine-950">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-pine-950/60">
                        {item.excerpt}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-pine-800">
                        Lire la suite
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </ArticleLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
