"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { padelCourt } from "@/lib/images";

const VIDEO_ID = "Ds8nB-zO1pQ";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

const atouts = [
  {
    title: "100 % couvert",
    text: "La météo ne décide plus : la piste reste sèche, été comme hiver.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12a10 10 0 0 0-20 0Z" />
        <path d="M12 12v7a2 2 0 0 0 4 0" />
        <path d="M12 2v1" />
      </svg>
    ),
  },
  {
    title: "Éclairage LED",
    text: "Des conditions parfaites, du petit matin jusque tard en soirée.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "365 jours par an",
    text: "Réservez en ligne en quelques secondes, même un soir de décembre.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

const marqueeItems = [
  "Padel",
  "Nouveau au club",
  "100 % couvert",
  "Toute l'année",
  "Jour & nuit",
];

export default function PadelSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // La vidéo YouTube n'est montée que sur desktop, hors reduced-motion,
  // et seulement à l'approche de la section — mobile garde la photo animée.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 64rem)").matches
    ) {
      return;
    }
    // Sans IntersectionObserver (navigateurs anciens), on garde la photo.
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="nouveau-padel"
      ref={sectionRef}
      className="relative scroll-mt-20 bg-pine-950 text-white"
    >
      {/* Sticker « Pluie ? On joue ! » à cheval sur le bandeau doré */}
      <div className="absolute -top-12 right-8 z-20 hidden lg:block xl:right-16">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="animate-spin-slow absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 rounded-[1.4rem] bg-white shadow-xl shadow-pine-950/40" />
            <div className="absolute inset-0 rotate-45 rounded-[1.4rem] bg-white shadow-xl shadow-pine-950/40" />
          </div>
          <p className="relative -rotate-6 text-center leading-tight">
            <span className="block text-[0.7rem] font-black uppercase tracking-widest text-clay-500">
              Pluie ?
            </span>
            <span className="display block text-xl text-pine-950">
              On joue !
            </span>
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Arrière-plan : vidéo du club (desktop) ou photo Ken Burns */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden [container-type:size]"
        >
          <Image
            src={padelCourt}
            alt=""
            fill
            placeholder="blur"
            sizes="100vw"
            className="animate-kenburns object-cover object-center"
          />
          {showVideo && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1`}
              title="Vidéo d'ambiance du club"
              tabIndex={-1}
              allow="autoplay; encrypted-media"
              onLoad={() => setVideoReady(true)}
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: "max(100cqw, 177.78cqh)",
                height: "max(100cqh, 56.25cqw)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-pine-950/90 via-pine-950/55 to-pine-950/90" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60rem 30rem at 15% 15%, rgba(237,177,17,0.16), transparent 60%), radial-gradient(45rem 25rem at 90% 90%, rgba(192,90,51,0.18), transparent 60%)",
            }}
          />
        </div>

        {/* Filigrane typographique */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-2 hidden select-none justify-center lg:flex"
        >
          <span className="display animate-drift text-stroke-white text-[12rem] leading-none xl:text-[16rem]">
            PADEL
          </span>
        </div>

        {/* Contenu */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-36">
          <Reveal>
            <span className="kicker kicker-center text-[0.65rem] text-gold-400 sm:text-xs">
              Nouveau au club
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="display mt-6 text-5xl text-white sm:text-7xl lg:text-[5.5rem]">
              Le padel est arrivé…
              <br />
              <span className="gold-sheen bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent">
                et il est couvert !
              </span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Une piste SLAMCOURT dernière génération, à l&apos;abri sous une
              structure couverte : ici, la pluie n&apos;annule jamais un match.
              Attrapez une raquette, invitez trois partenaires — le terrain
              vous attend, quelle que soit la météo.
            </p>
          </Reveal>

          <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            {atouts.map((a, i) => (
              <Reveal key={a.title} delay={250 + i * 120} className="h-full">
                <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/50 hover:bg-white/[0.12]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300 ring-1 ring-gold-400/30 transition-transform duration-300 group-hover:scale-110">
                    {a.icon}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide text-white">
                    {a.title}
                  </span>
                  <span className="text-xs leading-relaxed text-white/60">
                    {a.text}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={650}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/#reservation" className="btn btn-gold">
                Réserver la piste
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                </svg>
              </Link>
              <a
                href={VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5-11-6.5z" />
                </svg>
                Voir la vidéo du club
              </a>
            </div>
          </Reveal>
        </div>

        {/* Ruban défilant */}
        <div className="marquee relative overflow-hidden border-t border-white/10 bg-pine-950/50 backdrop-blur-sm">
          <div className="marquee-track flex items-center gap-8 py-4 pr-8">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8">
                {marqueeItems.map((item, i) => (
                  <span key={item} className="flex items-center gap-8">
                    <span
                      className={`display whitespace-nowrap text-2xl sm:text-3xl ${
                        i % 2 === 0 ? "text-gold-400" : "text-stroke-gold"
                      }`}
                    >
                      {item}
                    </span>
                    <span className="text-lg text-white/30">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
