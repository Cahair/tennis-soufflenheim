import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/home/CtaBand";
import { ArrowRight } from "@/components/landing/Arrow";
import NightFx from "@/components/landing/NightFx";
import { clubHouseAccueil, clubHouseMembres, vainqueursPadel } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Le club-house",
  description:
    "Bar, salle conviviale, cuisine équipée, vestiaires équipés et terrasse garden : le club-house du Tennis Padel Garden Club de Soufflenheim, lieu de vie du club.",
  path: "/club-house",
});

/* Équipements du club-house. Liste figée dans le code, comme les
   textes des pages sports : à compléter quand le club enverra les
   photos des vestiaires et de la terrasse. */
const equipements = [
  { title: "Le bar", text: "Pour l'avant-match, l'après-match et tout ce qui se passe entre les deux." },
  { title: "Une salle conviviale", text: "150 m² pour les soirées du club, les remises de prix et les repas entre membres." },
  { title: "Cuisine équipée", text: "Raclettes, grillades, moules-frites : la cuisine tourne à chaque événement." },
  { title: "Vestiaires équipés", text: "Pour se changer avant de jouer et repartir frais après le match." },
  { title: "Terrasse & espace garden", text: "Au bord des pistes, à l'ombre, pour profiter des beaux jours." },
];

const photos: { src: StaticImageData; alt: string; caption: string; className: string }[] = [
  {
    src: clubHouseAccueil,
    alt: "Le bar du club-house, ses étagères et son comptoir en bois",
    caption: "Le bar",
    className: "col-span-2 aspect-[4/3] sm:aspect-auto",
  },
  {
    src: clubHouseMembres,
    alt: "Trois membres du club souriants, accoudés au bar du club-house",
    caption: "L'accueil",
    className: "aspect-[3/4]",
  },
  {
    src: vainqueursPadel,
    alt: "Remise des trophées d'un tournoi de padel dans la salle du club-house",
    caption: "La salle",
    className: "aspect-[3/4]",
  },
];

/* ------------------------------------------------------------------ */
/*  Le club-house : le lieu de vie du club, en photos et en quelques  */
/*  équipements. Peu de texte, beaucoup d'air.                        */
/* ------------------------------------------------------------------ */
export default function ClubHousePage() {
  return (
    <>
      <PageHero
        kicker="Le club"
        title="Le club-house"
        text="Un bar, une salle, une cuisine, des vestiaires équipés et la terrasse garden : ici, la partie continue bien après le dernier point."
        echo="Club-house"
        effect="drop"
        tape={["Bar", "Salle", "Cuisine", "Vestiaires", "Terrasse", "Garden"]}
      />

      {/* Photos */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="En images"
            title="Bienvenue chez nous"
            text="Le club-house rénové, au cœur du club : on s'y retrouve avant, pendant et après le jeu."
          />
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {photos.map((photo) => (
              <figure
                key={photo.caption}
                data-tilt
                className={`relative overflow-hidden rounded-[2rem] bg-night-900 ${photo.className}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 640px) 92vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950/85 to-transparent" />
                <figcaption className="display absolute bottom-5 left-6 text-2xl text-white">
                  {photo.caption}
                </figcaption>
                <div className="nfx-shine" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" floaters={[]} />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader kicker="Sur place" title="Tout pour rester" />
          <ul className="mt-16 divide-y divide-white/10 border-y border-white/10">
            {equipements.map((item, i) => (
              <li key={item.title} className="grid gap-2 py-8 sm:grid-cols-[5rem_1fr_1.4fr] sm:items-baseline sm:gap-8">
                <span aria-hidden="true" className="display text-2xl text-rose-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-3xl text-white">{item.title}</h3>
                <p className="leading-relaxed text-white/70">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-16 text-center">
            <Link href="/le-club#installations" className="link-arrow text-rose-300 hover:text-white">
              Toutes les installations du club
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
