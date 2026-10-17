export default function SectionHeader({
  kicker,
  title,
  text,
  align = "center",
  tone = "dark",
}: {
  kicker: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const alignClass =
    align === "center" ? "mx-auto text-center items-center" : "items-start";
  const kickerColor = tone === "dark" ? "text-rose-600" : "text-rose-400";
  const titleColor = tone === "dark" ? "text-night-950" : "text-white";
  const textColor = tone === "dark" ? "text-night-950/65" : "text-white/70";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}>
      <span className={`kicker ${kickerColor}`}>{kicker}</span>
      <h2 className={`display text-4xl sm:text-5xl ${titleColor}`}>{title}</h2>
      {text ? (
        <p className={`text-base leading-relaxed sm:text-lg ${textColor}`}>
          {text}
        </p>
      ) : null}
    </div>
  );
}
