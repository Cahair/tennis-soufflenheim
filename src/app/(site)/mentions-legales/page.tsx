import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/content";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site du Tennis Padel Club Soufflenheim : éditeur, hébergement, propriété intellectuelle et données personnelles.",
  alternates: { canonical: "/mentions-legales" },
};

export default async function MentionsLegalesPage() {
  const site = await getSettings();
  return (
    <>
      <PageHero
        kicker="Informations légales"
        title="Mentions légales"
        text="Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), voici les informations relatives à l'éditeur et à l'hébergeur de ce site."
      />

      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Reveal>
              <article className="rounded-3xl border border-pine-100 bg-white p-8 sm:p-10">
                <h2 className="display text-2xl text-pine-950">
                  Éditeur du site
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-pine-950/75">
                  <p>
                    Le présent site est édité par l&rsquo;association{" "}
                    <strong>{site.name}</strong>, association de droit local
                    (droit alsacien-mosellan) régie par les articles 21 à 79-III
                    du Code civil local.
                  </p>
                  <p>
                    Siège social : {site.address.street},{" "}
                    {site.address.city}
                    <br />
                    Téléphone :{" "}
                    <a
                      href={telHref(site.phoneClub)}
                      className="font-medium text-clay-500 hover:underline"
                    >
                      {site.phoneClub}
                    </a>
                    <br />
                    Courriel :{" "}
                    <a
                      href={`mailto:${site.emails.president}`}
                      className="font-medium text-clay-500 hover:underline"
                    >
                      {site.emails.president}
                    </a>
                  </p>
                  <p>
                    Directeur de la publication : {site.president}, en qualité
                    de président de l&rsquo;association.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={80}>
              <article className="rounded-3xl border border-pine-100 bg-white p-8 sm:p-10">
                <h2 className="display text-2xl text-pine-950">Hébergement</h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-pine-950/75">
                  <p>
                    Le site est hébergé par <strong>Infomaniak Network SA</strong>
                    <br />
                    Rue Eugène-Marziano 25, 1227 Genève, Suisse
                    <br />
                    Site web :{" "}
                    <a
                      href="https://www.infomaniak.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-clay-500 hover:underline"
                    >
                      www.infomaniak.com
                    </a>
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={160}>
              <article className="rounded-3xl border border-pine-100 bg-white p-8 sm:p-10">
                <h2 className="display text-2xl text-pine-950">
                  Conception et réalisation
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-pine-950/75">
                  <p>
                    Site web conçu et réalisé par <strong>RK.ai</strong> —{" "}
                    <a
                      href="https://romain-kantzer.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-clay-500 hover:underline"
                    >
                      romain-kantzer.com
                    </a>
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={240}>
              <article className="rounded-3xl border border-pine-100 bg-white p-8 sm:p-10">
                <h2 className="display text-2xl text-pine-950">
                  Propriété intellectuelle
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-pine-950/75">
                  <p>
                    L&rsquo;ensemble des contenus présents sur ce site (textes,
                    photographies, logos, éléments graphiques) est la propriété
                    de l&rsquo;association {site.shortName} ou de leurs auteurs
                    respectifs, et est protégé par le droit de la propriété
                    intellectuelle.
                  </p>
                  <p>
                    Toute reproduction, représentation ou diffusion, totale ou
                    partielle, sans autorisation écrite préalable de
                    l&rsquo;association est interdite.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={320}>
              <article className="rounded-3xl border border-pine-100 bg-white p-8 sm:p-10">
                <h2 className="display text-2xl text-pine-950">
                  Données personnelles
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-pine-950/75">
                  <p>
                    Les informations transmises via le formulaire de contact
                    (nom, adresse e-mail, message) sont utilisées uniquement
                    pour répondre à votre demande. Elles ne sont ni cédées ni
                    vendues à des tiers.
                  </p>
                  <p>
                    Conformément au Règlement général sur la protection des
                    données (RGPD) et à la loi Informatique et Libertés, vous
                    disposez d&rsquo;un droit d&rsquo;accès, de rectification et
                    de suppression des données vous concernant. Pour exercer ce
                    droit, contactez-nous à l&rsquo;adresse{" "}
                    <a
                      href={`mailto:${site.emails.secretariat}`}
                      className="font-medium text-clay-500 hover:underline"
                    >
                      {site.emails.secretariat}
                    </a>
                    .
                  </p>
                  <p>
                    Ce site n&rsquo;utilise pas de cookies de suivi ni
                    d&rsquo;outils de mesure d&rsquo;audience tiers.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
