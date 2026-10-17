"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { logo } from "@/lib/images";

/* Balle du logo, redessinée en vectoriel : dégradé rose → violet et
   coutures blanches relevés sur le logo officiel. Elle sert aussi de
   balle à l'écran d'ouverture de l'accueil, qui vient se poser sur
   celle du logo. Le favicon (app/icon.svg) reprend le même dessin. */
export function BallMark({ className = "" }: { className?: string }) {
  // Identifiants uniques : la balle peut apparaître plusieurs fois par page.
  const id = useId();
  const gradient = `${id}-g`;
  const clip = `${id}-c`;
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0.6" x2="1" y2="0.4">
          <stop offset="0" stopColor="#ea336f" />
          <stop offset="0.5" stopColor="#a52c73" />
          <stop offset="1" stopColor="#5c1c6e" />
        </linearGradient>
        <clipPath id={clip}>
          <circle cx="64" cy="64" r="64" />
        </clipPath>
      </defs>
      <circle cx="64" cy="64" r="64" fill={`url(#${gradient})`} />
      <g
        clipPath={`url(#${clip})`}
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
      >
        <path d="M3 39 C 30 52, 48 84, 35 124" />
        <path d="M96 5 C 86 40, 96 74, 125 93" />
      </g>
    </svg>
  );
}

/* Logo officiel du club (fond noir rendu transparent), pour les fonds
   sombres : barre de navigation, menu mobile, connexion admin. */
export default function LogoMark({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const ballRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (ballRef.current) {
        ballRef.current.style.transform = `rotate(${window.scrollY * 0.35}deg)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group relative block shrink-0"
      aria-label="Tennis Padel Garden Club Soufflenheim, accueil"
    >
      <Image
        src={logo}
        alt=""
        loading="eager"
        sizes="92px"
        className="block h-16 w-auto"
      />
      {/* La balle du logo, redessinée par-dessus l'image : elle tourne au
          défilement et au survol, et celle de l'écran d'ouverture vient
          s'y poser (data-logo-ball). Position relevée sur l'image :
          centre à 51,8 % de la largeur et 45,7 % de la hauteur, diamètre
          de 7,4 % de la largeur, un peu agrandi pour couvrir le bord. */}
      <span
        data-logo-ball
        className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2"
        style={{ left: "51.8%", top: "45.7%", width: "8%" }}
      >
        <span ref={ballRef} className="block h-full w-full will-change-transform">
          <BallMark className="h-full w-full transition-transform duration-300 group-hover:rotate-12" />
        </span>
      </span>
    </Link>
  );
}
