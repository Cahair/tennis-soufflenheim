import Image from "next/image";
import Link from "next/link";
import { logo } from "@/lib/images";
import { footerLinks } from "@/lib/nav";
import { telHref } from "@/lib/format";
import type { SiteSettings, Social } from "@/lib/content-types";
import SocialLinks from "./SocialLinks";

export default function Footer({
  site,
  socials,
}: {
  site: SiteSettings;
  socials: Social[];
}) {
  return (
    <footer className="bg-pine-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_1fr_1fr]">
          <div>
            <Image
              src={logo}
              alt="Logo du Tennis Padel Club Soufflenheim"
              className="h-20 w-auto rounded-xl bg-white p-2"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Club de tennis, padel et pickleball à Soufflenheim (Bas-Rhin),
              au cœur du pays des potiers et de l&rsquo;Alsace du Nord, depuis
              1979. Un club de village, une ambiance de famille.
            </p>
            <div className="mt-6">
              <SocialLinks socials={socials} />
            </div>
          </div>

          <div>
            <h3 className="display text-sm tracking-[0.2em] text-gold-400">
              Navigation
            </h3>
            <ul className="mt-5 columns-2 gap-x-6 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href} className="mb-3 break-inside-avoid">
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display text-sm tracking-[0.2em] text-gold-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                {site.address.street}
                <br />
                {site.address.city}
              </li>
              <li>
                <a href={telHref(site.phoneClub)} className="hover:text-gold-300">
                  {site.phoneClub}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.emails.president}`}
                  className="hover:text-gold-300"
                >
                  {site.emails.president}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.emails.secretariat}`}
                  className="hover:text-gold-300"
                >
                  {site.emails.secretariat}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="display text-sm tracking-[0.2em] text-gold-400">
              Réserver un court
            </h3>
            <p className="mt-5 text-sm leading-relaxed">
              Plateforme officielle Ten&rsquo;up, réservation en ligne 7j/7.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={site.links.tenup}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="reservation-tenup"
                data-umami-event-emplacement="pied-de-page"
                className="btn btn-gold !px-5 !py-2.5 text-sm"
              >
                Ten&rsquo;up
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/40 sm:px-6 md:flex-row lg:px-8">
          <p>
            © 2026 {site.name} — Tous droits réservés · Club fondé en 1979
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span>Maquette de démonstration — contenus et tarifs indicatifs</span>
            <span aria-hidden="true">·</span>
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-gold-300"
            >
              Mentions légales
            </Link>
            <span aria-hidden="true">·</span>
            <span>
              Site Web créé par{" "}
              <a
                href="https://romain-kantzer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-300"
              >
                RK.ai — romain-kantzer.com
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
