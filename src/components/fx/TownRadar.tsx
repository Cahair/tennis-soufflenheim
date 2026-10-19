import { PadelBall } from "@/components/landing/NightFx";

/* Cap approximatif de chaque commune vue depuis le club (degrés, 0 =
   nord, sens horaire), légèrement écarté quand deux villes se
   chevaucheraient à l'écran. Ville inconnue : cap réparti au hasard
   stable (d'après son nom). */
const BEARINGS: Record<string, number> = {
  Sessenheim: 150,
  "Rountzenheim-Auenheim": 100,
  Roeschwoog: 62,
  Drusenheim: 172,
  Kaltenhouse: 270,
  Bischwiller: 215,
  Haguenau: 295,
  Seltz: 40,
  Gambsheim: 195,
  Brumath: 252,
  Strasbourg: 205,
};

const SWEEP = 6; // secondes par tour de balayage

function bearingOf(name: string) {
  if (name in BEARINGS) return BEARINGS[name];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/* ------------------------------------------------------------------ */
/*  Radar « Venir au club » : Soufflenheim au centre, chaque commune  */
/*  placée à son cap et à une distance proportionnelle au temps de    */
/*  trajet. Le faisceau balaie en continu et chaque point s'allume    */
/*  quand il passe dessus (délai calé sur le cap). 100 % CSS.         */
/*  La liste reste lisible telle quelle pour les lecteurs d'écran.    */
/* ------------------------------------------------------------------ */
export default function TownRadar({ towns }: { towns: { name: string; time: string }[] }) {
  const max = Math.max(...towns.map((t) => parseInt(t.time, 10) || 0), 1);

  return (
    <div className="w-full">
    <div className="relative mx-auto aspect-square w-full max-w-[38rem]">
      {/* Cercles, axes et faisceau */}
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-rose-400/30 bg-[radial-gradient(circle,rgba(234,51,111,0.12),rgba(10,6,16,0.9)_70%)] shadow-[0_0_80px_-10px_rgba(234,51,111,0.5),inset_0_0_60px_rgba(138,43,226,0.25)]">
        {[0.25, 0.5, 0.75].map((r) => (
          <span
            key={r}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-rose-300/20"
            style={{ width: `${r * 100}%`, height: `${r * 100}%` }}
          />
        ))}
        <span className="absolute inset-x-0 top-1/2 h-px bg-rose-300/15" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-rose-300/15" />
        <span className="ix-radar-sweep absolute inset-0 rounded-full" style={{ animationDuration: `${SWEEP}s` }} />
        {["N", "E", "S", "O"].map((d, i) => (
          <span
            key={d}
            className="absolute font-display text-xs text-rose-300/60"
            style={{
              left: `${50 + 47 * Math.sin((i * Math.PI) / 2)}%`,
              top: `${50 - 47 * Math.cos((i * Math.PI) / 2)}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Le club, au centre */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/40" />
        <PadelBall className="relative h-full w-full drop-shadow-[0_0_16px_rgba(234,51,111,0.9)]" />
        <span className="display absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[0.65rem] tracking-[0.2em] text-white">
          Le club
        </span>
      </div>

      <ul className="absolute inset-0">
        {towns.map((town) => {
          const deg = bearingOf(town.name);
          const minutes = parseInt(town.time, 10) || max;
          const radius = 14 + (minutes / max) * 30; // % du rayon (laisse la place aux étiquettes)
          const rad = (deg * Math.PI) / 180;
          const left = 50 + radius * Math.sin(rad);
          const top = 50 - radius * Math.cos(rad);
          const labelLeft = left > 50;
          return (
            <li
              key={town.name}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                aria-hidden="true"
                className="ix-blip absolute -left-1.5 -top-1.5 block h-3 w-3 rounded-full bg-rose-400"
                style={{ animationDelay: `${(deg / 360) * SWEEP - SWEEP}s`, animationDuration: `${SWEEP}s` }}
              />
              <span
                className={`absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-white/85 sm:block ${
                  labelLeft ? "left-3" : "right-3 text-right"
                }`}
              >
                {town.name} <span className="text-rose-300">{town.time}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>

      {/* Petit écran : les étiquettes déborderaient du radar, elles
          passent en liste sous le cercle. */}
      <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:hidden">
        {towns.map((town) => (
          <li key={town.name} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/85">
            {town.name} <span className="text-rose-300">· {town.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
