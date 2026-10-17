"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import BallFx, { drawBall, type FxApi } from "@/components/landing/BallFx";

const BEST_KEY = "tpcs-jongle-record";
const MOTION = "(prefers-reduced-motion: no-preference)";

/* Préférence de mouvement, suivie en direct. */
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const motionOk = () => window.matchMedia(MOTION).matches;

/* Record enregistré dans le navigateur (0 si stockage indisponible). */
const noSubscribe = () => () => {};
function storedBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/*  Mini-jeu de la page 404 : « gardez la balle en l'air ».           */
/*  Toucher (ou cliquer) la balle la renvoie vers le haut, de travers */
/*  selon l'endroit touché ; elle accélère un peu à chaque jongle.    */
/*  Si elle tombe : « Raté ! », le compteur repart à zéro et une      */
/*  nouvelle balle est servie. Le record reste dans le navigateur.    */
/*  Rien n'est affiché en mouvement réduit : la page reste statique.  */
/* ------------------------------------------------------------------ */
export default function JuggleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fx = useRef<FxApi | null>(null);
  const enabled = useSyncExternalStore(subscribeMotion, motionOk, () => false);
  const saved = useSyncExternalStore(noSubscribe, storedBest, () => 0);
  const [score, setScore] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [out, setOut] = useState(false);
  const best = Math.max(saved, sessionBest);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let hits = 0;
    let respawn = 0;
    const ball = { x: 0, y: -60, vx: 0, vy: 0, r: 32, rot: 0, live: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ball.r = w < 640 ? 28 : 34;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const serve = () => {
      ball.x = w * (0.3 + Math.random() * 0.4);
      ball.y = -ball.r;
      ball.vx = (Math.random() - 0.5) * 3;
      ball.vy = 1;
      ball.live = true;
    };
    respawn = window.setTimeout(serve, 700);

    const step = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);

      if (ball.live) {
        ball.vy += 0.42 * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.rot += (ball.vx / ball.r) * dt;
        if (ball.x < ball.r || ball.x > w - ball.r) {
          ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x));
          ball.vx *= -0.85;
        }
        if (ball.y - ball.r > h) {
          // Balle tombée : « Raté ! » si une série était en cours.
          ball.live = false;
          if (hits > 0) {
            setOut(true);
            window.setTimeout(() => setOut(false), 1100);
          }
          hits = 0;
          setScore(0);
          respawn = window.setTimeout(serve, 900);
        }

        // Ombre au sol, plus nette quand la balle descend
        const k = Math.max(0, Math.min(1, ball.y / h));
        ctx.save();
        ctx.globalAlpha = 0.15 + k * 0.3;
        ctx.fillStyle = "#ea336f";
        ctx.beginPath();
        ctx.ellipse(ball.x, h - 14, ball.r * (0.5 + k * 0.6), ball.r * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        drawBall(ctx, ball, 1, "rose");
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Un toucher près de la balle la renvoie : plus on la touche sur
    // le côté, plus elle part de travers.
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button") || !ball.live) return;
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const dx = ball.x - px;
      if (Math.hypot(dx, ball.y - py) > ball.r * 1.7) return;
      hits += 1;
      ball.vy = -(12 + Math.min(hits, 15) * 0.25);
      ball.vx = (dx / ball.r) * 6 + (Math.random() - 0.5) * 2;
      fx.current?.burst(e.clientX, e.clientY, 22 + Math.min(hits, 20) * 2, 9);
      setScore(hits);
      setSessionBest((b) => Math.max(b, hits));
      if (hits > storedBest()) {
        try {
          localStorage.setItem(BEST_KEY, String(hits));
        } catch {
          /* stockage indisponible : record non conservé */
        }
      }
    };
    const host = canvas.parentElement!;
    host.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(respawn);
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <BallFx apiRef={fx} className="z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 z-20 flex flex-col items-center gap-2 px-4 sm:top-10"
      >
        <p className="rounded-full border border-rose-400/40 bg-night-950/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-300 backdrop-blur-sm">
          Jongles <span className="font-display text-lg tabular-nums text-white">{score}</span>
          <span className="mx-3 text-white/30">·</span>
          Record <span className="font-display text-lg tabular-nums text-white">{best}</span>
        </p>
        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50">
          Touchez la balle pour la garder en l&apos;air
        </p>
      </div>
      {out ? (
        <p
          aria-hidden="true"
          className="juggle-out display pointer-events-none absolute inset-x-0 top-1/3 z-20 text-center text-6xl text-rose-400 sm:text-8xl"
        >
          Raté&nbsp;!
        </p>
      ) : null}
    </>
  );
}
