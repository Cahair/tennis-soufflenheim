"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import type { GalleryItem } from "@/lib/content-types";
import PhotoPlane from "./PhotoPlane";
import { thumbUrl } from "./thumb";
import { useTextureQueue } from "./useTextureQueue";

const RADIUS = 3;
/* Assez loin pour que la sphère entière (rayon + demi-plan) tienne dans
   le viewport avec une marge : à z=10 et fov 50°, l'extension verticale
   maximale projetée reste ≈ 82 % de la demi-hauteur. */
const BASE_CAMERA_Z = 10;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export default function SphereScene({
  items,
  progressRef,
  dragRef,
  invalidateRef,
  onSelect,
}: {
  items: GalleryItem[];
  progressRef: { current: number };
  dragRef: { current: number };
  invalidateRef: { current: (() => void) | null };
  onSelect: (index: number) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);

  /* Expose invalidate() au composant DOM parent (scroll, drag, IO). */
  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  /* Distribution de Fibonacci : positions unitaires, calculées une fois. */
  const units = useMemo(() => {
    const n = items.length;
    return items.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = GOLDEN_ANGLE * i;
      return [r * Math.cos(t), y, r * Math.sin(t)] as [number, number, number];
    });
  }, [items]);

  /* Taille de base ajustée au nombre de photos pour limiter les
     chevauchements quand on passera à la galerie complète. */
  const baseSize = useMemo(() => {
    const areaPerPhoto =
      (4 * Math.PI * RADIUS * RADIUS) / Math.max(items.length, 1);
    return Math.min(1.25, Math.max(0.55, Math.sqrt(areaPerPhoto) * 0.55));
  }, [items.length]);

  const urls = useMemo(() => items.map((it) => thumbUrl(it.src.src)), [items]);
  const textures = useTextureQueue(urls);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const registerMesh = useCallback((index: number, mesh: THREE.Mesh | null) => {
    meshRefs.current[index] = mesh;
  }, []);

  /* Boucle unique (frameloop="demand" : ne tourne que sur invalidate) :
     rotation des positions autour de Y — pas d'un groupe parent, pour
     que le billboard par copie du quaternion caméra reste exact —
     puis atténuation de la face arrière. */
  useFrame((state) => {
    /* Écran étroit : caméra reculée pour garder la sphère lisible. */
    const aspect = state.viewport.aspect;
    state.camera.position.z =
      aspect < 1 ? BASE_CAMERA_Z + (1 - aspect) * 4 : BASE_CAMERA_Z;

    const theta = progressRef.current * Math.PI * 2 + dragRef.current;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    for (let i = 0; i < units.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const [ux, uy, uz] = units[i];
      const x = ux * cos + uz * sin;
      const z = uz * cos - ux * sin;
      mesh.position.set(x * RADIUS, uy * RADIUS, z * RADIUS);
      mesh.quaternion.copy(state.camera.quaternion);
      const facing = (z + 1) / 2; // 1 = face caméra, 0 = face arrière
      const eased = facing * facing * (3 - 2 * facing);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.85 * eased;
    }
  });

  return (
    <>
      {items.map((item, i) => (
        <PhotoPlane
          key={item.src.src}
          index={i}
          texture={textures[i] ?? null}
          aspect={item.src.width / item.src.height}
          baseSize={baseSize}
          registerMesh={registerMesh}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
