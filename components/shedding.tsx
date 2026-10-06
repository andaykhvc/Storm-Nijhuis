"use client";
import { useHydrated } from "@/components/use-hydrated";
import { useState } from "react";
import type { CSSProperties } from "react";
import { MediaImage } from "@/components/media-image";
import type { Media } from "@/content/site";
export function Shedding({ outer, inner }: { outer: Media; inner: Media }) {
  const ready = useHydrated();
  const [amount, setAmount] = useState(0);
  return (
    <div className="shedding-wrap">
      <div
        className="shedding"
        style={
          {
            "--shed": `${amount}%`,
            "--fold-a": `${amount > 0 && amount < 100 ? 2.5 : 0}%`,
            "--fold-b": `${amount > 0 && amount < 100 ? 1.5 : 0}%`,
            "--fold-c": `${amount > 0 && amount < 100 ? 3 : 0}%`,
            "--fold-d": `${amount > 0 && amount < 100 ? 1 : 0}%`,
          } as CSSProperties
        }
      >
        <div className="shed-under">
          <MediaImage item={inner} sizes="(max-width: 700px) 100vw, 55vw" />
        </div>
        <div className="shed-over">
          <MediaImage
            item={outer}
            priority
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </div>
        {amount > 0 && amount < 100 ? (
          <span className="shed-seam" aria-hidden="true" />
        ) : null}
        <div className="surface-label">
          <span>H / 01</span>
          <span>Skin / surface / desire</span>
        </div>
      </div>
      <div className="shed-controls">
        <label htmlFor="shed-range">
          Shed the surface <span aria-hidden="true">⟷</span>
        </label>
        <input
          id="shed-range"
          type="range"
          disabled={!ready}
          min="0"
          max="100"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          aria-valuetext={`${amount} percent of the inner surface revealed`}
        />
        <button
          disabled={!ready}
          onClick={() => setAmount(amount < 50 ? 100 : 0)}
          aria-label={
            amount < 50 ? "Reveal inner surface" : "Restore outer surface"
          }
        >
          {amount < 50 ? "Reveal +" : "Return −"}
        </button>
      </div>
    </div>
  );
}
