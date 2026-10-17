"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/*  Calque d'effets du hero : un canvas plein cadre qui dessine des   */
/*  étincelles (traînée, explosions) et des balles de padel soumises  */
/*  à la gravité, qui rebondissent sur le sol et les bords.           */
/*  La boucle d'animation ne tourne que tant qu'il reste quelque      */
/*  chose à dessiner. Coordonnées d'entrée : celles de la fenêtre.    */
/* ------------------------------------------------------------------ */

export type FxApi = {
  /** Gerbe d'étincelles. `power` règle la vitesse d'éjection. */
  burst: (x: number, y: number, count?: number, power?: number) => void;
  /** Quelques étincelles lentes : traînée derrière un objet. */
  trail: (x: number, y: number) => void;
  /** Lance une balle qui rebondit. */
  ball: (x: number, y: number, vx?: number, vy?: number) => void;
};

const COLORS = ["#fc6898", "#ea336f", "#fda4c1", "#a35cff", "#8a2be2", "#ffffff", "#ffd1e6"];
const MAX_BALLS = 14;
const MAX_SPARKS = 900;

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  round: boolean;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  life: number;
};

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function drawBall(ctx: CanvasRenderingContext2D, b: Ball, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);
  ctx.shadowColor = "rgba(234,51,111,0.7)";
  ctx.shadowBlur = b.r * 1.2;
  const g = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.4, b.r * 0.1, 0, 0, b.r);
  g.addColorStop(0, "#ffb3d4");
  g.addColorStop(0.45, "#ea336f");
  g.addColorStop(1, "#6a1fbf");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, b.r, 0, Math.PI * 2);
  ctx.fill();
  // Coutures (même tracé que la balle SVG, ramené au rayon)
  ctx.shadowBlur = 0;
  const s = b.r / 19;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2 * s;
  ctx.lineCap = "round";
  for (const dir of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(-13 * s * dir, -15.5 * s);
    ctx.bezierCurveTo(-4 * s * dir, -8 * s, -4 * s * dir, 8 * s, -13 * s * dir, 15.5 * s);
    ctx.stroke();
  }
  ctx.restore();
}

export default function HeroFx({ apiRef }: { apiRef: RefObject<FxApi | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sparks: Spark[] = [];
    const balls: Ball[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const local = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      return [x - r.left, y - r.top] as const;
    };

    const addSpark = (x: number, y: number, speed: number, life: number, up = 0) => {
      if (sparks.length > MAX_SPARKS) sparks.shift();
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      sparks.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - up,
        life,
        max: life,
        size: 2 + Math.random() * 5,
        color: pick(COLORS),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        round: Math.random() < 0.4,
      });
    };

    const step = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vy += 0.22 * dt;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life -= dt;
        if (p.life <= 0 || p.y > h + 20) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p.life / p.max) * 1.4);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.vy += 0.55 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += (b.vx / b.r) * dt;
        b.life -= dt;
        const floor = h - b.r - 8;
        if (b.y > floor) {
          b.y = floor;
          if (b.vy > 7) for (let k = 0; k < 10; k++) addSpark(b.x, floor + b.r, 5, 30, 3);
          b.vy *= -0.74;
          b.vx *= 0.92;
          if (Math.abs(b.vy) < 1.2) b.vy = 0;
        }
        if (b.x < b.r || b.x > w - b.r) {
          b.x = Math.max(b.r, Math.min(w - b.r, b.x));
          b.vx *= -0.8;
        }
        if (b.life <= 0) {
          balls.splice(i, 1);
          continue;
        }
        drawBall(ctx, b, Math.min(1, b.life / 50));
      }

      if (sparks.length || balls.length) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        last = 0;
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    apiRef.current = {
      burst(x, y, count = 60, power = 12) {
        const [lx, ly] = local(x, y);
        for (let i = 0; i < count; i++) addSpark(lx, ly, power, 50 + Math.random() * 40, power * 0.35);
        wake();
      },
      trail(x, y) {
        const [lx, ly] = local(x, y);
        for (let i = 0; i < 3; i++) addSpark(lx, ly, 1.6, 26 + Math.random() * 16);
        wake();
      },
      ball(x, y, vx = (Math.random() - 0.5) * 14, vy = -10 - Math.random() * 8) {
        const [lx, ly] = local(x, y);
        if (balls.length >= MAX_BALLS) balls.shift();
        balls.push({ x: lx, y: ly, vx, vy, r: 14 + Math.random() * 12, rot: 0, life: 420 });
        for (let i = 0; i < 26; i++) addSpark(lx, ly, 9, 40 + Math.random() * 25, 2);
        wake();
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      apiRef.current = null;
    };
  }, [apiRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}
