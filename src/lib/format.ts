/* Convertit un numéro affiché (« 03 88 86 79 08 ») en href tel:
   international (« tel:+33388867908 »). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+33${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

const frenchMonths = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/* Date ISO (« 2026-11-01 ») → « dimanche 1er novembre 2026 ».
   Renvoie undefined si la valeur n'est pas une date valide. */
export function frenchLongDate(iso: string): string | undefined {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  const month = frenchMonths[date.getUTCMonth()];
  if (!month || date.getUTCDate() !== +match[3]) return undefined;
  const weekday = date.toLocaleDateString("fr-FR", { weekday: "long", timeZone: "UTC" });
  const day = date.getUTCDate() === 1 ? "1er" : String(date.getUTCDate());
  return `${weekday} ${day} ${month} ${match[1]}`;
}

/* Convertit une date affichée (« 12 juin 2026 », « 1er mai 2026 ») en
   date ISO (« 2026-06-12 ») pour schema.org et le sitemap. Renvoie
   undefined si le texte saisi dans l'admin ne suit pas ce format. */
export function isoFromFrenchDate(text: string): string | undefined {
  const match = text
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = frenchMonths.indexOf(match[2]) + 1;
  const day = Number(match[1]);
  if (!month || day < 1 || day > 31) return undefined;
  return `${match[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* Découpe un texte saisi dans l'admin en paragraphes (séparés par une
   ligne vide). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
