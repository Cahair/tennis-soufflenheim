"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/fx/gsap";

/* En-tête de section des pages intérieures, sur fond de nuit : les
   mots du titre montent un à un hors de leur masque, le trait du
   kicker se dessine. `tone="dark"` est conservé pour les rares fonds
   clairs (texte nuit). */
export default function SectionHeader({
  kicker,
  title,
  text,
  align = "center",
  tone = "light",
}: {
  kicker: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const [heading] = q(".sh-title");
        const split = SplitText.create(heading, { type: "words", mask: "words" });
        const trigger = { trigger: root.current, start: "top 85%" };
        gsap.from(split.words, { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.06, ease: "expo.out", scrollTrigger: trigger });
        gsap.from(q(".sh-fade"), { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: trigger });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  const alignClass = align === "center" ? "mx-auto text-center items-center" : "items-start";
  const kickerColor = tone === "dark" ? "text-rose-600" : "text-rose-300";
  const titleColor = tone === "dark" ? "text-night-950" : "text-white";
  const textColor = tone === "dark" ? "text-night-950/70" : "text-white/70";

  return (
    <div ref={root} className={`flex max-w-3xl flex-col gap-5 ${alignClass}`}>
      <span className={`sh-fade kicker ${align === "center" ? "kicker-center" : ""} ${kickerColor}`}>{kicker}</span>
      <h2 className={`sh-title display text-[clamp(2.4rem,5vw,4.2rem)] ${titleColor}`}>{title}</h2>
      {text ? <p className={`sh-fade text-base leading-relaxed sm:text-lg ${textColor}`}>{text}</p> : null}
    </div>
  );
}
