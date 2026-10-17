import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
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
    "Adhésions tennis, padel et combiné, licence FFT comprise, école de tennis dès 5 ans : tous les tarifs du Tennis Padel Club Soufflenheim (Bas-Rhin).",
  path: "/tarifs",
});

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

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
        kicker="Tarifs & conditions générales — 2024 / 25"
        title="Des formules simples, un club accessible"
        text="Une adhésion annuelle valable du 1er septembre au 31 août : tennis, padel ou les deux, licence FFT comprise, éclairage inclus. Choisissez la formule qui vous ressemble."
      />

      {/* Adhésions */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Adhésions annuelles"
              title="Choisissez votre formule"
              text="Chaque adhésion comprend la licence FFT et le droit de jeu. L'accès aux courts est possible tous les jours de la semaine, hors priorités du club."
            />
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {memberships.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 100} className="h-full">
                <article
                  className={`card-lift relative flex h-full flex-col rounded-3xl p-8 ${
                    m.featured
                      ? "bg-night-800 text-white shadow-2xl shadow-night-800/30 ring-4 ring-rose-500"
                      : "border border-night-200 bg-white"
                  }`}
                >
                  {m.featured ? (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-night-950 shadow-lg">
                      Le plus complet
                    </span>
                  ) : null}
                  <h3
                    className={`display text-2xl ${
                      m.featured ? "text-white" : "text-night-950"
                    }`}
                  >
                    {m.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span
                      className={`display text-5xl ${
                        m.featured ? "text-rose-400" : "text-night-950"
                      }`}
                    >
                      {m.price}
                    </span>
                    <span
                      className={`text-sm ${
                        m.featured ? "text-white/60" : "text-night-950/50"
                      }`}
                    >
                      {m.period}
                    </span>
                  </div>
                  <ul
                    className={`mt-6 space-y-3 text-sm ${
                      m.featured ? "text-white/85" : "text-night-950/75"
                    }`}
                  >
                    {m.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        {m.featured ? (
                          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        ) : (
                          <Check />
                        )}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <a
                      href={site.links.inscription}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn w-full ${
                        m.featured ? "btn-rose" : "btn-outline-night"
                      }`}
                    >
                      S&rsquo;inscrire
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <p className="mt-10 text-center text-sm font-semibold text-rose-600">
              Un réajustement du tarif sera effectif à la fin de la construction
              des pistes de padel couvertes.
            </p>
            <p className="mt-2 text-center text-sm text-night-950/50">
              Paiement en ligne possible par Ten&rsquo;up, avec possibilité
              d&rsquo;étalement — renseignez-vous au club.
            </p>
          </Reveal>
        </div>
      </section>

      {/* La cotisation en trois parts */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Transparence"
              title="Votre cotisation, partagée en trois"
              text="Chaque adhésion se décompose en trois parts distinctes — et l'une d'elles vous ouvre droit à un avantage fiscal."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {cotisationParts.map((part, i) => (
              <Reveal key={part.name} delay={i * 100} className="h-full">
                <div className="card-lift flex h-full flex-col rounded-3xl border border-night-200 bg-night-50 p-7">
                  <span className="display text-4xl text-rose-500">{i + 1}</span>
                  <h3 className="mt-3 font-bold text-night-950">{part.name}</h3>
                  <p className="mt-2 text-sm text-night-950/70">{part.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-night-800 p-8 text-center text-white sm:p-10">
              <p className="display text-3xl text-rose-400">
                66 % de réduction d&rsquo;impôt
              </p>
              <p className="mt-3 text-sm text-white/80">
                La part cotisation donne lieu à un reçu «&nbsp;Cerfa&nbsp;» au
                titre des dons : vous pourrez enregistrer ce montant sur votre
                déclaration d&rsquo;impôt sur les revenus 2024 en 2025, et
                bénéficier d&rsquo;une réduction de 66&nbsp;% de la somme sur
                votre impôt à payer (ex.&nbsp;: sur 100&nbsp;€, la déduction est
                de 66&nbsp;€).
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* École de tennis & cours */}
      <section className="bg-night-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              tone="light"
              kicker="École & cours"
              title="Apprendre en s'amusant"
              text="L'école de tennis du TPCS accueille les jeunes de 5 à 17 ans, et des cours privés de tennis et de padel sont possibles pour tous."
            />
          </Reveal>
          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">
            {tennisSchool.map((course, i) => (
              <Reveal key={course.name} delay={i * 80}>
                <div
                  className={`flex flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 ${
                    i % 2 === 0 ? "bg-white/[0.06]" : "bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-white">{course.name}</h3>
                    <p className="mt-1 text-sm text-white/55">{course.detail}</p>
                  </div>
                  <span className="display text-3xl text-rose-400">{course.price}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <p className="mt-8 text-center text-sm text-white/50">
              Paiement exigé dès le premier jour pour les cours, avec
              possibilité d&rsquo;étalement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Bon à savoir */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Bon à savoir"
              title="Les petits plus du club"
              text="Badge d'accès, matériel prêté, remise chez notre partenaire : tout ce qui accompagne votre adhésion."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((extra, i) => (
              <Reveal key={extra.name} delay={i * 100} className="h-full">
                <div className="card-lift flex h-full flex-col rounded-3xl border border-night-200 bg-white p-7">
                  <h3 className="font-bold text-night-950">{extra.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="display text-4xl text-night-950">{extra.price}</span>
                    <span className="text-xs text-night-950/50">{extra.unit}</span>
                  </div>
                  <p className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-rose-600">
                    {extra.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-14 rounded-3xl border border-night-200 bg-white p-8 sm:p-10">
              <h3 className="display text-2xl text-night-950">
                Conditions générales de l&rsquo;année
              </h3>
              <ul className="mt-6 grid gap-x-10 gap-y-4 text-sm text-night-950/75 md:grid-cols-2">
                {infosPratiques.map((info) => (
                  <li key={info} className="flex items-start gap-2.5">
                    <Check />
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="display text-4xl text-night-950 sm:text-5xl">
              Un doute sur la bonne formule ?
            </h2>
            <p className="mt-4 text-lg text-night-950/65">
              Passez nous voir au Club House pendant les heures de permanence,
              appelez le{" "}
              <a href={telHref(site.phonePresident)} className="font-bold text-rose-600 hover:underline">
                {site.phonePresident}
              </a>{" "}
              ou écrivez à{" "}
              <a
                href={`mailto:${site.emails.president}`}
                className="font-bold text-rose-600 hover:underline"
              >
                {site.emails.president}
              </a>
              &nbsp;: on vous aiguille en deux minutes.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="btn btn-night">
                Nous contacter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
