import Image from "next/image";
import type { ImageRef } from "@/lib/content-types";

/* Photo d'un cadre à hauteur fixe (à placer dans un parent `relative`).
   Paysage : elle remplit le cadre, comme avant. Portrait (photo de
   téléphone, affiche) : elle est montrée en entier, sur un fond flou
   tiré de sa propre miniature, au lieu d'être rognée en haut et en bas. */
export default function FitImage({
  image,
  alt,
  sizes,
  preload,
  className = "",
}: {
  image: ImageRef;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const portrait = image.height > image.width * 1.05;

  return (
    <>
      {portrait ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 scale-125 bg-night-900 bg-cover bg-center blur-2xl"
          style={image.blurDataURL ? { backgroundImage: `url("${image.blurDataURL}")` } : undefined}
        />
      ) : null}
      <Image
        src={image}
        alt={alt}
        fill
        preload={preload}
        placeholder={image.blurDataURL && !portrait ? "blur" : "empty"}
        sizes={sizes}
        className={`${portrait ? "object-contain" : "object-cover"} ${className}`}
      />
    </>
  );
}
