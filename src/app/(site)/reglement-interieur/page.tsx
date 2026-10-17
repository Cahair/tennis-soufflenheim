import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getSettings } from "@/lib/content";
import { bureau, reglementArticles, reglementMeta } from "@/lib/reglement";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Règlement intérieur",
  description:
    "Membres, cotisations, licence FFT, réservations, discipline : le règlement intérieur du Tennis Padel Club Soufflenheim.",
  path: "/reglement-interieur",
});

export default async function ReglementPage() {
  const site = await getSettings();
  return (
    <>
      <PageHero
        kicker={`Règlement intérieur — ${reglementMeta.saison}`}
        title="Les règles du jeu, noir sur blanc"
        text={reglementMeta.preambule}
      />

      {/* Articles */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {reglementArticles.map((article, i) => (
              <Reveal key={article.title} delay={(i % 3) * 80}>
                <article className="rounded-3xl border border-night-200 bg-white p-8 sm:p-10">
                  <h2 className="display text-2xl text-night-950">
                    {article.title}
                  </h2>
                  <div className="mt-6 space-y-6">
                    {article.sections.map((section, j) => (
                      <div key={section.title ?? j}>
                        {section.title ? (
                          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-rose-600">
                            {section.title}
                          </h3>
                        ) : null}
                        {section.intro ? (
                          <p className="mt-2 text-sm leading-relaxed text-night-950/75">
                            {section.intro}
                          </p>
                        ) : null}
                        {section.points ? (
                          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-night-950/75">
                            {section.points.map((point) => (
                              <li key={point} className="flex items-start gap-2.5">
                                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-10 text-center text-sm italic text-night-950/55">
              {reglementMeta.approbation}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Bureau */}
      <section className="bg-night-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              tone="light"
              kicker="Le bureau"
              title="Liste des membres du bureau"
              text="Une question sur le règlement, les cotisations ou la vie du club ? Les membres du bureau sont à votre écoute."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bureau.map((membre, i) => (
              <Reveal key={`${membre.role}-${membre.name}`} delay={(i % 3) * 100} className="h-full">
                <div className="card-lift flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-7">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rose-400">
                    {membre.role}
                  </p>
                  <h3 className="mt-2 display text-2xl text-white">
                    {membre.name}
                  </h3>
                  <div className="mt-4 space-y-1.5 text-sm text-white/70">
                    <p>
                      <a
                        href={`tel:+33${membre.phone.replaceAll(" ", "").slice(1)}`}
                        className="transition-colors hover:text-rose-300"
                      >
                        {membre.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${membre.email}`}
                        className="break-all transition-colors hover:text-rose-300"
                      >
                        {membre.email}
                      </a>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="display text-4xl text-night-950 sm:text-5xl">
              Règlement lu et approuvé ?
            </h2>
            <p className="mt-4 text-lg text-night-950/65">
              Il ne reste plus qu&rsquo;à choisir votre formule et à remplir le
              dossier d&rsquo;inscription : bienvenue au club !
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={site.links.inscription}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rose"
              >
                S&rsquo;inscrire en ligne
              </a>
              <Link href="/tarifs" className="btn btn-outline-night">
                Voir les tarifs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
