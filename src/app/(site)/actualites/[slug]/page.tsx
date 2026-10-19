import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import CursorList from "@/components/fx/CursorList";
import ReadProgress from "@/components/fx/ReadProgress";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { getNews, getSettings } from "@/lib/content";
import { isoFromFrenchDate, paragraphs } from "@/lib/format";
import { OG_IMAGE, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Page d'un article. Une adresse propre par actualité, datée et     */
/*  décrite en schema.org (Article) : c'est ce que Google et les      */
/*  assistants IA citent quand on les interroge sur la vie du club.   */
/*  Les articles ajoutés dans l'admin sont rendus à la demande.       */
/* ------------------------------------------------------------------ */

type Props = { params: Promise<{ slug: string }> };

async function findArticle(slug: string) {
  const news = await getNews();
  const article = news.find((item) => item.slug === slug);
  return { news, article };
}

export async function generateStaticParams() {
  const news = await getNews();
  return news.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await findArticle(slug);
  if (!article) return {};
  const base = pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/actualites/${article.slug}`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: isoFromFrenchDate(article.date),
      section: article.category,
      images: [
        { url: article.image.src, width: article.image.width, height: article.image.height, alt: article.title },
        OG_IMAGE,
      ],
    },
  };
}

function absolute(src: string): string {
  return src.startsWith("/") ? `${SITE_URL}${src}` : src;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [{ news, article }, site] = await Promise.all([findArticle(slug), getSettings()]);
  if (!article) notFound();

  const url = `${SITE_URL}/actualites/${article.slug}`;
  const published = isoFromFrenchDate(article.date);
  const body = paragraphs(article.content ?? "");
  const others = news.filter((item) => item.slug && item.slug !== article.slug).slice(0, 3);

  const club = { "@type": "SportsOrganization", "@id": `${SITE_URL}/#club`, name: site.name, url: SITE_URL };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.excerpt,
        ...(body.length ? { articleBody: body.join("\n\n") } : {}),
        image: [absolute(article.image.src)],
        ...(published ? { datePublished: published } : {}),
        articleSection: article.category,
        inLanguage: "fr-FR",
        author: club,
        publisher: club,
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Actualités", item: `${SITE_URL}/actualites` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ReadProgress />
      <PageHero
        kicker={`Actualités · ${article.category}`}
        title={article.title}
        text={article.excerpt}
        effect="drop"
        tape={[article.category, "La Gazette du club", "Soufflenheim", "Padel", "Exclusif"]}
      />

      <section className="relative overflow-clip bg-night-950 py-24 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
              <time dateTime={published} className="text-rose-300">
                {article.date}
              </time>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="text-white/60">{article.category}</span>
            </div>
            <div data-tilt className="holo-frame relative mt-8 -rotate-1 rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.85)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(2rem-3px)]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  preload
                  placeholder={article.image.blurDataURL ? "blur" : "empty"}
                  sizes="(max-width: 768px) 92vw, 48rem"
                  className="object-cover"
                />
                <div className="nfx-shine" />
              </div>
            </div>
            {body.length ? (
              <div className="mt-14 space-y-6 text-lg leading-relaxed text-white/80">
                {body.map((p, i) => (
                  <p
                    key={i}
                    className={`whitespace-pre-line ${
                      i === 0
                        ? "text-xl text-white first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[5.5rem] first-letter:leading-[0.75] first-letter:text-rose-400 first-letter:[text-shadow:0_0_30px_rgba(234,51,111,0.9)]"
                        : ""
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : null}
          </article>

          <Link href="/actualites" className="link-arrow mt-14 inline-flex text-rose-300 hover:text-white">
            Toutes les actualités
            <ArrowRight />
          </Link>
        </div>
      </section>

      {others.length ? (
        <section className="relative bg-night-950 pb-28 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="kicker text-rose-300">À lire aussi</h2>
            <div className="mt-10">
              <CursorList
                compact
                items={others.map((item) => ({
                  href: `/actualites/${item.slug}`,
                  label: item.title,
                  sub: item.date,
                  meta: item.category,
                  image: item.image,
                }))}
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
