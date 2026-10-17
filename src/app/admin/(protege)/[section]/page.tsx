/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { readJson } from "@/lib/storage";
import { sections } from "@/lib/admin/registry";
import {
  deleteSectionItem,
  moveSectionItem,
  saveSingleton,
} from "@/lib/admin/actions";
import { getPath, type Item } from "@/lib/admin/util";
import FieldInput from "@/components/admin/FieldInputs";
import ConfirmButton from "@/components/admin/ConfirmButton";
import type { ImageRef } from "@/lib/content-types";

function Banner({ ok, erreur }: { ok?: string; erreur?: string }) {
  if (erreur) {
    return (
      <p className="mb-6 rounded-2xl border border-rose-600/30 bg-rose-600/10 px-5 py-3.5 text-sm font-semibold text-rose-600" role="alert">
        {erreur}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="mb-6 rounded-2xl border border-night-300 bg-night-100 px-5 py-3.5 text-sm font-semibold text-night-800" role="status">
        Modifications enregistrées — le site est à jour.
      </p>
    );
  }
  return null;
}

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  await requireAdmin();
  const { section: slug } = await params;
  const { ok, erreur } = await searchParams;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();

  /* ------------------------- Fiche unique ------------------------- */
  if (section.kind === "singleton") {
    const value = readJson<Item>(section.file);
    const action = saveSingleton.bind(null, section.slug);
    return (
      <div>
        <h1 className="display text-3xl text-night-950">{section.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-night-950/60">{section.description}</p>
        <Banner ok={ok} erreur={erreur} />
        <form action={action} className="mt-8 space-y-6 rounded-3xl border border-night-200 bg-white p-6 sm:p-8">
          {section.fields.map((field) => (
            <FieldInput key={field.path} field={field} value={value} />
          ))}
          <button type="submit" className="btn btn-night">
            Enregistrer
          </button>
        </form>
      </div>
    );
  }

  /* -------------------------- Collection -------------------------- */
  const items = readJson<Item[]>(section.file);
  const imageField = section.fields.find(
    (f) => f.type === "image" || f.type === "photos"
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-night-950">{section.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-night-950/60">{section.description}</p>
        </div>
        <Link href={`/admin/${section.slug}/nouveau`} className="btn btn-rose !px-5 !py-2.5 text-sm">
          + Ajouter {section.itemName}
        </Link>
      </div>

      <div className="mt-6">
        <Banner ok={ok} erreur={erreur} />
      </div>

      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-night-300 bg-white p-10 text-center text-sm text-night-950/50">
          Rien pour l&rsquo;instant — ajoutez {section.itemName} avec le bouton ci-dessus.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => {
            const title = String(
              getPath(item, section.titlePath ?? "title") ?? `Élément ${i + 1}`
            );
            const subtitle = section.subtitlePath
              ? String(getPath(item, section.subtitlePath) ?? "")
              : "";
            let thumb: string | undefined;
            if (imageField?.type === "image") {
              thumb = (getPath(item, imageField.path) as ImageRef | undefined)?.src;
            } else if (imageField?.type === "photos") {
              const photos = getPath(item, imageField.path) as
                | { src: ImageRef }[]
                | undefined;
              thumb = photos?.[0]?.src.src;
            }
            return (
              <li
                key={`${title}-${i}`}
                className="flex items-center gap-4 rounded-2xl border border-night-200 bg-white p-4"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="h-14 w-20 shrink-0 rounded-xl object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-night-950">{title}</p>
                  {subtitle ? (
                    <p className="mt-0.5 truncate text-sm text-night-950/55">{subtitle}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <form action={moveSectionItem.bind(null, section.slug, i, -1)}>
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Monter"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-night-200 text-night-800 transition-colors hover:bg-night-50 disabled:opacity-30"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveSectionItem.bind(null, section.slug, i, 1)}>
                    <button
                      type="submit"
                      disabled={i === items.length - 1}
                      aria-label="Descendre"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-night-200 text-night-800 transition-colors hover:bg-night-50 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>
                  <Link
                    href={`/admin/${section.slug}/${i}`}
                    className="rounded-full border border-night-300 px-4 py-2 text-sm font-semibold text-night-800 transition-colors hover:bg-night-50"
                  >
                    Modifier
                  </Link>
                  <form action={deleteSectionItem.bind(null, section.slug, i)}>
                    <ConfirmButton
                      message={`Supprimer « ${title} » ? Cette action est immédiate.`}
                      className="rounded-full px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-600/10"
                    >
                      Supprimer
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
