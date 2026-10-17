"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { GalleryItem } from "@/lib/content-types";
import PhotoPlane from "./PhotoPlane";
import { thumbUrl } from "./thumb";
import { useTextureQueue } from "./useTextureQueue";

/* Rayon de la balle, et rayon où sont posées les photos : collées à la
   surface, juste au-dessus de la couture pour ne pas la traverser. */
const BALL_RADIUS = 2.9;
const ORBIT_RADIUS = BALL_RADIUS + 0.09;
const BASE_CAMERA_Z = 10;
/* Inclinaison de repos de la balle : la couture se lit en « S ». */
const TILT_X = 0.42;
const TILT_Z = -0.28;

/* Couture d'une balle de tennis : courbe fermée posée sur la sphère
   unité (a + b = 1, c = 2√(ab) garantit |p| = 1). */
const SEAM_A = 0.75;
const SEAM_B = 0.25;
const SEAM_C = 2 * Math.sqrt(SEAM_A * SEAM_B);
function seamPoint(t: number, target: THREE.Vector3) {
  return target.set(
    SEAM_A * Math.cos(t) + SEAM_B * Math.cos(3 * t),
    SEAM_A * Math.sin(t) - SEAM_B * Math.sin(3 * t),
    SEAM_C * Math.sin(2 * t)
  );
}

/* Tirage pseudo-aléatoire à graine fixe (mulberry32) : rendu stable,
   identique à chaque montage. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Feutrine : bruit clair en niveaux de gris, servant à la fois de
   texture (grain) et de relief (bumpMap). */
function makeFeltTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(size, size);
  const rand = seeded(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 205 + rand() * 50;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Balle de tennis géante aux couleurs du logo. Elle tourne au       */
/*  défilement (un tour complet sur la course de la section), au      */
/*  glisser et doucement d'elle-même. Les photos glissent le long de  */
/*  la couture comme sur un tapis roulant ; celle qui passe devant    */
/*  grossit et son index est remonté au DOM (légende, compteur).      */
/* ------------------------------------------------------------------ */
export default function TennisBallScene({
  items,
  progressRef,
  dragRef,
  invalidateRef,
  onSelect,
  onFront,
}: {
  items: GalleryItem[];
  progressRef: { current: number };
  dragRef: { current: number };
  invalidateRef: { current: (() => void) | null };
  onSelect: (index: number) => void;
  onFront: (index: number) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  const felt = useMemo(() => makeFeltTexture(), []);
  useEffect(() => () => felt?.dispose(), [felt]);

  /* Couture : un tube blanc, doublé d'un halo néon rose. */
  const seamCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const v = new THREE.Vector3();
    for (let i = 0; i < 240; i++) {
      seamPoint((i / 240) * Math.PI * 2, v);
      pts.push(v.clone().multiplyScalar(BALL_RADIUS * 1.004));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);

  /* Poils de feutre lumineux autour de la balle. */
  const fuzz = useMemo(() => {
    const count = 1100;
    const positions = new Float32Array(count * 3);
    const rand = seeded(1979);
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const r = BALL_RADIUS * (1.03 + Math.pow(rand(), 2.2) * 0.75);
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = r * s * Math.cos(phi);
      positions[i * 3 + 1] = r * u;
      positions[i * 3 + 2] = r * s * Math.sin(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);
  useEffect(() => () => fuzz.dispose(), [fuzz]);

  /* Taille des photos : un peu plus grandes quand elles sont peu nombreuses. */
  const baseSize = useMemo(
    () => Math.min(1.9, Math.max(1.3, 17 / Math.max(items.length, 1))),
    [items.length]
  );

  const urls = useMemo(() => items.map((it) => thumbUrl(it.src.src)), [items]);
  const textures = useTextureQueue(urls);

  const ballRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const registerMesh = useCallback((index: number, mesh: THREE.Mesh | null) => {
    meshRefs.current[index] = mesh;
  }, []);

  const scratch = useMemo(() => ({ v: new THREE.Vector3(), e: new THREE.Euler() }), []);
  const frontRef = useRef(-1);

  useFrame((state) => {
    /* Écran étroit : caméra reculée pour garder la balle entière. */
    const aspect = state.viewport.aspect;
    // Demi-largeur visible d'au moins 3,4 unités : la balle tient en entier.
    state.camera.position.z = Math.max(BASE_CAMERA_Z, 3.4 / (Math.tan((25 * Math.PI) / 180) * aspect));

    const time = state.clock.elapsedTime;
    const spin = progressRef.current * Math.PI * 2 + dragRef.current + time * 0.12;
    const ball = ballRef.current;
    if (ball) {
      ball.rotation.set(TILT_X, spin, TILT_Z);
      // La balle « respire », comme une balle qui vit.
      const breath = 1 + Math.sin(time * 2.2) * 0.012;
      ball.scale.setScalar(breath);
    }

    /* Les photos avancent le long de la couture, en sens inverse de la
       rotation : on a l'impression d'un tapis qui les fait défiler. */
    const n = meshRefs.current.length || 1;
    const conveyor = -progressRef.current * Math.PI * 1.6 - time * 0.025;
    const { v, e } = scratch;
    e.set(TILT_X, spin, TILT_Z);
    let front = 0;
    let frontZ = -Infinity;
    for (let i = 0; i < meshRefs.current.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      seamPoint((i / n) * Math.PI * 2 + conveyor, v);
      v.multiplyScalar(ORBIT_RADIUS).applyEuler(e);
      mesh.position.copy(v);
      // Photo plaquée sur la balle : face tournée vers l'extérieur.
      mesh.lookAt(v.x * 2, v.y * 2, v.z * 2);
      const facing = (v.z / ORBIT_RADIUS + 1) / 2; // 1 = face caméra
      const eased = facing * facing * (3 - 2 * facing);
      mesh.scale.setScalar(1 + 0.12 * Math.pow(eased, 4));
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.65 * eased;
      if (v.z > frontZ) {
        frontZ = v.z;
        front = i;
      }
    }
    if (front !== frontRef.current) {
      frontRef.current = front;
      onFront(front);
    }
  });

  return (
    <>
      {/* Éclairage : blanc en haut à gauche, violet en bas à droite, contre-jour
          rose : la balle passe du rose au violet comme celle du logo. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[-5, 6, 7]} intensity={2.2} />
      <pointLight position={[6, -5, 4]} intensity={150} decay={1.6} color="#8a2be2" />
      <pointLight position={[-2, 2, -6]} intensity={80} decay={1.6} color="#fc6898" />

      <group ref={ballRef}>
        <mesh>
          <sphereGeometry args={[BALL_RADIUS, 96, 96]} />
          <meshStandardMaterial
            color="#ea336f"
            map={felt ?? undefined}
            bumpMap={felt ?? undefined}
            bumpScale={1.4}
            roughness={0.92}
            metalness={0}
          />
        </mesh>
        <mesh>
          <tubeGeometry args={[seamCurve, 480, 0.05, 10, true]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh>
          <tubeGeometry args={[seamCurve, 480, 0.14, 10, true]} />
          <meshBasicMaterial
            color="#fda4c1"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <points geometry={fuzz}>
          <pointsMaterial
            size={0.035}
            color="#fda4c1"
            transparent
            opacity={0.75}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
      </group>

      {items.map((item, i) => (
        <PhotoPlane
          key={`${item.src.src}-${i}`}
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
