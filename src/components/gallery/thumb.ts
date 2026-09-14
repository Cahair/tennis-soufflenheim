/* Vignettes servies par l'optimiseur d'images intégré de Next
   (/_next/image) : rien n'est généré sur disque et l'admin reste
   intouché. w=384 et q=75 font partie de la liste blanche par défaut
   de Next 16 — toute autre valeur exigerait une config dédiée. */
export function thumbUrl(src: string, width = 384): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
