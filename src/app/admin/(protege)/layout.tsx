import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/admin/actions";
import { getSection, siteMap } from "@/lib/admin/registry";
import { getMessages } from "@/lib/content";

/* Habillage de l'administration : barre latérale organisée comme le
   site (une entrée par page, dépliable). Chaque page revérifie la
   session côté serveur. */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  const messagesCount = (await getMessages()).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="shrink-0 lg:w-72">
        <div className="rounded-3xl border border-night-200 bg-white p-5 lg:sticky lg:top-8">
          <Link href="/admin" className="display block px-2 text-xl text-night-950">
            Admin <span className="text-rose-600">TPCS</span>
          </Link>

          <nav className="mt-4" aria-label="Sections de l'administration">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-night-950 transition-colors hover:bg-night-50"
            >
              Sommaire du site
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-night-950 transition-colors hover:bg-night-50"
            >
              Messages reçus
              {messagesCount ? (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-night-950">
                  {messagesCount}
                </span>
              ) : null}
            </Link>

            <p className="mt-4 px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-night-950/40">
              Le site, page par page
            </p>
            <div className="mt-1.5 space-y-0.5">
              {siteMap.map(({ page, entries }) => (
                <details key={page} className="group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-night-950/85 transition-colors hover:bg-night-50 [&::-webkit-details-marker]:hidden">
                    {page}
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-night-950/40 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </summary>
                  <ul className="mb-1 ml-3 border-l border-night-200 pl-2">
                    {entries
                      .filter((e) => e.slug)
                      .map((e, i) => (
                        <li key={`${e.slug}-${i}`}>
                          <Link
                            href={`/admin/${e.slug}`}
                            className="block rounded-lg px-2.5 py-1.5 text-sm text-night-950/70 transition-colors hover:bg-night-50 hover:text-night-950"
                          >
                            {getSection(e.slug!).title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </details>
              ))}
            </div>
          </nav>

          <div className="mt-5 space-y-1 border-t border-night-200 pt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-night-800 transition-colors hover:bg-night-50"
            >
              Voir le site ↗
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-night-950/60 transition-colors hover:bg-night-50 hover:text-rose-600"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
