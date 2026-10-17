import type { Metadata } from "next";
import Link from "next/link";
import GallerySphereSection from "@/components/gallery/GallerySphereSection";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
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
      />

      <section className="relative bg-night-950 py-24">
        {/* Pleine largeur et hors de <Reveal> : un ancêtre transformé
            casserait le position:sticky de la sphère et le fixed de la
            lightbox. */}
        <GallerySphereSection items={galleryComplete} photoLimit={20} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={150}>
            <div className="mt-16 rounded-3xl bg-night-800 p-10 text-center text-white">
              <h2 className="display text-3xl text-white sm:text-4xl">
                Vous avez de belles photos du club ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/65">
                Tournois, doubles entre amis, couchers de soleil sur les courts :
                envoyez-nous vos clichés, les plus beaux rejoindront la galerie.
              </p>
              <div className="mt-7">
                <Link href="/contact" className="btn btn-rose">
                  Envoyer mes photos
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
