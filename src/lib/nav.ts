/* ------------------------------------------------------------------ */
/*  Éléments structurels du site, volontairement hors CMS : la        */
/*  navigation suit les pages du code, pas le contenu.                */
/* ------------------------------------------------------------------ */

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  {
    label: "Accueil",
    href: "/",
    children: [
      { label: "Haut de page", href: "/" },
      { label: "Le club en bref", href: "/#club" },
      { label: "Nos disciplines", href: "/#disciplines" },
      { label: "Nouveau : le padel", href: "/#nouveau-padel" },
      { label: "Réserver un court", href: "/#reservation" },
      { label: "Actualités & agenda", href: "/#actualites" },
      { label: "Galerie", href: "/#galerie" },
      { label: "FAQ", href: "/contact#faq" },
    ],
  },
  {
    label: "Le club",
    href: "/le-club",
    children: [
      { label: "Histoire & installations", href: "/le-club" },
      { label: "Le comité", href: "/comite" },
    ],
  },
  {
    label: "S'inscrire",
    href: "/tarifs",
    children: [
      { label: "Tarifs", href: "/tarifs" },
      { label: "Règlement intérieur", href: "/reglement-interieur" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Galerie", href: "/galerie" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

/* Pied de page : les pages seulement. Les ancres de l'accueil restent
   dans le menu, sinon la colonne s'allonge sans rien apporter. */
export const footerLinks = [
  { label: "Accueil", href: "/" },
  ...navLinks
    .filter((link) => link.href !== "/")
    .flatMap((link) => link.children ?? [link]),
];

/* Tracés SVG des icônes de réseaux sociaux (viewBox 24×24,
   currentColor). La clé correspond au champ `icon` du contenu. */
export const socialIconPaths: Record<string, string> = {
  facebook:
    "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 1 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 1 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 1 0 0-6Z",
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z",
  tiktok:
    "M12.5 0c1.3 0 2.6 0 3.9 0 .1 1.5.6 3.1 1.8 4.2 1.1 1.1 2.7 1.6 4.2 1.8v4c-1.4-.1-2.9-.4-4.2-1-.6-.3-1.1-.6-1.6-.9 0 2.9 0 5.8 0 8.7-.1 1.4-.5 2.8-1.4 3.9-1.3 1.9-3.6 3.2-5.9 3.2-1.4.1-2.9-.3-4.1-1-2-1.2-3.4-3.4-3.6-5.7 0-.5 0-1 0-1.5.2-1.9 1.1-3.7 2.6-5 1.7-1.4 4-2.1 6.1-1.7 0 1.5 0 3 0 4.4-1-.3-2.2-.2-3 .4-.6.4-1.1 1-1.4 1.7-.2.5-.1 1.1-.1 1.6.2 1.6 1.8 3 3.5 2.9 1.1 0 2.2-.7 2.8-1.6.2-.3.4-.7.4-1.1.1-1.8.1-3.6.1-5.4 0-4 0-8 0-12.1Z",
  globe:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.4a15.7 15.7 0 0 0-1.2-5.9A8 8 0 0 1 19.9 11ZM12 4c.9 1 2.2 3.3 2.5 7h-5C9.8 7.3 11.1 5 12 4ZM8.7 5.1A15.7 15.7 0 0 0 7.5 11H4.1a8 8 0 0 1 4.6-5.9ZM4.1 13h3.4c.1 2.2.6 4.2 1.2 5.9A8 8 0 0 1 4.1 13ZM12 20c-.9-1-2.2-3.3-2.5-7h5c-.3 3.7-1.6 6-2.5 7Zm3.3-1.1c.6-1.7 1.1-3.7 1.2-5.9h3.4a8 8 0 0 1-4.6 5.9Z",
};

export const socialIconOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "globe", label: "Autre (globe)" },
];
