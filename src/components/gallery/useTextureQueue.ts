"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

/* File de chargement à concurrence limitée : les vignettes sont
   demandées par petits lots au lieu de déclencher ~100 requêtes
   simultanées vers l'optimiseur d'images. Les textures chargées
   s'accumulent dans une Map url → texture ; les setState n'ont lieu
   que dans les callbacks asynchrones du loader. */
export function useTextureQueue(
  urls: string[],
  concurrency = 4
): (THREE.Texture | null)[] {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const [loaded, setLoaded] = useState<ReadonlyMap<string, THREE.Texture>>(
    () => new Map()
  );

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const acquired: THREE.Texture[] = [];
    let cursor = 0;

    const anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    const isWebGL2 = gl.capabilities.isWebGL2;

    const pump = () => {
      if (cancelled || cursor >= urls.length) return;
      const i = cursor++;
      const url = urls[i];
      loader.load(
        url,
        (tex) => {
          if (cancelled) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = anisotropy;
          if (!isWebGL2) {
            /* WebGL1 : pas de mipmaps sur des textures non puissance
               de deux (384×hauteur libre). */
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
          }
          acquired.push(tex);
          setLoaded((prev) => {
            const next = new Map(prev);
            next.set(url, tex);
            return next;
          });
          invalidate();
          pump();
        },
        undefined,
        () => {
          if (!cancelled) pump();
        }
      );
    };

    for (let k = 0; k < Math.min(concurrency, urls.length); k++) pump();

    return () => {
      cancelled = true;
      for (const tex of acquired) tex.dispose();
    };
  }, [urls, concurrency, gl, invalidate]);

  return useMemo(() => urls.map((u) => loaded.get(u) ?? null), [urls, loaded]);
}
