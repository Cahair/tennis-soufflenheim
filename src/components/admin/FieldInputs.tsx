/* eslint-disable @next/next/no-img-element */
import type { FieldDef } from "@/lib/admin/registry";
import { getPath } from "@/lib/admin/util";
import type { HistoirePhoto, ImageRef } from "@/lib/content-types";

/* ------------------------------------------------------------------ */
/*  Rendu serveur des champs de formulaire de l'admin, piloté par     */
/*  les FieldDef du registre. Les <img> natifs suffisent pour les     */
/*  aperçus (pas d'optimisation nécessaire côté admin).               */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-xl border border-night-300 bg-white px-4 py-3 text-sm text-night-950 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15";

function Label({ field }: { field: FieldDef }) {
  return (
    <label htmlFor={`f:${field.path}`} className="mb-1.5 block text-sm font-semibold text-night-950">
      {field.label}
      {field.required ? <span className="text-rose-600"> *</span> : null}
    </label>
  );
}

function Help({ field }: { field: FieldDef }) {
  if (!field.help) return null;
  return <p className="mt-1.5 text-xs text-night-950/50">{field.help}</p>;
}

export default function FieldInput({
  field,
  value,
}: {
  field: FieldDef;
  value: unknown;
}) {
  const name = `f:${field.path}`;
  const current = getPath(value, field.path);

  switch (field.type) {
    case "text":
      return (
        <div>
          <Label field={field} />
          <input
            id={name}
            name={name}
            defaultValue={typeof current === "string" ? current : ""}
            className={inputClass}
          />
          <Help field={field} />
        </div>
      );

    case "date":
      return (
        <div>
          <Label field={field} />
          <input
            id={name}
            name={name}
            type="date"
            defaultValue={typeof current === "string" ? current : ""}
            className={inputClass}
          />
          <Help field={field} />
        </div>
      );

    case "textarea":
    case "lines": {
      const text =
        field.type === "lines"
          ? Array.isArray(current)
            ? (current as string[]).join("\n")
            : ""
          : typeof current === "string"
            ? current
            : "";
      return (
        <div>
          <Label field={field} />
          <textarea
            id={name}
            name={name}
            rows={field.rows ?? 4}
            defaultValue={text}
            className={`${inputClass} leading-relaxed`}
          />
          <Help field={field} />
        </div>
      );
    }

    case "number":
      return (
        <div>
          <Label field={field} />
          <input
            id={name}
            name={name}
            type="number"
            step="any"
            defaultValue={typeof current === "number" ? current : ""}
            className={inputClass}
          />
          <Help field={field} />
        </div>
      );

    case "checkbox":
      return (
        <div>
          <label className="flex items-center gap-3 text-sm font-semibold text-night-950">
            <input
              name={name}
              type="checkbox"
              defaultChecked={current === true}
              className="h-5 w-5 rounded border-night-300 accent-night-800"
            />
            {field.label}
          </label>
          <Help field={field} />
        </div>
      );

    case "select":
      return (
        <div>
          <Label field={field} />
          <select
            id={name}
            name={name}
            defaultValue={typeof current === "string" ? current : field.options?.[0]?.value}
            className={inputClass}
          >
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help field={field} />
        </div>
      );

    case "image": {
      const image = current as ImageRef | undefined;
      return (
        <div>
          <Label field={field} />
          <div className="flex flex-wrap items-start gap-4">
            {image?.src ? (
              <img
                src={image.src}
                alt=""
                className="h-24 w-32 rounded-xl border border-night-200 object-cover"
              />
            ) : (
              <div className="flex h-24 w-32 items-center justify-center rounded-xl border border-dashed border-night-300 text-xs text-night-950/40">
                Aucune photo
              </div>
            )}
            <div className="flex-1 min-w-56">
              <input
                type="file"
                name={`${name}__file`}
                accept="image/*"
                className="block w-full text-sm text-night-950/70 file:mr-3 file:rounded-full file:border-0 file:bg-night-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-night-700"
              />
              <p className="mt-1.5 text-xs text-night-950/50">
                {image?.src
                  ? "Choisissez un fichier pour remplacer la photo actuelle."
                  : "JPG, PNG ou WebP — 15 Mo maximum."}
              </p>
            </div>
          </div>
          <input
            type="hidden"
            name={`${name}__current`}
            value={image?.src ? JSON.stringify(image) : ""}
          />
          <Help field={field} />
        </div>
      );
    }

    case "photos": {
      const photos = (Array.isArray(current) ? current : []) as HistoirePhoto[];
      return (
        <div>
          <Label field={field} />
          <input type="hidden" name={`${name}__current`} value={JSON.stringify(photos)} />
          {photos.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {photos.map((photo, i) => (
                <li
                  key={photo.src.src}
                  className="flex gap-3 rounded-xl border border-night-200 bg-white p-3"
                >
                  <img
                    src={photo.src.src}
                    alt=""
                    className="h-20 w-24 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      name={`${name}__alt_${i}`}
                      defaultValue={photo.alt}
                      aria-label="Description de la photo"
                      className="w-full rounded-lg border border-night-300 px-2.5 py-1.5 text-xs"
                    />
                    <label className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                      <input
                        type="checkbox"
                        name={`${name}__del_${i}`}
                        className="h-4 w-4 accent-rose-600"
                      />
                      Supprimer cette photo
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-night-950/50">Aucune photo pour l&rsquo;instant.</p>
          )}
          <div className="mt-3">
            <input
              type="file"
              name={`${name}__new`}
              accept="image/*"
              multiple
              className="block w-full text-sm text-night-950/70 file:mr-3 file:rounded-full file:border-0 file:bg-night-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-night-700"
            />
            <p className="mt-1.5 text-xs text-night-950/50">
              Ajoutez une ou plusieurs photos (elles arrivent en fin de liste).
            </p>
          </div>
          <Help field={field} />
        </div>
      );
    }
  }
}
