import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
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
      <PageHero kicker="Actualités" title={article.title} text={article.excerpt} />

      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <article>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
                <time dateTime={published} className="text-rose-600">
                  {article.date}
                </time>
                <span className="h-1 w-1 rounded-full bg-night-950/25" />
                <span className="text-night-950/50">{article.category}</span>
              </div>
              <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-3xl border border-night-200 bg-white">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  preload
                  placeholder={article.image.blurDataURL ? "blur" : "empty"}
                  sizes="(max-width: 768px) 92vw, 48rem"
                  className="object-cover"
                />
              </div>
              {body.length ? (
                <div className="mt-10 space-y-5 text-lg leading-relaxed text-night-950/80">
                  {body.map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>
          </Reveal>

          {others.length ? (
            <Reveal delay={100}>
              <aside className="mt-16 border-t border-night-950/10 pt-10">
                <h2 className="display text-2xl text-night-950">À lire aussi</h2>
                <ul className="mt-6 space-y-4">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/actualites/${item.slug}`}
                        className="group flex items-baseline justify-between gap-6"
                      >
                        <span className="font-bold text-night-950 transition-colors group-hover:text-rose-600">
                          {item.title}
                        </span>
                        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-night-950/45">
                          {item.date}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          ) : null}

          <Link href="/actualites" className="link-arrow mt-12 inline-flex text-sm text-night-900">
            Toutes les actualités
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
