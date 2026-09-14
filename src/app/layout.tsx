import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Tennis Padel Club Soufflenheim — Tennis, padel & pickleball en Alsace du Nord",
    template: "%s · Tennis Padel Club Soufflenheim",
  },
  description:
    "Le TPCS vous accueille depuis 1979 à Soufflenheim : courts de tennis, piste de padel dernière génération et pickleball. Réservation en ligne 7j/7 via Ten'up.",
  openGraph: {
    title: "Tennis Padel Club Soufflenheim",
    description:
      "Tennis, padel & pickleball au cœur du pays des potiers, depuis 1979. Réservez votre court en ligne.",
    locale: "fr_FR",
    type: "website",
    siteName: "Tennis Padel Club Soufflenheim",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tennis Padel Club Soufflenheim — la piste de padel du club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

/* Séquence d'ouverture de la page d'accueil, décidée avant le premier
   rendu (pas de flash) : data-splash="on" joue l'écran d'ouverture une
   fois par session, data-intro="pending" masque le hero jusqu'à son
   entrée animée. Pas de splash sur un lien direct vers une section
   (/#reservation…). Filet de sécurité : si le JS ne prend jamais la
   main, tout est libéré au bout de 8 s. Rien n'est posé en mouvement
   réduit. */
const introScript = `(function(){try{var d=document.documentElement;if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-intro","pending");if(!sessionStorage.getItem("tpcs-splash")&&!location.hash){d.setAttribute("data-splash","on");d.style.overflow="hidden"}setTimeout(function(){if(d.getAttribute("data-splash")==="on"){d.setAttribute("data-splash","done");d.style.overflow=""}if(d.getAttribute("data-intro")==="pending")d.setAttribute("data-intro","ready")},8000)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
      // Le script ci-dessous modifie <html> avant l'hydratation.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
