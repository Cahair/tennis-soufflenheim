"use client";

import { useRef } from "react";
import Link from "next/link";
import CourtLines from "@/components/CourtLines";
import { ArrowRight } from "./Arrow";
import BallFx, { type FxApi } from "./BallFx";
import Magnetic from "./Magnetic";
import NightFx from "./NightFx";
import { frenchSpacing, gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/* Garde le dernier mot et sa ponctuation d'un seul tenant : SplitText
   coupe aussi sur l'espace insécable, un « ? » pourrait sinon passer
   seul à la ligne. */
function KeepLastWord({ text }: { text: string }) {
  const match = text.match(/^([\s\S]*\s)?(\S+\s[?!:;»]+)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <span className="whitespace-nowrap">{match[2]}</span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Final — « Prêt à jouer ? » en très grand, lettres qui basculent,  */
/*  tracé d'un court qui se dessine en fond. Se fond dans le footer.  */
/*  Le bouquet final : une pluie de balles tombe derrière le titre à  */
/*  l'arrivée. Décor de nuit du hero : projecteurs, sol de piste,     */
/*  balles qui flottent. Le bouton mène aux tarifs : les liens Ten'up */
/*  ne vivent que dans les tarifs et le pied de page.                 */
/* ------------------------------------------------------------------ */
export default function FinalCall({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const [heading] = q(".final-title");
        const split = SplitText.create(heading, { type: "words,chars", mask: "chars" });
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 12,
          duration: 1.3,
          stagger: 0.035,
          ease: "expo.out",
          scrollTrigger: { trigger: heading, start: "top 85%" },
        });
        gsap.from(q(".final-fade"), {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 75%" },
        });
        gsap.from(q(".final-court rect, .final-court line"), {
          drawSVG: "0%",
          duration: 2.4,
          stagger: 0.12,
          ease: "power2.inOut",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });

        // Pluie de balles à l'arrivée.
        const section = root.current!;
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          once: true,
          onEnter: () => fx.current?.rain(window.innerWidth < 640 ? 9 : 16),
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-clip bg-night-950 px-4 pb-28 pt-32 text-white sm:px-6 lg:px-8 lg:pb-36 lg:pt-44"
    >
      <NightFx floor beams fx={false} />
      {/* Halo rose et violet du logo, centré derrière le titre */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[min(70rem,140%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-rose-500/25 via-ultra-500/10 to-transparent to-70%" />
      <CourtLines className="final-court pointer-events-none absolute left-1/2 top-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/[0.07] lg:w-[88rem]" />

      {/* Balles et étincelles, derrière le contenu */}
      <BallFx apiRef={fx} className="z-0" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="final-fade kicker kicker-center text-[0.65rem] text-rose-400 sm:text-xs">
          Tennis Padel Garden Club de Soufflenheim
        </p>
        <h2 className="final-title display mt-8 text-[clamp(3.4rem,13vw,13rem)] leading-[0.86] text-rose-400">
          <KeepLastWord text={frenchSpacing(title)} />
        </h2>
        <p className="final-fade mx-auto mt-10 max-w-xl text-lg leading-relaxed text-white/70">
          {text}
        </p>
        <div className="final-fade mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Magnetic>
            <Link href="/tarifs" className="btn btn-rose">
              Rejoindre le club
              <ArrowRight />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/contact" className="btn btn-outline-light">
              Nous contacter
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
