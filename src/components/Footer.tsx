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
    <footer className="relative overflow-hidden bg-night-950 text-white/70">
      {/* Trait néon et halo, raccord avec la dernière section de nuit */}
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_rgba(234,51,111,0.9)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-radial from-rose-500/15 to-transparent to-70%" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_1fr_1fr]">
          <div>
            <Image
              src={logo}
              alt="Logo du Tennis Padel Garden Club Soufflenheim"
              sizes="160px"
              className="h-28 w-auto"
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
            <h3 className="display text-sm tracking-[0.2em] text-rose-400">
              Navigation
            </h3>
            <ul className="mt-5 columns-2 gap-x-6 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href} className="mb-3 break-inside-avoid">
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-rose-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display text-sm tracking-[0.2em] text-rose-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                {site.address.street}
                <br />
                {site.address.city}
                <br />
                <span className="text-white/60">{site.address.directions}</span>
              </li>
              <li>
                <a href={telHref(site.phoneClub)} className="hover:text-rose-300">
                  {site.phoneClub}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.emails.president}`}
                  className="hover:text-rose-300"
                >
                  {site.emails.president}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="display text-sm tracking-[0.2em] text-rose-400">
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
                className="btn btn-rose !px-5 !py-2.5 text-sm"
              >
                Ten&rsquo;up
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mot géant en contour qui défile, signature du club */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden pb-2">
        <div className="marquee-track flex" style={{ animationDuration: "50s" }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="display flex items-center gap-10 pr-10 text-[clamp(5rem,16vw,14rem)] leading-[0.85]">
              <span className="hero-outline">Soufflenheim</span>
              <span className="text-rose-500/70">✦</span>
              <span className="brand-gradient-text opacity-60">Padel</span>
              <span className="text-rose-500/70">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/40 sm:px-6 md:flex-row lg:px-8">
          <p>
            © 2026 {site.name} — Tous droits réservés · Club fondé en 1979
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span>Maquette de démonstration — contenus et tarifs indicatifs</span>
            <span aria-hidden="true">·</span>
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-rose-300"
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
                className="transition-colors hover:text-rose-300"
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
