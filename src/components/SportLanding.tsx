import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/home/CtaBand";
import { getDisciplines, getMemberships, getSettings } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { NEARBY_TOWNS } from "@/lib/site";
import { sportOrder, sportPages, type SportPage } from "@/lib/sports";

/* ------------------------------------------------------------------ */
/*  Page d'un sport (/tennis, /padel, /pickleball) : la page que      */
/*  Google propose sur « padel Haguenau », « club de tennis           */
/*  Bas-Rhin »… Textes dans lib/sports.ts ; photo, atouts et tarifs   */
/*  repris du contenu géré dans l'admin.                              */
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

      <PageHero kicker={sport.hero.kicker} title={sport.hero.title} text={sport.hero.text} />

      {/* Présentation */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeader align="left" kicker={sport.intro.kicker} title={sport.intro.title} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-night-950/75 sm:text-lg">
              {sport.intro.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {discipline && discipline.features.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {discipline.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-night-950/15 bg-white px-3.5 py-1.5 text-xs text-night-950/75"
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
                </Link>
              ) : null}
              <Link href="/contact" className="btn btn-outline-night">
                Nous contacter
              </Link>
            </div>
          </Reveal>
          {discipline ? (
            <Reveal direction="right" delay={100}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-night-950/10">
                <Image
                  src={discipline.image}
                  alt={`${sport.label} au Tennis Padel Club Soufflenheim`}
                  fill
                  placeholder={discipline.image.blurDataURL ? "blur" : "empty"}
                  sizes="(max-width: 1024px) 92vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* Atouts */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {sport.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 80} className="h-full">
                <div className="card-lift h-full rounded-3xl border border-night-200 bg-night-50 p-8">
                  <span className="font-display text-sm tracking-widest text-rose-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display mt-3 text-2xl text-night-950">{h.title}</h2>
                  <p className="mt-3 leading-relaxed text-night-950/65">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Adhésions concernées */}
      {formulas.length > 0 ? (
        <section className="bg-night-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                kicker="Adhésions"
                title={`Les formules ${sport.label.toLowerCase()}`}
                text="Une adhésion annuelle, valable du 1er septembre au 31 août : accès aux installations et réservation en ligne 7j/7."
              />
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {formulas.map((m, i) => (
                <Reveal key={m.name} delay={i * 60} className="h-full">
                  <div
                    className={`card-lift flex h-full items-baseline justify-between gap-4 rounded-3xl border p-6 ${
                      m.featured ? "border-rose-400 bg-white shadow-lg shadow-rose-500/10" : "border-night-200 bg-white"
                    }`}
                  >
                    <h3 className="font-bold text-night-950">{m.name}</h3>
                    <p className="shrink-0 text-right">
                      <span className="display text-3xl text-night-950">{m.price}</span>
                      <span className="ml-1 text-sm text-night-950/55">{m.period}</span>
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/tarifs" className="btn btn-outline-night">
                Tous les tarifs et conditions
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Venir au club : le bloc qui situe le club pour la recherche locale */}
      <section className="bg-night-950 py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              tone="light"
              kicker="Venir au club"
              title="Au cœur de l'Alsace du Nord"
              text={`${site.address.street}, ${site.address.city} (Bas-Rhin) : entre la forêt de Haguenau et le Rhin, à une quarantaine de minutes de Strasbourg. Parking gratuit sur place.`}
            />
          </Reveal>
          <Reveal delay={100}>
            <ul className="mt-12 flex flex-wrap justify-center gap-3">
              {NEARBY_TOWNS.map((town) => (
                <li
                  key={town.name}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80"
                >
                  {town.name} <span className="text-rose-400">· {town.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-white/45">Temps de trajet indicatifs en voiture.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={site.links.itineraire}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rose"
              >
                Voir l&rsquo;itinéraire
              </a>
              <Link href="/contact" className="btn btn-outline-light">
                Accès et contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Questions fréquentes"
              title={`${sport.label} : vos questions`}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <Accordion items={sport.faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Les autres sports du club */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="kicker kicker-center text-rose-600">Découvrez aussi</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 80} className="h-full">
                <Link
                  href={`/${other.slug}`}
                  className="card-lift group flex h-full items-center justify-between gap-4 rounded-3xl border border-night-200 bg-night-50 p-7"
                >
                  <span>
                    <span className="display block text-3xl text-night-950">{other.label}</span>
                    <span className="mt-1 block text-sm text-night-950/60">{other.intro.title}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-rose-600 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                  </svg>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
