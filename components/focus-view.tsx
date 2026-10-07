"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MediaImage } from "@/components/media-image";
import { useHydrated } from "@/components/use-hydrated";
import type { Media } from "@/content/site";

function FocusDialog({ item, close }: { item: Media; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function dismiss() {
    dialog.current?.close();
    close();
  }

  return (
    <dialog
      ref={dialog}
      className="focus-view"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
    >
      <div className="focus-top">
        <span className="eyebrow">HELLION / Focus study</span>
        <button className="focus-control" onClick={dismiss}>
          Close ×
        </button>
      </div>
      <div className="focus-stage">
        <div className="focus-canvas">
          <MediaImage item={item} eager sizes="100vw" />
        </div>
        <span className="focus-shutter" aria-hidden="true" />
      </div>
      <div className="focus-bottom">
        <div>
          <h2 id={titleId}>{item.title}</h2>
          {item.caption ? <p>{item.caption}</p> : null}
        </div>
      </div>
    </dialog>
  );
}

export function FocusView({ item }: { item: Media }) {
  const ready = useHydrated();
  const opener = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<Media | null>(null);

  function close() {
    setSelected(null);
    opener.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <button
        ref={opener}
        className="focus-launch"
        disabled={!ready}
        aria-label={`Open focus view of ${item.title}`}
        aria-haspopup="dialog"
        onClick={() => setSelected(item)}
      >
        <span aria-hidden="true">⤢</span> Focus
      </button>
      {selected ? <FocusDialog item={selected} close={close} /> : null}
    </>
  );
}
