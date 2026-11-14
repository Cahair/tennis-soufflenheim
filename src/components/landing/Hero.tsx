"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { vainqueursPadel, vueAerienne } from "@/lib/images";
import { ArrowRight } from "./Arrow";
import BallFx, { type FxApi } from "./BallFx";
import Magnetic from "./Magnetic";
import { gsap, MQ, useGSAP } from "./gsap";
import { markIntroReady, onIntro } from "./intro";

const WORD = "PADEL".split("");

/* Balles décoratives qui flottent dans le décor, à des profondeurs
   différentes (data-depth = amplitude de la parallaxe au pointeur). */
const FLOATERS = [
  { left: "5%", top: "62%", size: "2.4rem", depth: -50, blur: true },
  { left: "43%", top: "15%", size: "1.1rem", depth: 60, blur: false },
  { left: "93%", top: "16%", size: "1.7rem", depth: -70, blur: true },
  { left: "55%", top: "74%", size: "1.3rem", depth: 45, blur: false },
  { left: "24%", top: "9%", size: "0.8rem", depth: 80, blur: true },
  { left: "84%", top: "68%", size: "2.9rem", depth: -35, blur: true },
];

const centerOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
};

/* Balle de padel aux couleurs du logo (rose, couture blanche). */
function PadelBall({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffb3d4" />
          <stop offset="45%" stopColor="var(--color-rose-500)" />
          <stop offset="100%" stopColor="var(--color-ultra-600)" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${id})`} />
      <path d="M7 4.5 C 16 12, 16 28, 7 35.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M33 4.5 C 24 12, 24 28, 33 35.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero « soirée padel » — l'effet waouh assumé.                     */
/*                                                                    */
/*  Entrée (à l'ouverture du splash) : les projecteurs s'allument en  */
/*  grésillant, les lettres de « PADEL » tombent, la balle chute en   */
/*  laissant une traînée d'étincelles et SMASHE le titre : explosion  */
/*  de confettis, ondes de choc, flash, secousse d'écran. La photo    */
/*  arrive en vol plané.                                              */
/*                                                                    */
/*  Ensuite : ola régulière des lettres, néon qui grésille, balles    */
/*  qui flottent, halo et parallaxe qui suivent la souris, reflet     */
/*  holographique sur la photo et lettres en gelée au survol.         */
/*                                                                    */
/*  Rien n'est animé en mouvement réduit. Les éléments               */
/*  data-intro-hide sont masqués en CSS jusqu'à l'entrée              */
/*  (data-intro="pending"), pour éviter tout flash avant hydratation. */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, (ctx) => {
        const section = root.current!;
        const letters = q(".hero-letter") as HTMLElement[];

        // Sortie au défilement : le titre file vers le haut, la carte
        // se redresse et recule.
        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
          })
          .to(q(".hero-copy"), { yPercent: -25, autoAlpha: 0, ease: "none" }, 0)
          .to(q(".hero-card-scroll"), { yPercent: 12, rotate: 4, scale: 0.92, ease: "none" }, 0)
          .to(q(".hero-glows"), { yPercent: 20, ease: "none" }, 0)
          .to(q(".hero-cue"), { autoAlpha: 0, ease: "none", duration: 0.2 }, 0);

        // Boucles d'ambiance (halos, projecteurs, sol : grand écran
        // seulement, trop lourdes pour Safari iOS).
        if (window.matchMedia(MQ.desktop).matches) {
          gsap.to(q(".hero-glow-a"), { xPercent: 12, yPercent: -8, scale: 1.15, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(q(".hero-glow-b"), { xPercent: -10, yPercent: 10, scale: 0.9, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.fromTo(q(".hero-beam-l"), { rotate: -28 }, { rotate: 14, duration: 6.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.fromTo(q(".hero-beam-r"), { rotate: 26 }, { rotate: -16, duration: 7.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.fromTo(q(".hero-floor"), { backgroundPositionY: "0px" }, { backgroundPositionY: "80px", duration: 2.4, ease: "none", repeat: -1 });
        }
        (q(".hero-floater") as HTMLElement[]).forEach((el) => {
          gsap.to(el, {
            x: "random(-30, 30)",
            y: "random(-40, 40)",
            rotate: "random(-200, 200)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            repeatRefresh: true,
          });
        });

        // Le SMASH : la balle touche le titre.
        const impact = () => {
          const [ball] = q(".hero-ball") as HTMLElement[];
          if (!ball) return;
          const r = ball.getBoundingClientRect();
          const sr = section.getBoundingClientRect();
          const x = r.left + r.width / 2;
          const y = r.bottom;
          fx.current?.burst(x, y, 160, 17);
          gsap.set(q(".hero-shock"), { left: x - sr.left, top: y - sr.top });
          gsap.fromTo(
            q(".hero-shock"),
            { scale: 0, autoAlpha: 1 },
            { scale: (i: number) => 9 + i * 6, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }
          );
          gsap.fromTo(q(".hero-flash"), { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.7, ease: "power2.out" });
          gsap.to(q(".hero-stage"), {
            keyframes: { x: [-18, 15, -10, 7, -3, 0], y: [9, -7, 5, -2, 1, 0] },
            duration: 0.5,
            ease: "none",
          });
          // Le mot encaisse, puis chaque lettre rebondit à son tour.
          const [word] = q(".hero-word");
          gsap
            .timeline()
            .to(word, { scaleY: 0.82, scaleX: 1.06, transformOrigin: "50% 100%", duration: 0.08, ease: "power2.out" })
            .to(word, { scaleY: 1, scaleX: 1, duration: 0.9, ease: "elastic.out(1.1, 0.3)" });
          gsap.to(letters, {
            keyframes: { yPercent: [0, -18, 0] },
            duration: 0.6,
            stagger: { each: 0.05, from: "end" },
            ease: "power2.out",
          });
        };

        let alive = true;
        const play = ctx.add("play", () => {
          if (!alive) return;
          const [ball] = q(".hero-ball") as HTMLElement[];
          const [word] = q(".hero-word") as HTMLElement[];
          // Grand écran : la carte entre en vol plané ; mobile : la photo
          // de fond se dézoome simplement.
          const desktop = window.matchMedia("(min-width: 64rem)").matches;
          // La balle tombe du haut de l'écran jusqu'au-dessus du « L ».
          const drop = () => -(word?.getBoundingClientRect().top ?? 300) - 160;

          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(q(".hero-glows"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 2.2 }, 0)
            // Projecteurs : allumage qui grésille, façon stade de nuit.
            .fromTo(
              q(".hero-beam"),
              { autoAlpha: 0 },
              { keyframes: { autoAlpha: [0, 1, 0.15, 0.9, 0.3, 1] }, duration: 0.9, ease: "none", stagger: 0.15 },
              0
            )
            .fromTo(q(".hero-grid"), { autoAlpha: 0, yPercent: 20 }, { autoAlpha: 1, yPercent: 0, duration: 2 }, 0.1)
            .fromTo(
              letters,
              { yPercent: 130, rotate: (i: number) => (i % 2 ? 16 : -16), autoAlpha: 0, scale: 1.4 },
              { yPercent: 0, rotate: 0, autoAlpha: 1, scale: 1, duration: 1.1, stagger: 0.07, ease: "back.out(1.8)" },
              0.15
            )
            .fromTo(q(".hero-echo"), { autoAlpha: 0, xPercent: -8 }, { autoAlpha: 1, xPercent: 0, duration: 1.6 }, 0.5)
            .fromTo(
              ball,
              { y: drop, autoAlpha: 1, scale: 1.8 },
              {
                y: 0,
                scale: 1,
                duration: 1.3,
                ease: "bounce.out",
                onUpdate() {
                  fx.current?.trail(...centerOf(ball));
                },
              },
              0.35
            )
            // bounce.out touche le sol à 1/2,75 de sa durée.
            .call(impact, [], 0.35 + 1.3 / 2.75)
            .fromTo(
              q(".hero-card"),
              desktop
                ? { xPercent: 40, yPercent: 15, rotate: 18, autoAlpha: 0 }
                : { scale: 1.25, autoAlpha: 0 },
              desktop
                ? { xPercent: 0, yPercent: 0, rotate: -5, autoAlpha: 1, duration: 1.6 }
                : { scale: 1, autoAlpha: 1, duration: 2.2 },
              0.2
            )
            .fromTo(q(".hero-sheen"), { xPercent: -60 }, { xPercent: 30, duration: 1.6, ease: "power2.inOut" }, 1.2)
            .fromTo(q(".hero-floater"), { scale: 0 }, { scale: 1, duration: 1, stagger: 0.08, ease: "back.out(3)" }, 0.9)
            .fromTo(q(".hero-fade"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.75)
            .add(() => {
              // La balle flotte au-dessus du titre…
              gsap.to(ball, { y: -14, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
              gsap.to(ball, { rotate: 360, duration: 10, ease: "none", repeat: -1 });
              // … et les lettres font la ola toutes les quelques secondes.
              gsap
                .timeline({ repeat: -1, repeatDelay: 3.5, delay: 2 })
                .to(letters, { yPercent: -14, duration: 0.25, ease: "power2.out", stagger: 0.07 })
                .to(letters, { yPercent: 0, duration: 0.7, ease: "bounce.out", stagger: 0.07 }, 0.25);
            });
          // États de départ posés : on retire le masquage CSS.
          markIntroReady();
        });

        const stop = onIntro(() => {
          if (document.fonts.status === "loaded") play();
          else document.fonts.ready.then(() => play());
        });
        return () => {
          alive = false;
          stop();
        };
      });

      // Souris uniquement : parallaxe des calques, inclinaison 3D et
      // reflet de la carte, halo qui suit le curseur, lettres en gelée.
      mm.add(MQ.pointer, () => {
        const section = root.current!;
        const letters = q(".hero-letter") as HTMLElement[];
        const layers = (q("[data-depth]") as HTMLElement[]).map((el) => {
          const depth = Number(el.dataset.depth);
          return {
            depth,
            x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
          };
        });
        const [tilt] = q(".hero-tilt") as HTMLElement[];
        const [sheen] = q(".hero-sheen") as HTMLElement[];
        const [spot] = q(".hero-spot") as HTMLElement[];
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
        const sx = gsap.quickTo(sheen, "xPercent", { duration: 0.9, ease: "power3.out" });
        const spx = gsap.quickTo(spot, "x", { duration: 0.6, ease: "power3.out" });
        const spy = gsap.quickTo(spot, "y", { duration: 0.6, ease: "power3.out" });
        let spotOn = false;

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          }
          rx(ny * -14);
          ry(nx * 16);
          sx(-15 + nx * 70);
          const sr = section.getBoundingClientRect();
          spx(e.clientX - sr.left);
          spy(e.clientY - sr.top);
          if (!spotOn) {
            spotOn = true;
            gsap.to(spot, { autoAlpha: 1, duration: 0.8 });
          }
        };
        section.addEventListener("pointermove", onMove);

        // Lettres en gelée : chacune s'écrase au passage du curseur et
        // lâche une petite gerbe d'étincelles.
        const offs = letters.map((el) => {
          const fn = () => {
            gsap.fromTo(
              el,
              { scaleX: 1.3, scaleY: 0.7 },
              { scaleX: 1, scaleY: 1, duration: 1, ease: "elastic.out(1.2, 0.3)", overwrite: "auto" }
            );
            const r = el.getBoundingClientRect();
            fx.current?.burst(r.left + r.width / 2, r.top + r.height * 0.2, 14, 7);
          };
          el.addEventListener("pointerenter", fn);
          return () => el.removeEventListener("pointerenter", fn);
        });

        // Le bouton principal crépite au survol.
        const [cta] = q(".hero-cta") as HTMLElement[];
        const onCta = () => fx.current?.burst(...centerOf(cta), 24, 8);
        cta?.addEventListener("pointerenter", onCta);

        return () => {
          section.removeEventListener("pointermove", onMove);
          offs.forEach((off) => off());
          cta?.removeEventListener("pointerenter", onCta);
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Accueil"
      className="hero-night relative h-[100svh] min-h-[40rem] overflow-hidden bg-night-950 text-white"
    >
      <div className="hero-stage absolute inset-0">
        {/* ---------- Décor ---------- */}
        <div aria-hidden="true" className="pointer-events-none absolute -inset-8">
          <div className="hero-glows absolute inset-0" data-intro-hide>
            <div data-depth="-40" className="absolute inset-0">
              <div className="hero-glow-a absolute -left-[15%] top-[-20%] h-[75vmax] w-[75vmax] rounded-full bg-[radial-gradient(circle,rgba(234,51,111,0.55)_0%,rgba(234,51,111,0)_62%)]" />
            </div>
            <div data-depth="30" className="absolute inset-0">
              <div className="hero-glow-b absolute -right-[20%] bottom-[-35%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.55)_0%,rgba(138,43,226,0)_62%)]" />
            </div>
          </div>

          {/* Projecteurs de stade qui balaient la scène */}
          <div data-intro-hide className="hero-beam hero-beam-l absolute -top-[8%] left-[10%] h-[125%] w-[34vw] origin-top" />
          <div data-intro-hide className="hero-beam hero-beam-r absolute -top-[8%] right-[6%] h-[125%] w-[30vw] origin-top" />

          {/* Lignes de piste en perspective, qui défilent vers nous */}
          <div data-intro-hide className="hero-grid absolute inset-x-0 bottom-0 h-[55%] [perspective:600px]">
            <div className="hero-floor absolute inset-x-[-50%] bottom-[-20%] top-0 origin-bottom [transform:rotateX(62deg)]" />
          </div>

          {/* Balles qui flottent dans le décor */}
          {FLOATERS.map((f, i) => (
            <div
              key={i}
              data-depth={f.depth}
              className="absolute"
              style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
            >
              <div data-intro-hide className={`hero-floater h-full w-full ${f.blur ? "opacity-70 blur-[2px]" : "opacity-90"}`}>
                <PadelBall className="h-full w-full" />
              </div>
            </div>
          ))}

          {/* Halo qui suit le curseur */}
          <div className="hero-spot invisible absolute left-0 top-0 -ml-[22rem] -mt-[22rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(252,104,152,0.22)_0%,rgba(163,92,255,0.08)_40%,transparent_65%)] mix-blend-screen" />

          <div className="grain absolute inset-0" />
        </div>

        {/* ---------- Contenu ---------- */}
        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-28 pt-28 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-32">
          {/* Vue aérienne du club en fond voilé sur mobile ; sur grand
              écran, carte inclinée avec les vainqueurs du dernier
              tournoi de padel. */}
          <div className="hero-card-scroll absolute inset-0 lg:relative lg:inset-auto lg:order-2 lg:col-span-5 lg:mx-auto lg:w-[min(100%,26rem,calc((100svh-15rem)*0.75))]">
            <div data-depth="-18" className="h-full w-full [perspective:1000px]">
              <div className="hero-tilt relative h-full w-full [transform-style:preserve-3d]">
                <div
                  data-intro-hide
                  className="hero-card relative h-full w-full overflow-hidden lg:aspect-[3/4] lg:h-auto lg:rounded-[2rem] lg:p-[3px] lg:shadow-[0_40px_90px_-30px_rgba(234,51,111,0.65)] lg:[background:linear-gradient(140deg,var(--color-rose-400),var(--color-ultra-500))]"
                >
                  <div data-hero-media className="relative h-full w-full overflow-hidden lg:rounded-[calc(2rem-3px)]">
                    <Image
                      src={vueAerienne}
                      alt="Vue aérienne du club de Soufflenheim : halle de padel, courts de tennis et club house"
                      fill
                      preload
                      placeholder="blur"
                      sizes="100vw"
                      className="object-cover object-[38%_center] lg:hidden"
                    />
                    <Image
                      src={vainqueursPadel}
                      alt="Les vainqueurs du dernier tournoi de padel, trophées en main, avec le président du club"
                      fill
                      placeholder="blur"
                      sizes="28rem"
                      className="hidden object-cover lg:block"
                    />
                    {/* Mobile : la photo passe en fond, voilée de nuit et de rose */}
                    <div className="absolute inset-0 bg-gradient-to-b from-night-950/85 via-night-950/70 to-night-950/95 lg:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/45 via-transparent to-ultra-600/40 mix-blend-color lg:hidden" />
                    {/* Grand écran : reflet rose en pied de carte et
                        reflet holographique qui suit l'inclinaison */}
                    <div className="absolute inset-x-0 bottom-0 hidden h-2/5 bg-gradient-to-t from-night-950/90 via-night-950/40 to-transparent lg:block" />
                    <p className="absolute inset-x-0 bottom-0 hidden p-6 lg:block">
                      <span className="kicker text-rose-300">Tournoi de padel</span>
                      <span className="display mt-2 block text-2xl leading-tight text-white">
                        Vainqueurs du dernier tournoi de padel
                      </span>
                    </p>
                    <div className="hero-sheen pointer-events-none absolute inset-y-0 -left-full hidden w-[300%] lg:block" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Texte. Le lieu fait partie du titre principal : c'est lui qui
              rattache l'accueil aux recherches locales (« padel
              Soufflenheim », « padel Alsace du Nord »). */}
          <div className="hero-copy relative lg:order-1 lg:col-span-7">
            <h1>
              <span
                data-intro-hide
                className="hero-fade inline-flex items-center gap-3 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-rose-300 backdrop-blur-sm sm:text-xs"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
                Soufflenheim · Alsace du Nord
              </span>

              <span className="relative mt-6 block">
                {/* Écho en contour, décalé derrière le titre */}
                <span
                  aria-hidden="true"
                  data-depth="26"
                  data-intro-hide
                  className="hero-echo hero-outline hero-big display pointer-events-none absolute left-[0.08em] top-[0.08em] block select-none leading-[0.82] tracking-tight"
                >
                  PADEL
                </span>

                <span
                  data-depth="10"
                  className="hero-word hero-big display relative block whitespace-nowrap leading-[0.82] tracking-tight"
                >
                  <span className="sr-only">Padel</span>
                  <span aria-hidden="true" className="relative inline-flex">
                    {/* La balle, qui smashe puis flotte au-dessus du « L » */}
                    <span
                      data-intro-hide
                      className="hero-ball absolute -right-[0.06em] top-[0.02em] z-10 block h-[0.3em] w-[0.3em] drop-shadow-[0_10px_25px_rgba(234,51,111,0.6)]"
                    >
                      <PadelBall className="h-full w-full" />
                    </span>
                    {/* Chaque lettre prend sa tranche du dégradé */}
                    {WORD.map((letter, i) => (
                      <span
                        key={i}
                        data-intro-hide
                        className="hero-letter hero-gradient-text inline-block"
                        style={{ backgroundPosition: `${(i / (WORD.length - 1)) * 100}% 50%` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </span>
              </span>

              <span
                data-intro-hide
                className="hero-fade display mt-3 block text-[clamp(1.7rem,4.6vw,3.4rem)] leading-[0.95] text-white"
              >
                à Soufflenheim, <span className="hero-neon text-rose-400">ça claque&nbsp;!</span>
              </span>
            </h1>

            <p
              data-intro-hide
              className="hero-fade mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg"
            >
              Nos pistes de padel couvertes vous attendent&nbsp;: à 4, entre amis, toute l&apos;année. Et
              toujours le tennis et le pickleball, depuis 1979.
            </p>

            <div
              data-intro-hide
              className="hero-fade mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Magnetic>
                <Link href="/padel" className="hero-cta btn btn-rose">
                  Découvrir le padel
                  <ArrowRight />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/le-club" className="btn btn-outline-light">
                  Le club
                </Link>
              </Magnetic>
            </div>

            {/* Mobile : la carte des vainqueurs devient une vignette */}
            <figure
              data-intro-hide
              className="hero-fade mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-night-950/60 p-3 pr-5 backdrop-blur-sm lg:hidden"
            >
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={vainqueursPadel} alt="" fill sizes="3rem" className="object-cover" />
              </span>
              <figcaption className="text-sm font-semibold leading-snug text-white">
                Vainqueurs du dernier tournoi de padel
              </figcaption>
            </figure>
          </div>
        </div>

        {/* ---------- Invitation à défiler ---------- */}
        <div className="hero-cue absolute bottom-32 right-6 z-10 hidden sm:block lg:bottom-36 lg:right-8">
          <a
            href="#club"
            data-intro-hide
            className="hero-fade flex flex-col items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/60 transition-colors [writing-mode:vertical-rl] hover:text-rose-300"
          >
            Défiler
            <span className="relative block h-12 w-px overflow-hidden bg-white/20">
              <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-rose-400" />
            </span>
          </a>
        </div>

        {/* Ondes de choc de l'impact */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="hero-shock pointer-events-none invisible absolute z-30 -ml-8 -mt-8 h-16 w-16 rounded-full border-2 border-rose-300 shadow-[0_0_30px_rgba(234,51,111,0.8),inset_0_0_20px_rgba(234,51,111,0.6)]"
          />
        ))}
      </div>

      {/* Flash de l'impact et calque de particules (hors secousse) */}
      <div
        aria-hidden="true"
        className="hero-flash pointer-events-none invisible absolute inset-0 z-30 bg-[radial-gradient(circle_at_30%_45%,#fff_0%,rgba(253,164,193,0.8)_30%,rgba(234,51,111,0)_70%)] mix-blend-screen"
      />
      <BallFx apiRef={fx} />
    </section>
  );
}
