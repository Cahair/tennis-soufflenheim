import { socialIconPaths } from "@/lib/nav";
import type { Social } from "@/lib/content-types";

/* Rangée d'icônes des réseaux sociaux, sur fond sombre (footer,
   menu mobile). Pastilles rondes, dorées au survol. */
export default function SocialLinks({ socials }: { socials: Social[] }) {
  return (
    <div className="flex gap-3">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rose-400 hover:text-rose-400"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
            <path d={socialIconPaths[social.icon] ?? socialIconPaths.globe} />
          </svg>
        </a>
      ))}
    </div>
  );
}
