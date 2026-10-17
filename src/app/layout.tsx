import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { openGraphDefaults, SITE_NAME } from "@/lib/seo";
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

/* Titre et description de l'accueil, repris par défaut ailleurs : ce
   sont eux qui s'affichent dans Google pour « club tennis Bas-Rhin »,
   « padel Alsace du Nord »… d'où les mots-clés géographiques. */
const defaultTitle = `${SITE_NAME} · Tennis & padel dans le Bas-Rhin (67)`;
const defaultDescription =
  "Club de tennis, padel et pickleball à Soufflenheim (Bas-Rhin), à 20 min de Haguenau : padel couvert, école de tennis dès 5 ans, réservation en ligne 7j/7.";

/* Codes de validation Search Console / Bing Webmaster Tools, fournis
   par variables d'environnement (inutile si la validation se fait
   par DNS chez l'hébergeur). */
const bingVerification = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s · ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  openGraph: {
    ...openGraphDefaults,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/* Couleur de la barre du navigateur sur mobile : le noir du logo. */
export const viewport: Viewport = {
  themeColor: "#0a0610",
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
