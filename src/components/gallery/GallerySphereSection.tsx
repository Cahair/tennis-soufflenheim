"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import GalleryGrid from "@/components/GalleryGrid";
import type { GalleryItem } from "@/lib/content-types";
import GalleryLightbox from "./GalleryLightbox";
import { canUseWebGL, prefersReducedMotion } from "./detect";
import { thumbUrl } from "./thumb";

/* Le chunk three.js n'est téléchargé que si le mode « sphere » est
   retenu ; ssr:false est obligatoire (WebGL) et n'est permis que
   depuis un composant client — d'où cette frontière. */
const GallerySphere = dynamic(() => import("./GallerySphere"), {
  ssr: false,
  loading: () => <StageShell />,
});

/* Même encombrement (300vh) que la sphère montée : aucun saut de mise
   en page entre l'attente, le chargement du chunk et le canvas. */
function StageShell() {
  return (
    <div className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center">
        <p className="text-sm font-medium text-night-800/50">
          Chargement de la galerie…
        </p>
      </div>
    </div>
  );
}

/* Détection des capacités via useSyncExternalStore : le serveur rend
   « pending », le client bascule dès l'hydratation — sans mismatch ni
   setState dans un effet. Résultat mémoïsé pour toute la session. */
type SphereMode = "pending" | "sphere" | "fallback";
const subscribeNoop = () => () => {};
let cachedMode: SphereMode | null = null;
function getClientMode(): SphereMode {
  if (cachedMode === null) {
    cachedMode =
      canUseWebGL() && !prefersReducedMotion() ? "sphere" : "fallback";
  }
  return cachedMode;
}
const getServerMode = (): SphereMode => "pending";

export default function GallerySphereSection({
  items,
  photoLimit,
}: {
  items: GalleryItem[];
  photoLimit?: number;
}) {
  const shown = useMemo(
    () => (photoLimit ? items.slice(0, photoLimit) : items),
    [items, photoLimit]
  );

  const mode = useSyncExternalStore(subscribeNoop, getClientMode, getServerMode);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const open = useCallback((i: number) => setLightbox(i), []);
  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((v) =>
        v === null ? v : (v - 1 + shown.length) % shown.length
      ),
    [shown.length]
  );
  const next = useCallback(
    () => setLightbox((v) => (v === null ? v : (v + 1) % shown.length)),
    [shown.length]
  );

  /* Repli : WebGL indisponible ou prefers-reduced-motion — la grille
     classique reprend du service (avec sa propre lightbox). */
  if (mode === "fallback" || shown.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GalleryGrid items={items} withFilter />
      </div>
    );
  }

  return (
    <div>
      {/* Balisage réel pour Google et les lecteurs d'écran : le canvas
          WebGL est invisible pour eux. Les boutons donnent aussi un
          accès clavier à la lightbox. */}
      <ul className="sr-only">
        {shown.map((item, i) => (
          <li key={item.src.src}>
            <button type="button" onClick={() => open(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUrl(item.src.src)} alt={item.alt} loading="lazy" />
              <span>
                {item.caption} — {item.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {mode === "sphere" ? (
        <GallerySphere items={shown} onSelect={open} />
      ) : (
        <StageShell />
      )}

      {lightbox !== null ? (
        <GalleryLightbox
          items={shown}
          index={lightbox}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </div>
  );
}
