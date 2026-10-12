/* URL canonique du site en production. Utilisée par metadataBase,
   le sitemap, robots.txt et les données structurées JSON-LD.
   Surchargeable via la variable d'environnement SITE_URL (à définir
   AVANT le build : les pages sont pré-rendues avec cette valeur). */
export const SITE_URL = (
  process.env.SITE_URL ?? "https://tpc-soufflenheim.fr"
).replace(/\/+$/, "");

/* Mesure d'audience Umami (sans cookies). Website ID fourni par Umami
   (Settings → Websites), à coller ici ou à passer via la variable
   d'environnement UMAMI_WEBSITE_ID (AVANT le build, comme SITE_URL).
   Tant qu'il est vide, aucun script n'est chargé et les mentions
   légales n'en parlent pas. */
export const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID ?? "";
export const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/* Position du club (entrée rue de Koenigsbruck), pour schema.org.
   Même point que le marqueur de la carte de la page Contact. */
export const CLUB_GEO = { latitude: 48.8323, longitude: 7.9664 };

/* Communes d'où viennent nos joueurs, avec un temps de trajet
   indicatif en voiture. Sert au bloc « Venir au club » des pages
   sports et à la zone desservie déclarée à Google (areaServed). */
export const NEARBY_TOWNS: { name: string; time: string }[] = [
  { name: "Sessenheim", time: "5 min" },
  { name: "Rountzenheim-Auenheim", time: "5 min" },
  { name: "Roeschwoog", time: "10 min" },
  { name: "Drusenheim", time: "10 min" },
  { name: "Kaltenhouse", time: "15 min" },
  { name: "Bischwiller", time: "15 min" },
  { name: "Haguenau", time: "20 min" },
  { name: "Seltz", time: "20 min" },
  { name: "Gambsheim", time: "20 min" },
  { name: "Brumath", time: "30 min" },
  { name: "Strasbourg", time: "40 min" },
];
