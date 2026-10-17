"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import type { GalleryItem } from "@/lib/content-types";
import { ArrowRight } from "./Arrow";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";
import { getLenis } from "./intro";

/* Placement éditorial sur 12 colonnes (grand écran), repris en boucle
   si l'admin met plus de six photos en avant. `speed` : amplitude de
   la parallaxe verticale, en % de la hauteur de la photo. */
const layout = [
  { box: "lg:col-span-5 lg:col-start-1", ratio: "aspect-[4/5]", speed: -5 },
  { box: "lg:col-span-4 lg:col-start-8 lg:mt-48", ratio: "aspect-[3/4]", speed: 7 },
  { box: "lg:col-span-3 lg:col-start-2", ratio: "aspect-square", speed: 4 },
  { box: "lg:col-span-5 lg:col-start-7 lg:mt-20", ratio: "aspect-[4/3]", speed: -6 },
  { box: "lg:col-span-4 lg:col-start-2", ratio: "aspect-[3/4]", speed: 6 },
  { box: "lg:col-span-4 lg:col-start-8 lg:mt-32", ratio: "aspect-[4/5]", speed: -4 },
];

/* ------------------------------------------------------------------ */
/*  Galerie — mosaïque aérée, photos dévoilées puis flottant à des    */
/*  vitesses différentes ; un clic ouvre la visionneuse.              */
/* ------------------------------------------------------------------ */
export default function GalleryMosaic({ items }: { items: GalleryItem[] }) {
  const root = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((v) => (v === null ? v : (v - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setLightbox((v) => (v === null ? v : (v + 1) % items.length)),
    [items.length]
  );

  // Visionneuse ouverte : le défilement lissé ne doit pas bouger la page.
  useEffect(() => {
    if (lightbox === null) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [lightbox]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        const [title] = q(".gallery-title");
        const split = SplitText.create(title, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: title, start: "top 82%" },
        });

        (q(".gallery-item") as HTMLElement[]).forEach((fig) => {
          const reveal = { trigger: fig, start: "top 92%" };
          gsap.fromTo(
            fig.querySelector(".gallery-media"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", scrollTrigger: reveal }
          );
          gsap.fromTo(
            fig.querySelector(".gallery-img"),
            { scale: 1.3 },
            { scale: 1, duration: 1.9, ease: "expo.out", scrollTrigger: { ...reveal } }
          );
          gsap.from(fig.querySelector("figcaption"), {
            y: 14,
            autoAlpha: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: { ...reveal },
          });
        });
      });

      mm.add(MQ.desktop, () => {
        (q(".gallery-item") as HTMLElement[]).forEach((fig) => {
          const speed = Number(fig.dataset.speed) || 0;
          gsap.fromTo(
            fig,
            { yPercent: speed },
            {
              yPercent: -speed,
              ease: "none",
              scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="galerie"
      className="scroll-mt-20 overflow-clip bg-night-50 px-4 pb-32 pt-8 sm:px-6 lg:px-8 lg:pb-48"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="kicker kicker-center text-rose-600">Galerie</p>
          <h2 className="gallery-title display mt-6 text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.88] text-night-950">
            Le club
            <br />
            en images
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
          {items.map((item, i) => {
            const slot = layout[i % layout.length];
            return (
              <figure
                key={`${item.src.src}-${i}`}
                data-speed={slot.speed}
                className={`gallery-item max-lg:even:mt-14 ${slot.box}`}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  data-cursor="Agrandir"
                  aria-label={`Agrandir la photo : ${item.caption}`}
                  className={`gallery-media group relative block w-full overflow-hidden rounded-[1.25rem] bg-night-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500 lg:rounded-[1.75rem] ${slot.ratio}`}
                >
                  <div className="gallery-img absolute inset-0">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      placeholder={item.src.blurDataURL ? "blur" : "empty"}
                      sizes="(max-width: 1024px) 46vw, 36vw"
                      className="object-cover transition-[scale] duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>
                </button>
                <figcaption className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-sm text-night-950/75">{item.caption}</span>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-rose-600">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center lg:mt-32">
          <Link href="/galerie" className="btn btn-night">
            Voir toute la galerie
            <ArrowRight />
          </Link>
        </div>
      </div>

      {lightbox !== null ? (
        <GalleryLightbox
          items={items}
          index={lightbox}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </section>
  );
}
