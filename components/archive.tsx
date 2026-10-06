"use client";
import { useHydrated } from "@/components/use-hydrated";
import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/media-image";
import type { Media } from "@/content/site";
type Filter = "all" | "full-look" | "detail" | "editorial";
export function Archive({ items }: { items: Media[] }) {
  const ready = useHydrated();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const filtered = items.filter(
    (item) => filter === "all" || item.role === filter,
  );
  const active = filtered.find((item) => item.id === selected);
  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  function move(direction: number) {
    const index = filtered.findIndex((item) => item.id === selected);
    setSelected(
      filtered[(index + direction + filtered.length) % filtered.length].id,
    );
  }
  return (
    <>
      <div className="archive-toolbar">
        <div className="archive-filters" aria-label="Filter archive">
          {(
            [
              ["all", "All"],
              ["full-look", "Silhouettes"],
              ["detail", "Details"],
              ["editorial", "Editorial"],
            ] as const
          ).map(([value, label]) => (
            <button
              disabled={!ready}
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="eyebrow" aria-live="polite">
          {String(filtered.length).padStart(2, "0")} entries
        </span>
      </div>
      {filtered.length ? (
        <div className="archive-grid">
          {filtered.map((item, i) => (
            <button
              className="archive-entry"
              disabled={!ready}
              key={item.id}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setSelected(item.id);
              }}
              aria-label={`View ${item.title}`}
            >
              <div className="archive-image">
                <MediaImage
                  item={item}
                  sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 33vw"
                />
                <span className="view-label">View ↗</span>
              </div>
              <span className="archive-caption">
                <span>{item.title}</span>
                <span>
                  {item.kind === "digital-study"
                    ? "Digital study"
                    : item.year || "Photography"}
                </span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="archive-empty">
          <span className="eyebrow">The photographic archive</span>
          <h2>
            No photographs
            <br />
            in this view.
          </h2>
          <p>There are no images in this selection yet.</p>
          <button className="text-link" onClick={() => setFilter("all")}>
            View all images ↗
          </button>
        </div>
      )}
      {/* Native modal dialog handles backdrop clicks and bubbled keyboard navigation. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialog}
        className="viewer"
        onCancel={() => setSelected(null)}
        onClose={() => {
          setSelected(null);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
        aria-label="Archive image viewer"
      >
        <button className="viewer-close" onClick={() => setSelected(null)}>
          Close ×
        </button>
        {active ? (
          <>
            <div className="viewer-image">
              <MediaImage item={active} sizes="90vw" />
            </div>
            <div className="viewer-bottom">
              <button
                aria-label="Previous archive image"
                onClick={() => move(-1)}
              >
                ←
              </button>
              <div aria-live="polite">
                <h2>{active.title}</h2>
                <p>{active.caption}</p>
              </div>
              <button aria-label="Next archive image" onClick={() => move(1)}>
                →
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
