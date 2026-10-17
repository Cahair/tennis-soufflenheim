import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSection, siteMap } from "@/lib/admin/registry";
import { readJson } from "@/lib/storage";
import { getMessages } from "@/lib/content";

/* Sommaire de l'administration : le site page par page, chaque bloc
   dans son ordre d'affichage réel. Les blocs grisés sont volontairement
   figés (mise en page sensible, gérée dans le code). */

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-night-950/30 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default async function AdminDashboard() {
  await requireAdmin();
  const messages = await getMessages();

  return (
    <div>
      <h1 className="display text-3xl text-night-950">Sommaire du site</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-night-950/60">
        Le site, page par page, dans l&rsquo;ordre d&rsquo;affichage. Cliquez sur un
        bloc pour le modifier : le site est à jour en quelques secondes, et
        chaque modification est sauvegardée automatiquement.
      </p>

      <Link
        href="/admin/messages"
        className="group mt-8 flex items-center justify-between rounded-3xl bg-night-800 p-6 text-white transition-shadow hover:shadow-xl hover:shadow-night-800/25"
      >
        <div>
          <h2 className="display text-xl">Messages reçus</h2>
          <p className="mt-1 text-sm text-white/60">
            Les demandes envoyées via le formulaire de contact.
          </p>
        </div>
        <span className={`display rounded-2xl px-4 py-2 text-2xl ${messages.length ? "bg-rose-500 text-night-950" : "bg-white/10 text-white/60"}`}>
          {messages.length}
        </span>
      </Link>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        {siteMap.map(({ page, href, entries }) => (
          <section key={page} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h2 className="display text-xl text-night-950">{page}</h2>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-night-800/70 hover:text-rose-600"
              >
                voir la page ↗
              </a>
            </div>
            <ul className="mt-3 overflow-hidden rounded-3xl border border-night-200 bg-white">
              {entries.map((entry, i) => {
                const border = i > 0 ? "border-t border-night-200/70" : "";
                if (entry.fixed) {
                  return (
                    <li key={`fixe-${i}`} className={`flex items-center gap-2.5 px-5 py-3 text-sm text-night-950/35 ${border}`}>
                      <Lock />
                      <span>
                        {entry.fixed}
                        <span className="ml-2 text-xs">· bloc fixe</span>
                      </span>
                    </li>
                  );
                }
                const section = getSection(entry.slug!);
                const count =
                  section.kind === "collection"
                    ? readJson<unknown[]>(section.file).length
                    : null;
                return (
                  <li key={`${entry.slug}-${i}`} className={border}>
                    <Link
                      href={`/admin/${section.slug}`}
                      className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-night-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-semibold text-night-950">
                          {section.title}
                          {count !== null ? (
                            <span className="rounded-full bg-night-50 px-2 py-0.5 text-[0.65rem] font-bold text-night-800 group-hover:bg-white">
                              {count}
                            </span>
                          ) : null}
                        </span>
                        {entry.note ? (
                          <span className="mt-0.5 block truncate text-xs text-night-950/45">
                            {entry.note}
                          </span>
                        ) : null}
                      </span>
                      <Chevron />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
