import type { Metadata } from "next";
import GallerySphereSection from "@/components/gallery/GallerySphereSection";
import PageHero from "@/components/PageHero";
import FlashCta from "@/components/fx/FlashCta";
import NightFx from "@/components/landing/NightFx";
import { getGalleryComplete } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Galerie photos",
  description:
    "Le Tennis Padel Club Soufflenheim en images : piste de padel, courts de tennis, club house, fêtes du club et jeunes en action, en Alsace du Nord.",
  path: "/galerie",
});

export default async function GaleriePage() {
  const galleryComplete = await getGalleryComplete();
  return (
    <>
      <PageHero
        kicker="Galerie"
        title="Le club en images"
        text="Piste de padel flambant neuve, courts au cœur du village, terrasse au soleil, fêtes mémorables — et plus de 45 ans d'archives : bienvenue chez nous."
        echo="Clic-clac"
        effect="neon"
        tape={["Souriez", "Padel", "Archives", "Fêtes du club", "Terrasse", "Clic-clac"]}
      />

      <section className="relative bg-night-950 py-24">
        {/* Pleine largeur et hors de tout ancêtre transformé : il
            casserait le position:sticky de la sphère et le fixed de la
            lightbox. */}
        <GallerySphereSection items={galleryComplete} photoLimit={20} />
      </section>

      {/* Appel aux photographes : polaroïds et flash */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" beams floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FlashCta photos={galleryComplete} />
        </div>
      </section>
    </>
  );
}
