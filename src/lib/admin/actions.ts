"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/auth";
import { readJson, writeJson } from "@/lib/storage";
import { saveImage } from "./images";
import { getSection, type Section } from "./registry";
import { getPath, setPath, type Item } from "./util";
import type { HistoirePhoto, ImageRef } from "@/lib/content-types";

/* ------------------------------------------------------------------ */
/*  Actions serveur de l'administration. Chaque action vérifie la     */
/*  session avant d'écrire, puis purge le cache de tout le site.      */
/* ------------------------------------------------------------------ */

function revalidateSite(): void {
  revalidatePath("/", "layout");
}

/* ----------------------------- Session ----------------------------- */

const loginAttempts = { count: 0, lockedUntil: 0 };

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (Date.now() < loginAttempts.lockedUntil) {
    return { error: "Trop de tentatives. Réessayez dans une minute." };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    loginAttempts.count += 1;
    if (loginAttempts.count >= 5) {
      loginAttempts.lockedUntil = Date.now() + 60_000;
      loginAttempts.count = 0;
    }
    return { error: "Mot de passe incorrect." };
  }
  loginAttempts.count = 0;
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/connexion");
}

/* --------------------- Lecture des formulaires --------------------- */

async function parseFields(
  section: Section,
  formData: FormData,
  base: Item
): Promise<Item> {
  const item: Item = structuredClone(base);

  for (const field of section.fields) {
    const key = `f:${field.path}`;

    switch (field.type) {
      case "text":
      case "textarea": {
        const value = String(formData.get(key) ?? "").trim();
        if (field.required && !value) {
          throw new Error(`Le champ « ${field.label} » est obligatoire.`);
        }
        setPath(item, field.path, value);
        break;
      }
      case "date": {
        const value = String(formData.get(key) ?? "").trim();
        if (field.required && !value) {
          throw new Error(`Le champ « ${field.label} » est obligatoire.`);
        }
        if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new Error(`« ${field.label} » doit être une date (AAAA-MM-JJ).`);
        }
        setPath(item, field.path, value);
        break;
      }
      case "select": {
        const value = String(formData.get(key) ?? "");
        if (!field.options?.some((o) => o.value === value)) {
          throw new Error(`Valeur invalide pour « ${field.label} ».`);
        }
        setPath(item, field.path, value);
        break;
      }
      case "lines": {
        const lines = String(formData.get(key) ?? "")
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        setPath(item, field.path, lines);
        break;
      }
      case "number": {
        const raw = String(formData.get(key) ?? "").replace(",", ".");
        const value = Number(raw);
        if (Number.isNaN(value)) {
          throw new Error(`« ${field.label} » doit être un nombre.`);
        }
        setPath(item, field.path, value);
        break;
      }
      case "checkbox": {
        setPath(item, field.path, formData.get(key) === "on");
        break;
      }
      case "image": {
        const file = formData.get(`${key}__file`);
        if (file instanceof File && file.size > 0) {
          setPath(item, field.path, await saveImage(file));
        } else {
          const current = String(formData.get(`${key}__current`) ?? "");
          if (current) {
            setPath(item, field.path, JSON.parse(current) as ImageRef);
          } else if (field.required) {
            throw new Error(`Ajoutez une photo pour « ${field.label} ».`);
          }
        }
        break;
      }
      case "photos": {
        const current = JSON.parse(
          String(formData.get(`${key}__current`) ?? "[]")
        ) as HistoirePhoto[];
        const kept: HistoirePhoto[] = [];
        current.forEach((photo, i) => {
          if (formData.get(`${key}__del_${i}`) === "on") return;
          const alt = String(formData.get(`${key}__alt_${i}`) ?? photo.alt).trim();
          kept.push({ src: photo.src, alt: alt || photo.alt });
        });
        const fallbackAlt =
          String(getPath(item, section.titlePath ?? "title") ?? "").trim() ||
          "Photo du club";
        for (const file of formData.getAll(`${key}__new`)) {
          if (file instanceof File && file.size > 0) {
            kept.push({ src: await saveImage(file), alt: fallbackAlt });
          }
        }
        setPath(item, field.path, kept);
        break;
      }
    }
  }

  return item;
}

/* --------------------------- Collections --------------------------- */

export async function saveSectionItem(
  slug: string,
  index: number | null,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  let error: string | null = null;
  try {
    const items = readJson<Item[]>(section.file);
    const base = index !== null ? items[index] ?? {} : {};
    const item = await parseFields(section, formData, base);
    if (index !== null && index >= 0 && index < items.length) {
      items[index] = item;
    } else {
      items.push(item);
    }
    writeJson(section.file, items);
  } catch (e) {
    error = e instanceof Error ? e.message : "Une erreur inattendue est survenue.";
  }
  if (error) {
    redirect(
      `/admin/${slug}/${index ?? "nouveau"}?erreur=${encodeURIComponent(error)}`
    );
  }
  revalidateSite();
  redirect(`/admin/${slug}?ok=1`);
}

export async function deleteSectionItem(
  slug: string,
  index: number
): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  const items = readJson<Item[]>(section.file);
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    writeJson(section.file, items);
    revalidateSite();
  }
  redirect(`/admin/${slug}?ok=1`);
}

export async function moveSectionItem(
  slug: string,
  index: number,
  direction: -1 | 1
): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  const items = readJson<Item[]>(section.file);
  const target = index + direction;
  if (index >= 0 && index < items.length && target >= 0 && target < items.length) {
    [items[index], items[target]] = [items[target], items[index]];
    writeJson(section.file, items);
    revalidateSite();
  }
  redirect(`/admin/${slug}`);
}

/* --------------------------- Fiche unique -------------------------- */

export async function saveSingleton(
  slug: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const section = getSection(slug);
  let error: string | null = null;
  try {
    const base = readJson<Item>(section.file);
    const item = await parseFields(section, formData, base);
    writeJson(section.file, item);
  } catch (e) {
    error = e instanceof Error ? e.message : "Une erreur inattendue est survenue.";
  }
  if (error) {
    redirect(`/admin/${slug}?erreur=${encodeURIComponent(error)}`);
  }
  revalidateSite();
  redirect(`/admin/${slug}?ok=1`);
}

/* ----------------------------- Messages ---------------------------- */

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  const messages = readJson<{ id: string }[]>("messages");
  writeJson(
    "messages",
    messages.filter((m) => m.id !== id)
  );
  redirect("/admin/messages");
}
