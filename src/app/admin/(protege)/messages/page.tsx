import { requireAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/content";
import { deleteMessage } from "@/lib/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await getMessages();

  return (
    <div>
      <h1 className="display text-3xl text-night-950">Messages reçus</h1>
      <p className="mt-2 max-w-2xl text-sm text-night-950/60">
        Les demandes envoyées via le formulaire de contact du site. Pensez à
        répondre par e-mail, puis supprimez le message une fois traité.
      </p>

      {messages.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-night-300 bg-white p-10 text-center text-sm text-night-950/50">
          Aucun message pour l&rsquo;instant.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-3xl border border-night-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-night-950">
                    {m.name}
                    <span className="ml-2 rounded-full bg-night-50 px-2.5 py-0.5 text-xs font-semibold text-night-800">
                      {m.subject || "Sans sujet"}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-night-950/50">
                    {dateFormat.format(new Date(m.date))} ·{" "}
                    <a href={`mailto:${m.email}`} className="font-semibold text-rose-600 hover:underline">
                      {m.email}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re : ${m.subject || "votre message au TPCS"}`)}`}
                    className="rounded-full border border-night-300 px-4 py-2 text-sm font-semibold text-night-800 transition-colors hover:bg-night-50"
                  >
                    Répondre
                  </a>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <ConfirmButton
                      message={`Supprimer le message de ${m.name} ?`}
                      className="rounded-full px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-600/10"
                    >
                      Supprimer
                    </ConfirmButton>
                  </form>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-night-950/75">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
