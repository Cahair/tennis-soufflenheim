import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getGallery } from "@/lib/content";

export default async function GalleryPreview() {
  const gallery = await getGallery();
  return (
    <section id="galerie" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            kicker="Galerie"
            title="Le club en images"
            text="Cliquez sur une photo pour l'agrandir — et venez écrire la suite de l'album avec nous."
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-14">
            <GalleryGrid items={gallery} />
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-10 text-center">
            <Link href="/galerie" className="btn btn-pine">
              Voir toute la galerie
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
