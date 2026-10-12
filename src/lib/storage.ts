import fs from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ */
/*  Stockage du contenu sur disque (côté serveur uniquement).         */
/*                                                                    */
/*  - Le contenu « vivant » est dans TPCS_DATA_DIR (défaut : ./data)  */
/*    → data/content/*.json, data/uploads/, data/backups/             */
/*  - Le seed versionné dans ./content sert de valeur initiale tant   */
/*    qu'un fichier n'a jamais été modifié via l'admin.               */
/*  - Chaque écriture sauvegarde l'ancienne version dans backups/.    */
/* ------------------------------------------------------------------ */

const ROOT = process.cwd();

export const DATA_DIR = process.env.TPCS_DATA_DIR
  ? path.resolve(process.env.TPCS_DATA_DIR)
  : path.join(ROOT, "data");

const SEED_DIR = path.join(ROOT, "content");
const CONTENT_DIR = path.join(DATA_DIR, "content");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MAX_BACKUPS_PER_FILE = 30;

function safeName(name: string): string {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(`Nom de contenu invalide : ${name}`);
  }
  return name;
}

export function readJson<T>(name: string): T {
  safeName(name);
  const live = path.join(CONTENT_DIR, `${name}.json`);
  const seed = path.join(SEED_DIR, `${name}.json`);
  const file = fs.existsSync(live) ? live : seed;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

/* Date de dernière modification d'un ensemble de contenus (fichier
   modifié via l'admin, sinon seed) : sert de lastmod au sitemap. */
export function contentUpdatedAt(names: string[]): Date | undefined {
  let latest = 0;
  for (const name of names) {
    safeName(name);
    const live = path.join(CONTENT_DIR, `${name}.json`);
    const file = fs.existsSync(live) ? live : path.join(SEED_DIR, `${name}.json`);
    if (fs.existsSync(file)) latest = Math.max(latest, fs.statSync(file).mtimeMs);
  }
  return latest ? new Date(latest) : undefined;
}

export function writeJson(name: string, value: unknown): void {
  safeName(name);
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const file = path.join(CONTENT_DIR, `${name}.json`);

  // Filet de sécurité : copie de l'ancienne version avant écrasement.
  if (fs.existsSync(file)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(file, path.join(BACKUPS_DIR, `${name}.${stamp}.json`));
    pruneBackups(name);
  }

  // Écriture atomique : fichier temporaire puis renommage.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

function pruneBackups(name: string): void {
  const prefix = `${name}.`;
  const all = fs
    .readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
    .sort();
  for (const old of all.slice(0, Math.max(0, all.length - MAX_BACKUPS_PER_FILE))) {
    fs.unlinkSync(path.join(BACKUPS_DIR, old));
  }
}
