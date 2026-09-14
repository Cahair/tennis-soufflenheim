"use client";

import { memo, useEffect, useRef } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import type * as THREE from "three";

/* Un plan texturé de la sphère. Position, orientation (billboard) et
   opacité sont pilotées chaque frame par SphereScene ; ici on ne gère
   que la géométrie, le matériau et le clic. */
const PhotoPlane = memo(function PhotoPlane({
  index,
  texture,
  aspect,
  baseSize,
  registerMesh,
  onSelect,
}: {
  index: number;
  texture: THREE.Texture | null;
  aspect: number;
  baseSize: number;
  registerMesh: (index: number, mesh: THREE.Mesh | null) => void;
  onSelect: (index: number) => void;
}) {
  const gl = useThree((s) => s.gl);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  /* Passer de « pas de map » à « map » change le shader : three exige
     une recompilation explicite. */
  useEffect(() => {
    if (materialRef.current) materialRef.current.needsUpdate = true;
  }, [texture]);

  /* Ratio réel conservé, surface ~constante (largeur × hauteur ≈ base²),
     facteur borné pour éviter les panoramas démesurés. */
  const safeAspect = aspect > 0 ? aspect : 1;
  const scale = Math.min(1.5, Math.max(0.7, Math.sqrt(safeAspect)));
  const width = baseSize * scale;
  const height = width / safeAspect;

  return (
    <mesh
      ref={(m) => {
        registerMesh(index, m);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.delta > 6) return; // c'était un drag, pas un clic
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = "";
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture ?? undefined}
        color={texture ? "#ffffff" : "#ddd5c2"}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
});

export default PhotoPlane;
