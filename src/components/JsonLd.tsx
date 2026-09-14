/* Injecte un bloc de données structurées schema.org (JSON-LD).
   Le « < » est échappé pour empêcher toute injection de balise
   via le contenu éditable dans l'admin. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
