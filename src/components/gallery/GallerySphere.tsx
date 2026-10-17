"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryItem } from "@/lib/content-types";
import TennisBallScene from "./TennisBallScene";

/* Étage 3D de la galerie : un wrapper de 300vh dont l'intérieur reste
   collé à l'écran (sticky). Les ~200vh de course pilotent exactement un
   tour de balle ; avant et après, la page défile normalement — aucun
   détournement de la molette, la section reste toujours quittable. */
export default function GallerySphere({
  items,
  onSelect,
}: {
  items: GalleryItem[];
  onSelect: (index: number) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const dragRef = useRef(0);
  const inViewRef = useRef(true);
  const [inView, setInView] = useState(true);
  const invalidateRef = useRef<(() => void) | null>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const gestureRef = useRef<{
    id: number;
    x: number;
    y: number;
    active: boolean;
    isMouse: boolean;
  } | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const track = rect.height - window.innerHeight;
      const p = track > 0 ? Math.min(1, Math.max(0, -rect.top / track)) : 0;
      if (p !== progressRef.current) {
        progressRef.current = p;
        invalidateRef.current?.();
      }
    };

    const onScroll = () => {
      if (inViewRef.current) update();
    };
    const onResize = () => {
      update();
      invalidateRef.current?.();
    };

    /* Hors écran, la boucle d'animation est coupée (frameloop="never") :
       le canvas ne consomme ni rAF ni GPU quand la section est passée. */
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) update();
        },
        { rootMargin: "200px 0px" }
      );
      io.observe(wrapper);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* Photo au premier plan : mise à jour directe du DOM, sans re-rendu. */
  const onFront = useCallback(
    (i: number) => {
      const item = items[i];
      if (!item) return;
      if (captionRef.current) captionRef.current.textContent = item.caption;
      if (categoryRef.current) categoryRef.current.textContent = item.category;
      if (countRef.current) {
        countRef.current.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      }
    },
    [items]
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    gestureRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      active: false,
      isMouse: e.pointerType === "mouse",
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;

    if (!g.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      /* Au doigt, un geste vertical doit rester un scroll de page
         (touch-action: pan-y) : on abandonne le drag. */
      if (!g.isMouse && Math.abs(dy) >= Math.abs(dx)) {
        gestureRef.current = null;
        return;
      }
      g.active = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* pointeur déjà disparu : sans gravité */
      }
    }

    g.x = e.clientX;
    g.y = e.clientY;
    dragRef.current += (dx / window.innerWidth) * Math.PI;
    invalidateRef.current?.();
  };

  const endGesture = () => {
    gestureRef.current = null;
  };

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div
        aria-hidden="true"
        className="sticky top-0 h-svh cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        {/* Halo rose et violet derrière la balle */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(110vw,62rem)] w-[min(110vw,62rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-rose-500/35 via-ultra-500/15 to-transparent to-70%" />

        <Canvas
          frameloop={inView ? "always" : "never"}
          flat
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <TennisBallScene
            items={items}
            progressRef={progressRef}
            dragRef={dragRef}
            invalidateRef={invalidateRef}
            onSelect={onSelect}
            onFront={onFront}
          />
        </Canvas>

        {/* Tableau de bord : photo au premier plan, compteur, consigne */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <div className="max-w-sm">
              <span
                ref={categoryRef}
                className="inline-block rounded-full bg-rose-500 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-night-950"
              >
                {items[0]?.category}
              </span>
              <p ref={captionRef} className="mt-3 text-sm text-white/80 sm:text-base">
                {items[0]?.caption}
              </p>
            </div>
            <p
              ref={countRef}
              className="shrink-0 whitespace-nowrap font-display text-3xl tabular-nums text-rose-400 sm:text-4xl"
            >
              01 / {String(items.length).padStart(2, "0")}
            </p>
          </div>
          <p className="mx-auto mt-5 max-w-7xl text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/45">
            Faites défiler ou attrapez la balle · cliquez une photo pour l&rsquo;agrandir
          </p>
        </div>
      </div>
    </div>
  );
}
