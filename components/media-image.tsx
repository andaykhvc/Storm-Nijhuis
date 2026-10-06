import type { CSSProperties } from "react";
import Image from "next/image";
import type { Media } from "@/content/site";
export function MediaImage({
  item,
  priority = false,
  eager = false,
  fit,
  sizes = "(max-width: 700px) 100vw, 60vw",
  className = "",
}: {
  item: Media;
  priority?: boolean;
  eager?: boolean;
  fit?: CSSProperties["objectFit"];
  sizes?: string;
  className?: string;
}) {
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      quality={90}
      sizes={sizes}
      preload={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      unoptimized={item.src.endsWith(".svg")}
      className={className}
      style={{ objectPosition: item.position || "center", objectFit: fit }}
    />
  );
}
