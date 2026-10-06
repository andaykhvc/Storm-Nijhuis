"use client";
import { useHydrated } from "@/components/use-hydrated";
import { useState } from "react";
import { MediaImage } from "@/components/media-image";
import type { Media } from "@/content/site";
export function Lookbook({ items }: { items: Media[] }) {
  const ready = useHydrated();
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const item = items[index];
  function move(direction: number) {
    setIndex((index + direction + items.length) % items.length);
  }
  return (
    <section className="lookbook" aria-label="Interactive visual sequence">
      <div className="lookbook-image">
        <MediaImage
          key={item.id}
          item={item}
          sizes="(max-width: 700px) 100vw, 60vw"
        />
      </div>
      <div className="lookbook-aside">
        <span className="eyebrow">The sequence</span>
        <h2>
          Another
          <br />
          <em>skin.</em>
        </h2>
        <div className="lookbook-info" aria-live="polite">
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <h3>{item.title}</h3>
          <p>{item.caption}</p>
          {item.materials?.length ? <p>{item.materials.join(" / ")}</p> : null}
        </div>
        <div className="sequence-controls">
          <button
            disabled={!ready}
            onClick={() => move(-1)}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            disabled={!ready}
            onClick={() => move(1)}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
