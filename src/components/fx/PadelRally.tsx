"use client";

import { useRef, type CSSProperties } from "react";
import BallFx, { type FxApi } from "@/components/landing/BallFx";
import NightFx, { PadelBall } from "@/components/landing/NightFx";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/* Les six temps du rallye : un par écran de défilement. */
const STEPS = [
  {
    word: "4",
    title: "À quatre, dans une cage de verre",
    text: "On joue en double sur une piste de 20 × 10 m fermée par des vitres et du grillage. Raquette pleine, sans cordage, balle proche de celle du tennis.",
  },
  {
    word: "Service",
    title: "Le service à la cuillère",
    text: "Un rebond derrière la ligne, une frappe sous la taille, en diagonale dans le carré adverse. Pas besoin d'un service canon : l'échange démarre tout de suite.",
  },
  {
    word: "Vitre",
    title: "La vitre, votre meilleure alliée",
    text: "Après un rebond au sol, la balle peut taper la vitre : elle reste en jeu. Les échanges durent, les retournements de situation aussi.",
  },
  {
    word: "Volée",
    title: "Volée, bandeja, víbora",
    text: "Au filet, on attaque de volée. La bandeja, smash coupé et contrôlé, garde la position ; la víbora, plus vicieuse, file le long de la vitre.",
  },
  {
    word: "Smash",
    title: "Le smash qui sort de la cage",
    text: "Le coup roi : smasher si fort que la balle rebondit et passe par-dessus la vitre. « Por tres » : point gagné, tribune debout.",
  },
  {
    word: "Jeu",
    title: "On compte comme au tennis",
    text: "15, 30, 40, jeu. Si vous savez compter au tennis, vous savez compter au padel. Sinon, une partie suffit pour apprendre.",
  },
];

const SCORES = ["0 – 0", "15 – 0", "30 – 0", "30 – 15", "40 – 15", "Jeu !"];

/* Joueurs : rose pour l'équipe du bas, violet pour celle du fond. */
const PLAYERS = [
  { x: 78, y: 96, team: "a" },
  { x: 30, y: 64, team: "a" },
  { x: 24, y: 6, team: "b" },
  { x: 70, y: 36, team: "b" },
] as const;

/* Billboard : un élément posé sur la piste se redresse face à la caméra
   en annulant la rotation de la piste (variables --tilt et --spin). */
const FACE: CSSProperties = {
  transform: "rotateZ(calc(var(--spin) * -1)) rotateX(calc(var(--tilt) * -1))",
  transformOrigin: "50% 100%",
};

