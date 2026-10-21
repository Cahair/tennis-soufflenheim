/* ------------------------------------------------------------------ */
/*  Types du contenu éditable via l'administration (/admin).          */
/*  Chaque type correspond à un fichier JSON dans data/content/       */
/*  (seed versionné dans content/).                                   */
/* ------------------------------------------------------------------ */

/* Compatible structurellement avec StaticImageData : un ImageRef
   peut être passé tel quel à <Image src={...}> */
export type ImageRef = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  baseline: string;
  address: { street: string; city: string; region: string; directions: string };
  phoneClub: string;
  phonePresident: string;
  president: string;
  emails: { president: string };
  links: {
    tenup: string;
    fftPadel: string;
    itineraire: string;
  };
};

export type Social = {
  label: string;
  href: string;
  icon: string; // clé dans socialIconPaths (facebook, instagram, youtube, tiktok, globe…)
};

export type Stat = { value: number; suffix: string; label: string };

export type Discipline = {
  name: string;
  badge: string;
  image: ImageRef;
  description: string;
  features: string[];
  cta: { label: string; href: string };
};

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  eventDate?: string; // AAAA-MM-JJ : jour de l'événement annoncé, affiché à la place de `date` sur la page Actualités
  category: string;
  excerpt: string;
  content?: string; // article complet (page /actualites/[slug]) ; à défaut, le résumé
  popup?: boolean; // annoncée en pop-up sur tout le site (la première cochée)
  image: ImageRef;
};

export type ClubEvent = {
  day: string;
  month: string;
  title: string;
  meta: string;
  date?: string; // AAAA-MM-JJ, pour schema.org (le jour et le mois affichés restent day/month)
};

export type PriceCard = {
  name: string;
  price: string;
  period: string;
  featured?: boolean;
  features: string[];
};

export type CotisationPart = { name: string; text: string };

export type Extra = { name: string; price: string; unit: string; note: string };

export type TennisCourse = { name: string; detail: string; price: string };

export type InfosPratiques = { items: string[] };

export type Faq = { q: string; a: string };

export type Testimonial = { quote: string; name: string; role: string };

export type GalleryItem = {
  src: ImageRef;
  alt: string;
  category: string;
  caption: string;
};

export type Sponsor = { name: string; logo: ImageRef; detail?: string };

export type CommitteeMember = {
  role: string;
  name: string;
  contact?: string;
  icon: string; // crown | pen | coins | spark | trophy | wrench | shield
  photo?: ImageRef; // à défaut, vignette avec initiales + icône
  commissions?: string[]; // toutes les commissions où siège le membre
};

export type Facility = {
  title: string;
  detail: string;
  tag: string;
  image: ImageRef;
};

export type HistoirePhoto = { src: ImageRef; alt: string };

export type HistoireChapitre = {
  period: string;
  title: string;
  paragraphs: string[];
  photos: HistoirePhoto[];
};

export type HistoireInfos = {
  remerciements: string;
  membresComite: string[];
  educateurs: string[];
};

/* Bloc « Un club de village… » de la page d'accueil (le titre et les
   photos du collage restent gérés dans le code). */
export type HomeIntro = {
  paragraph: string;
  points: string[];
};

export type ReservationInfo = {
  tag: string;
  description: string;
  steps: string[];
  cta: string;
};

/* Bandeau doré « Prêt à jouer ? » (accueil + page Le club). */
export type CtaBandContent = {
  title: string;
  text: string;
};

export type ContactMessage = {
  id: string;
  date: string; // ISO
  name: string;
  email: string;
  subject: string;
  message: string;
};
