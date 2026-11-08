import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SpashTuto from "@/components/SpashTuto";
import CtaBand from "@/components/home/CtaBand";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Vidéo de votre match avec Spash",
  description:
    "Filmez et revoyez vos matchs au Tennis Padel Garden Club de Soufflenheim avec l'application Spash : le tutoriel vidéo en quatre étapes.",
  path: "/video-match",
});

/* ------------------------------------------------------------------ */
/*  Page « Vidéo de match » : le tutoriel Spash pour récupérer la     */
/*  vidéo de ses parties (fichier dans public/videos).                */
/* ------------------------------------------------------------------ */
export default function VideoMatchPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vidéo de match", path: "/video-match" }])} />

      <PageHero
        kicker="Votre match en vidéo"
        title="Filmez et revoyez vos matchs"
        text="Avec l'application Spash, retrouvez la vidéo de vos parties sur votre téléphone : revoyez vos plus beaux points, progressez et partagez-les."
        echo="Replay"
        effect="neon"
      />

      <SpashTuto />

      <CtaBand />
    </>
  );
}
