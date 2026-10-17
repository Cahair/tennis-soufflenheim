import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { readJson } from "@/lib/storage";
import { sections } from "@/lib/admin/registry";
import { saveSectionItem } from "@/lib/admin/actions";
import FieldInput from "@/components/admin/FieldInputs";
import type { Item } from "@/lib/admin/util";

export default async function SectionItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string; item: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  await requireAdmin();
  const { section: slug, item: itemParam } = await params;
  const { erreur } = await searchParams;
  const section = sections.find((s) => s.slug === slug);
  if (!section || section.kind !== "collection") notFound();

  const isNew = itemParam === "nouveau";
  const index = isNew ? null : Number(itemParam);
  if (!isNew && (!Number.isInteger(index) || index === null || index < 0)) {
    notFound();
  }

  const items = readJson<Item[]>(section.file);
  const value: Item = index !== null ? (items[index] ?? notFound()) : {};

  const action = saveSectionItem.bind(null, section.slug, index);

  return (
    <div>
      <Link href={`/admin/${section.slug}`} className="text-sm font-semibold text-night-800 hover:text-rose-600">
        ← {section.title}
      </Link>
      <h1 className="display mt-3 text-3xl text-night-950">
        {isNew ? `Ajouter ${section.itemName}` : `Modifier ${section.itemName}`}
      </h1>

      {erreur ? (
        <p className="mt-6 rounded-2xl border border-rose-600/30 bg-rose-600/10 px-5 py-3.5 text-sm font-semibold text-rose-600" role="alert">
          {erreur}
        </p>
      ) : null}

      <form action={action} className="mt-8 space-y-6 rounded-3xl border border-night-200 bg-white p-6 sm:p-8">
        {section.fields.map((field) => (
          <FieldInput key={field.path} field={field} value={value} />
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn btn-night">
            Enregistrer
          </button>
          <Link href={`/admin/${section.slug}`} className="btn btn-outline-night">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
