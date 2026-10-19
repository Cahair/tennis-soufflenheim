import PinkCall from "@/components/fx/PinkCall";
import { getCtaBand } from "@/lib/content";

/* Appel de fin des pages intérieures : le contenu vient de l'admin,
   la mise en scène de PinkCall. */
export default async function CtaBand() {
  const { title, text } = await getCtaBand();
  return <PinkCall title={title} text={text} />;
}
