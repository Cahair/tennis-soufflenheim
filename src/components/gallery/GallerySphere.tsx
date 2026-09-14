"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryItem } from "@/lib/content-types";
import SphereScene from "./SphereScene";

/* Étage 3D de la galerie : un wrapper de 300vh dont l'intérieur reste
   collé à l'écran (sticky). Les ~200vh de course pilotent exactement un
   tour de sphère ; avant et après, la page défile normalement — aucun
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
  const invalidateRef = useRef<(() => void) | null>(null);
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

    /* Hors écran, on ne recalcule rien : combiné à frameloop="demand",
       le canvas ne consomme ni rAF ni GPU quand la section est passée. */
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            update();
            invalidateRef.current?.();
          }
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
        <Canvas
          frameloop="demand"
          flat
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <SphereScene
            items={items}
            progressRef={progressRef}
            dragRef={dragRef}
            invalidateRef={invalidateRef}
            onSelect={onSelect}
          />
        </Canvas>
      </div>
    </div>
  );
}