function Player({ team }: { team: "a" | "b" }) {
  const body = team === "a" ? "var(--color-rose-500)" : "var(--color-ultra-500)";
  return (
    <svg viewBox="0 0 40 80" className="h-full w-full drop-shadow-[0_0_10px_rgba(234,51,111,0.8)]" aria-hidden="true">
      <circle cx="20" cy="12" r="8" fill="#fff" />
      <rect x="9" y="23" width="22" height="34" rx="10" fill={body} />
      <rect x="12" y="55" width="6" height="22" rx="3" fill={body} />
      <rect x="22" y="55" width="6" height="22" rx="3" fill={body} />
      <ellipse cx="35" cy="26" rx="5" ry="7" fill="#fff" opacity="0.9" />
      <line x1="31" y1="34" x2="28" y2="40" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  « Le padel en six coups » : une piste vitrée en 3D (CSS) et un    */
/*  rallye joué au défilement. La section s'épingle, la caméra tourne */
/*  autour de la piste, la balle sert, tape la vitre, se fait volleyer */
/*  puis smasher hors de la cage ; chaque impact lâche une onde au    */
/*  sol, des étincelles et une secousse, le smash un flash plein      */
/*  écran. Texte, mot géant et tableau de score suivent l'échange.    */
/*                                                                    */
/*  Mouvement réduit : rien n'est épinglé, les six temps s'affichent  */
/*  en liste à côté de la piste immobile.                             */
/* ------------------------------------------------------------------ */
export default function PadelRally() {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const section = root.current!;
        const [court] = q(".pr-court") as HTMLElement[];
        const [ball] = q(".pr-ball") as HTMLElement[];
        const [ballZ] = q(".pr-ball-z") as HTMLElement[];
        const [face] = q(".pr-ball-face") as HTMLElement[];
        const [spinner] = q(".pr-ball-spin") as HTMLElement[];
        const [shadow] = q(".pr-shadow") as HTMLElement[];
        const [ring] = q(".pr-ring") as HTMLElement[];
        const [ringInner] = q(".pr-ring-inner") as HTMLElement[];
        const [backWall] = q(".pr-wall-back") as HTMLElement[];
        const [shake] = q(".pr-shake") as HTMLElement[];
        const [flash] = q(".pr-flash") as HTMLElement[];
        const [sticker] = q(".pr-sticker") as HTMLElement[];
        const steps = q(".pr-step") as HTMLElement[];
        const words = q(".pr-word") as HTMLElement[];
        const scores = q(".pr-score") as HTMLElement[];
        const dots = q(".pr-dot") as HTMLElement[];

        const cw = () => court.offsetWidth;
        const splits = steps.map((s) => SplitText.create(s.querySelector("h3"), { type: "chars,words", mask: "chars" }));

        gsap.set(steps.slice(1), { autoAlpha: 0 });
        gsap.set([...words.slice(1), ...scores.slice(1)], { autoAlpha: 0 });
        gsap.set([ball, shadow], { left: "72%", top: "94%" });
        gsap.set(ballZ, { z: () => cw() * 0.05 });
        gsap.set(sticker, { autoAlpha: 0, scale: 0 });

        /* Impact : onde au sol, étincelles, secousse ; flash si fort. */
        let lastImpact = 0;
        const impact = (power: number, wall = false) => {
          const now = performance.now();
          if (now - lastImpact < 60) return;
          lastImpact = now;
          const r = face.getBoundingClientRect();
          fx.current?.burst(r.left + r.width / 2, r.top + r.height / 2, Math.round(16 + power * 50), 4 + power * 7);
          gsap.fromTo(
            shake,
            { x: gsap.utils.random(-1, 1) * power * 18, y: power * 12, rotate: gsap.utils.random(-1, 1) * power * 1.5 },
            { x: 0, y: 0, rotate: 0, duration: 0.7, ease: "elastic.out(1, 0.25)", overwrite: true }
          );
          gsap.set(ring, { left: ball.style.left, top: ball.style.top });
          gsap.fromTo(
            ringInner,
            { scale: 0.2, autoAlpha: 1 },
            { scale: 2.5 + power * 4, autoAlpha: 0, duration: 0.9, ease: "expo.out", overwrite: true }
          );
          if (wall) {
            gsap.fromTo(
              backWall,
              { backgroundColor: "rgba(252,104,152,0.75)", boxShadow: "0 0 80px 10px rgba(234,51,111,0.9)" },
              { backgroundColor: "rgba(186,160,255,0.1)", boxShadow: "0 0 0 0 rgba(234,51,111,0)", duration: 1, overwrite: true }
            );
          }
          if (power >= 1) {
            gsap.fromTo(flash, { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 1.1, ease: "power2.out", overwrite: true });
          }
        };

        /* Trajectoire : x/y en % de la piste, z en fraction de sa largeur. */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 5.5}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        const go = (at: number, x: number, y: number, dur: number) =>
          tl.to([ball, shadow], { left: `${x}%`, top: `${y}%`, duration: dur }, at);
        const lift = (at: number, z: number, dur: number, ease = "power2.out") =>
          tl.to(ballZ, { z: () => cw() * z, duration: dur, ease }, at);
        const arc = (at: number, x: number, y: number, apex: number, end: number, dur: number) => {
          go(at, x, y, dur);
          lift(at, apex, dur / 2, "power2.out");
          lift(at + dur / 2, end, dur / 2, "power2.in");
        };
        const hit = (at: number, power: number, wall = false) => tl.call(() => impact(power, wall), undefined, at);

        // Caméra : la piste tourne et bascule au fil de l'échange.
        tl.fromTo(court, { "--tilt": "14deg", "--spin": "-70deg" }, { "--tilt": "56deg", "--spin": "-20deg", duration: 1, ease: "power2.out" }, 0)
          .to(court, { "--spin": "8deg", duration: 1 }, 1)
          .to(court, { "--tilt": "47deg", "--spin": "32deg", duration: 1 }, 2)
          .to(court, { "--tilt": "60deg", "--spin": "-8deg", duration: 1 }, 3)
          .to(court, { "--tilt": "40deg", "--spin": "-26deg", duration: 1 }, 4)
          .to(court, { "--tilt": "66deg", "--spin": "334deg", duration: 1, ease: "power1.inOut" }, 5);

        // Construction de la piste : lignes tracées, vitres qui montent, joueurs.
        tl.from(q(".pr-lines rect, .pr-lines line"), { drawSVG: "0%", duration: 0.5, stagger: 0.04 }, 0)
          .from(q(".pr-wall-inner"), { scaleY: 0, duration: 0.45, stagger: 0.05, ease: "back.out(2)" }, 0.25)
          .from(q(".pr-player-pop"), { scale: 0, duration: 0.3, stagger: 0.06, ease: "back.out(3)" }, 0.55)
          .from(face, { scale: 0, duration: 0.2, ease: "back.out(3)" }, 0.75)
          .to(spinner, { rotate: 360 * 14, duration: 6 }, 0);

        // 1. Service : rebond, frappe sous la taille, diagonale.
        lift(1.1, 0, 0.08, "power2.in");
        hit(1.18, 0.2);
        lift(1.18, 0.09, 0.1);
        arc(1.35, 28, 24, 0.22, 0, 0.5);
        hit(1.85, 0.5);

        // 2. La vitre : la balle file dans le fond et revient.
        go(2.1, 24, 1, 0.3);
        lift(2.1, 0.2, 0.3);
        hit(2.4, 0.8, true);
        go(2.4, 32, 16, 0.3);
        lift(2.4, 0.12, 0.3, "power1.inOut");

        // 3. Volée au filet, puis lob pour l'adversaire.
        arc(3.05, 32, 60, 0.3, 0.15, 0.35);
        hit(3.4, 0.3);
        arc(3.4, 66, 30, 0.25, 0, 0.3);
        hit(3.7, 0.4);
        go(3.7, 70, 36, 0.25);
        lift(3.7, 0.42, 0.25);

        // 4. Smash : écrasée sur la piste, la balle file hors de la cage.
        go(4.15, 42, 80, 0.18);
        lift(4.15, 0, 0.18, "power3.in");
        hit(4.33, 1.4);
        go(4.33, 46, 135, 0.4);
        lift(4.33, 0.85, 0.4);
        tl.to(sticker, { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.15, ease: "back.out(4)" }, 4.55).to(
          sticker,
          { autoAlpha: 0, scale: 0.6, duration: 0.15 },
          4.95
        );

        // 5. Jeu : la balle retombe au centre et rebondit jusqu'à l'arrêt.
        tl.set([ball, shadow], { left: "50%", top: "50%" }, 5.05).set(ballZ, { z: () => cw() * 1.4 }, 5.05);
        lift(5.05, 0, 0.25, "power2.in");
        hit(5.3, 0.6);
        lift(5.3, 0.3, 0.12);
        lift(5.42, 0, 0.12, "power2.in");
        hit(5.54, 0.3);
        lift(5.54, 0.1, 0.08);
        lift(5.62, 0, 0.08, "power2.in");
        tl.call(() => {
          if (tl.scrollTrigger?.direction === 1) fx.current?.rain(10);
        }, undefined, 5.72);

        // Textes, mot géant, score et jalons : un temps par écran.
        steps.forEach((step, i) => {
          const chars = splits[i].chars;
          const para = step.querySelector("p");
          if (i > 0) {
            tl.set(step, { autoAlpha: 1 }, i)
              .from(chars, { yPercent: 120, rotate: 12, duration: 0.2, stagger: 0.004, ease: "back.out(2)" }, i)
              .from(para, { y: 30, autoAlpha: 0, duration: 0.2 }, i + 0.08)
              .fromTo(words[i], { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out" }, i)
              .fromTo(scores[i], { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.15 }, i)
              .to(dots[i], { backgroundColor: "#fc6898", scale: 1.4, duration: 0.1 }, i);
          }
          if (i < steps.length - 1) {
            tl.to(chars, { yPercent: -120, duration: 0.15, stagger: 0.002 }, i + 0.85)
              .to(para, { autoAlpha: 0, y: -20, duration: 0.15 }, i + 0.85)
              .set(step, { autoAlpha: 0 }, i + 1)
              .to(words[i], { autoAlpha: 0, scale: 0.6, duration: 0.15 }, i + 0.85)
              .to(scores[i], { autoAlpha: 0, yPercent: -100, duration: 0.15 }, i + 0.9);
          }
        });
        tl.fromTo(q(".pr-rail-fill"), { scaleY: 0 }, { scaleY: 1, duration: 6 }, 0);

        // Ombre au sol et traînée d'étincelles derrière la balle.
        let last = { x: 0, y: 0 };
        tl.eventCallback("onUpdate", () => {
          const z = Number(gsap.getProperty(ballZ, "z")) / cw();
          gsap.set(shadow, { scale: Math.max(0.25, 1 - z), opacity: Math.max(0.15, 0.85 - z) });
          const r = face.getBoundingClientRect();
          const x = r.left + r.width / 2;
          const y = r.top + r.height / 2;
          if (Math.abs(x - last.x) + Math.abs(y - last.y) > 6) fx.current?.trail(x, y);
          last = { x, y };
        });

        // Arrivée par une ancre (/padel#tennis) : l'épinglage ajoute de la
        // hauteur après le rendu, on recale la page sur la cible.
        const hash = window.location.hash.slice(1);
        const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
        if (target && !section.contains(target)) {
          ScrollTrigger.refresh();
          // Après le défilement d'ancre du navigateur et du routeur
          const id = window.setTimeout(() => target.scrollIntoView(), 120);
          return () => {
            window.clearTimeout(id);
            splits.forEach((s) => s.revert());
          };
        }

        return () => splits.forEach((s) => s.revert());
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="regles"
      aria-labelledby="pr-title"
      className="relative overflow-clip bg-night-950 py-24 text-white motion-safe:h-[100svh] motion-safe:py-0"
    >
      <NightFx beams floaters={[]} glow="left" />

      {/* Mot géant derrière la scène */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center motion-safe:flex">
        {STEPS.map((s) => (
          <span
            key={s.word}
            className="pr-word hero-outline display absolute select-none whitespace-nowrap text-[clamp(8rem,26vw,24rem)] leading-none lg:translate-x-[18%]"
          >
            {s.word}
          </span>
        ))}
      </div>

      <div className="relative mx-auto grid h-full max-w-7xl gap-6 px-4 sm:px-6 motion-safe:grid-rows-[auto_1fr] motion-safe:pt-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:motion-safe:grid-rows-1 lg:motion-safe:pt-0">
        {/* Texte : un temps de l'échange à la fois */}
        <div className="relative lg:col-span-5">
          <p className="kicker text-rose-300">Le padel, mode d&rsquo;emploi</p>
          <h2 id="pr-title" className="display mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
            Le padel en six coups
          </h2>

          <div className="mt-6 flex gap-5 lg:mt-10">
            {/* Jalons : la barre se remplit au défilement */}
            <div aria-hidden="true" className="relative hidden w-3 shrink-0 flex-col items-center justify-between py-1 motion-safe:flex">
              <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/15" />
              <span className="pr-rail-fill absolute inset-y-1 left-1/2 w-[3px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-rose-400 to-ultra-500 shadow-[0_0_12px_rgba(234,51,111,0.9)]" />
              {STEPS.map((s, i) => (
                <span
                  key={s.word}
                  className={`pr-dot relative h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-rose-400" : "bg-night-700"}`}
                />
              ))}
            </div>

            <ol className="relative flex-1 space-y-10 motion-safe:h-[14.5rem] motion-safe:space-y-0 sm:motion-safe:h-[13rem] lg:motion-safe:h-[19rem]">
              {STEPS.map((s, i) => (
                <li key={s.word} className="pr-step motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-0">
                  <span className="font-display text-sm tracking-[0.3em] text-rose-400">
                    {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-2 text-[1.9rem] leading-[1.05] text-white sm:text-4xl lg:text-[3.4rem]">{s.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base lg:mt-5 lg:text-lg">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* La piste */}
        <div className="pr-shake relative h-full motion-reduce:h-[22rem] sm:motion-reduce:h-[26rem] lg:col-span-7 lg:motion-reduce:h-[34rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 [--cw:min(34vw,9.5rem)] [perspective:1100px] sm:[--cw:12rem] lg:[--cw:min(18vw,17.5rem)]"
          >
            <div
              className="pr-court absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              style={
                {
                  "--tilt": "56deg",
                  "--spin": "-20deg",
                  width: "var(--cw)",
                  height: "calc(var(--cw) * 2)",
                  marginLeft: "calc(var(--cw) / -2)",
                  marginTop: "calc(var(--cw) * -0.85)",
                  transform: "rotateX(var(--tilt)) rotateZ(var(--spin))",
                } as CSSProperties
              }
            >
              {/* Sol et lignes */}
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(78,33,120,0.75),rgba(10,6,16,0.9))] shadow-[0_0_120px_20px_rgba(234,51,111,0.35)]" />
              <svg
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
                className="pr-lines absolute inset-0 h-full w-full drop-shadow-[0_0_6px_rgba(252,104,152,0.9)]"
                fill="none"
                stroke="#fc6898"
                strokeWidth="1.2"
              >
                <rect x="1" y="1" width="98" height="198" />
                <line x1="1" y1="30.5" x2="99" y2="30.5" />
                <line x1="1" y1="169.5" x2="99" y2="169.5" />
                <line x1="50" y1="30.5" x2="50" y2="169.5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#a35cff" strokeWidth="2" />
              </svg>

              {/* Onde d'impact (à plat sur la piste) */}
              <div className="pr-ring absolute h-0 w-0">
                <span className="pr-ring-inner invisible absolute -left-[calc(var(--cw)*0.1)] -top-[calc(var(--cw)*0.1)] h-[calc(var(--cw)*0.2)] w-[calc(var(--cw)*0.2)] rounded-full border-2 border-rose-300 shadow-[0_0_20px_rgba(234,51,111,0.9),inset_0_0_20px_rgba(234,51,111,0.9)]" />
              </div>

              {/* Vitres de fond (4 m), côtés vitrés puis grillagés (3 m), filet */}
              <div className="absolute inset-x-0 top-0 h-[calc(var(--cw)*0.4)] origin-top [transform:rotateX(90deg)]">
                <div className="pr-wall-inner pr-wall-back h-full w-full origin-top border border-white/40 bg-[rgba(186,160,255,0.1)]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[calc(var(--cw)*0.4)] origin-bottom [transform:rotateX(-90deg)]">
                <div className="pr-wall-inner h-full w-full origin-bottom border border-white/30 bg-[rgba(186,160,255,0.06)]" />
              </div>
              <div className="absolute inset-y-0 left-0 w-[calc(var(--cw)*0.3)] origin-left [transform:rotateY(-90deg)]">
                <div className="pr-wall-inner pr-side h-full w-full origin-left border border-white/25" />
              </div>
              <div className="absolute inset-y-0 right-0 w-[calc(var(--cw)*0.3)] origin-right [transform:rotateY(90deg)]">
                <div className="pr-wall-inner pr-side h-full w-full origin-right border border-white/25" />
              </div>
              <div className="absolute inset-x-0 top-1/2 h-[calc(var(--cw)*0.09)] origin-top [transform:rotateX(90deg)]">
                <div className="pr-wall-inner pr-net h-full w-full origin-top border-t-2 border-white" />
              </div>

              {/* Joueurs */}
              {PLAYERS.map((p, i) => (
                <div
                  key={i}
                  className="absolute h-0 w-0 [transform-style:preserve-3d]"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div
                    className="absolute -left-[calc(var(--cw)*0.07)] bottom-0 h-[calc(var(--cw)*0.28)] w-[calc(var(--cw)*0.14)]"
                    style={FACE}
                  >
                    <div className="pr-player-pop h-full w-full origin-bottom">
                      <Player team={p.team} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Ombre et balle */}
              <div className="pr-shadow absolute -ml-[calc(var(--cw)*0.04)] -mt-[calc(var(--cw)*0.02)] h-[calc(var(--cw)*0.04)] w-[calc(var(--cw)*0.08)] rounded-full bg-black/70 blur-[2px]" />
              <div className="pr-ball absolute h-0 w-0 [transform-style:preserve-3d]" style={{ left: "50%", top: "50%" }}>
                <div className="pr-ball-z [transform-style:preserve-3d]">
                  <div
                    className="pr-ball-face absolute -left-[calc(var(--cw)*0.06)] bottom-0 h-[calc(var(--cw)*0.12)] w-[calc(var(--cw)*0.12)]"
                    style={FACE}
                  >
                    <div className="pr-ball-spin h-full w-full">
                      <PadelBall className="h-full w-full drop-shadow-[0_0_14px_rgba(252,104,152,1)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau de score */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 hidden rotate-2 rounded-xl border border-rose-400/40 bg-night-950/80 px-4 py-2 shadow-[0_0_40px_-10px_rgba(234,51,111,0.9)] backdrop-blur-md motion-safe:block lg:top-[12%]"
          >
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/60">TPCS · Visiteurs</p>
            <div className="relative mt-1 h-8 w-32 overflow-hidden">
              {SCORES.map((s) => (
                <span key={s} className="pr-score display absolute inset-0 text-2xl text-rose-300 [text-shadow:0_0_14px_rgba(234,51,111,0.9)]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Autocollant du smash */}
          <div
            aria-hidden="true"
            className="pr-sticker invisible absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-6 py-3 font-display text-2xl uppercase tracking-[0.15em] text-night-950 shadow-[0_20px_60px_-10px_rgba(234,51,111,1)] sm:text-4xl"
          >
            Por tres !
          </div>
        </div>
      </div>

      {/* Flash du smash */}
      <div
        aria-hidden="true"
        className="pr-flash pointer-events-none invisible absolute inset-0 z-20 bg-[radial-gradient(circle_at_60%_55%,rgba(255,255,255,0.95),rgba(252,104,152,0.8)_20%,rgba(138,43,226,0.5)_45%,transparent_75%)] opacity-0 mix-blend-screen"
      />
      <BallFx apiRef={fx} className="z-30" />
    </section>
  );
}
