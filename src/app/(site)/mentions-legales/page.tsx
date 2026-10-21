import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NightFx from "@/components/landing/NightFx";
import { getSettings } from "@/lib/content";
import { telHref } from "@/lib/format";
import { UMAMI_WEBSITE_ID } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales du site du Tennis Padel Club Soufflenheim : éditeur, hébergement, propriété intellectuelle et données personnelles.",
  path: "/mentions-legales",
});

export default async function MentionsLegalesPage() {
  const site = await getSettings();
  return (
    <>
      <PageHero
        kicker="Informations légales"
        title="Mentions légales"
        effect="neon"
        echo="Légal"
        tape={["Mentions légales", "RGPD", "Sans cookies", "Hébergement", "Éditeur"]}
        text="Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), voici les informations relatives à l'éditeur et à l'hébergeur de ce site."
      />

      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <article data-tilt className="ix-folder relative rounded-[1.75rem] rounded-tl-none border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/60 sm:p-10">
                <h2 className="display text-3xl text-white">
                  Éditeur du site
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
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
                      className="font-medium text-rose-300 hover:underline"
                    >
                      {site.phoneClub}
                    </a>
                    <br />
                    Courriel :{" "}
                    <a
                      href={`mailto:${site.emails.president}`}
                      className="font-medium text-rose-300 hover:underline"
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
            </div>

            <div>
              <article data-tilt className="ix-folder relative rounded-[1.75rem] rounded-tl-none border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/60 sm:p-10">
                <h2 className="display text-3xl text-white">Hébergement</h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
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
                      className="font-medium text-rose-300 hover:underline"
                    >
                      www.infomaniak.com
                    </a>
                  </p>
                </div>
              </article>
            </div>

            <div>
              <article data-tilt className="ix-folder relative rounded-[1.75rem] rounded-tl-none border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/60 sm:p-10">
                <h2 className="display text-3xl text-white">
                  Conception et réalisation
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
                  <p>
                    Site web conçu et réalisé par <strong>RK.ai</strong> —{" "}
                    <a
                      href="https://romain-kantzer.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-rose-300 hover:underline"
                    >
                      romain-kantzer.com
                    </a>
                  </p>
                </div>
              </article>
            </div>

            <div>
              <article data-tilt className="ix-folder relative rounded-[1.75rem] rounded-tl-none border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/60 sm:p-10">
                <h2 className="display text-3xl text-white">
                  Propriété intellectuelle
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
                  <p>
                    L&rsquo;ensemble des contenus présents sur ce site (textes,
                    photographies, logos, éléments graphiques) est la propriété
                    de l&rsquo;association {site.name} ou de leurs auteurs
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
            </div>

            <div>
              <article data-tilt className="ix-folder relative rounded-[1.75rem] rounded-tl-none border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-rose-400/60 sm:p-10">
                <h2 className="display text-3xl text-white">
                  Données personnelles
                </h2>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
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
                      href={`mailto:${site.emails.president}`}
                      className="font-medium text-rose-300 hover:underline"
                    >
                      {site.emails.president}
                    </a>
                    .
                  </p>
                  {UMAMI_WEBSITE_ID ? (
                    <p>
                      Ce site n&rsquo;utilise pas de cookies. Sa fréquentation
                      est mesurée avec <strong>Umami</strong>, un outil de
                      mesure d&rsquo;audience qui ne dépose aucun cookie et ne
                      conserve aucune donnée permettant de vous identifier :
                      les statistiques sont anonymes et agrégées.
                    </p>
                  ) : (
                    <p>
                      Ce site n&rsquo;utilise pas de cookies de suivi ni
                      d&rsquo;outils de mesure d&rsquo;audience tiers.
                    </p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
