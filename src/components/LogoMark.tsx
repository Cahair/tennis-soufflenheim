"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function BallMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="var(--color-gold-500)" />
      <path
        d="M7 4.5 C 16 12, 16 28, 7 35.5"
        stroke="var(--color-pine-950)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M33 4.5 C 24 12, 24 28, 33 35.5"
        stroke="var(--color-pine-950)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      className="group flex items-center gap-3"
      aria-label="Tennis Padel Club Soufflenheim — accueil"
    >
      {/* Rotation pilotée par le scroll appliquée au wrapper, pour ne pas
          entrer en conflit avec le transform du hover sur le svg */}
      {/* data-logo-ball : point d'arrivée de la balle du splash (accueil) */}
      <span ref={ballRef} data-logo-ball className="inline-flex will-change-transform">
        <BallMark className="h-9 w-9 drop-shadow-md transition-transform duration-300 group-hover:rotate-12" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="display text-lg tracking-wide text-white">
          Tennis <span className="text-gold-400">Padel</span>
        </span>
        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
          Club Soufflenheim
        </span>
      </span>
    </Link>
  );
}
