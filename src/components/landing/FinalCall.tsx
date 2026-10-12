"use client";

import { useRef } from "react";
import Link from "next/link";
import CourtLines from "@/components/CourtLines";
import { ArrowUpRight } from "./Arrow";
import Magnetic from "./Magnetic";
import { frenchSpacing, gsap, MQ, SplitText, useGSAP } from "./gsap";

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
/* ------------------------------------------------------------------ */
export default function FinalCall({
  title,
  text,
  tenup,
  cta,
}: {
  title: string;
  text: string;
  tenup: string;
  cta: string;
}) {
  const root = useRef<HTMLElement>(null);

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
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-clip bg-pine-950 px-4 pb-28 pt-32 text-white sm:px-6 lg:px-8 lg:pb-36 lg:pt-44"
    >
      <CourtLines className="final-court pointer-events-none absolute left-1/2 top-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/[0.07] lg:w-[88rem]" />

      <div className="relative mx-auto max-w-7xl text-center">
        <p className="final-fade kicker kicker-center text-[0.65rem] text-gold-400 sm:text-xs">
          Tennis Padel Club Soufflenheim
        </p>
        <h2 className="final-title display mt-8 text-[clamp(3.4rem,13vw,13rem)] leading-[0.86] text-gold-400">
          <KeepLastWord text={frenchSpacing(title)} />
        </h2>
        <p className="final-fade mx-auto mt-10 max-w-xl text-lg leading-relaxed text-white/70">
          {text}
        </p>
        <div className="final-fade mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Magnetic>
            <a
              href={tenup}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="reservation-tenup"
              data-umami-event-emplacement="appel-final"
              className="btn btn-gold"
            >
              {cta}
              <ArrowUpRight />
            </a>
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
