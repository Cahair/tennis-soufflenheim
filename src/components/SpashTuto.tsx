import SectionHeader from "@/components/SectionHeader";
import NightFx from "@/components/landing/NightFx";

/* Tutoriel vidéo Spash (page /video-match) : comment récupérer la vidéo
   de son match.
   Vidéo verticale (format téléphone) servie depuis public/videos, chargée
   seulement au clic (preload="none") ; les étapes sont reprises en texte
   à côté pour qui ne lance pas la vidéo. */
const STEPS = [
  {
    title: "Téléchargez l'appli",
    text: "Cherchez « Spash » sur l'App Store ou Google Play, puis installez-la.",
  },
  {
    title: "Créez votre compte",
    text: "Onglet « Inscription » : e-mail, pseudo et mot de passe, puis validez le mail reçu.",
  },
  {
    title: "Choisissez votre club",
    text: "Tapez le nom du club dans la recherche et sélectionnez-le.",
  },
  {
    title: "Retrouvez vos matchs",
    text: "Toutes vos sessions vidéo apparaissent dans « Mon activité », prêtes à être revues et partagées.",
  },
];

export default function SpashTuto() {
  return (
    <section className="relative overflow-clip bg-night-950 py-28 text-white">
      <NightFx glow="right" floaters={[]} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <SectionHeader
            align="left"
            kicker="Le tutoriel"
            title="Quatre étapes, c'est parti"
            text="Installez l'application une fois : ensuite, toutes les vidéos de vos matchs vous attendent sur votre téléphone."
          />
          <ol className="mt-10 space-y-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="display flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-500 text-lg text-night-950">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wide text-white">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-white/75">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex justify-center lg:col-span-5 lg:col-start-8">
          <div className="w-full max-w-[20rem] rounded-[2.5rem] border border-white/15 bg-night-900 p-2.5 shadow-[0_40px_90px_-30px_rgba(234,51,111,0.8)]">
            <video
              controls
              playsInline
              preload="none"
              poster="/videos/tuto-spash-poster.webp"
              width={1080}
              height={1920}
              className="aspect-[9/16] h-auto w-full rounded-[2rem] bg-night-950 object-cover"
              aria-label="Tutoriel : enregistrer et retrouver la vidéo de son match avec l'application Spash"
            >
              <source src="/videos/tuto-spash.mp4" type="video/mp4" />
              <a href="/videos/tuto-spash.mp4" className="text-rose-300 underline">
                Télécharger le tutoriel vidéo
              </a>
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
