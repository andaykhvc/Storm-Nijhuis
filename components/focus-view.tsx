"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MediaImage } from "@/components/media-image";
import { useHydrated } from "@/components/use-hydrated";
import type { Media } from "@/content/site";

function FocusDialog({ item, close }: { item: Media; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [detail, setDetail] = useState(false);

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

  function changeScale(next: boolean) {
    setDetail(next);
    // Return to the top-left when changing scale; native scrolling works on touch and keyboard.
    stage.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
      <div
        ref={stage}
        className="focus-stage"
        data-detail={detail}
        role="region"
        aria-label="Photograph; scroll to explore when detail view is selected"
        // The scrollable image region must be reachable for keyboard panning.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div className="focus-canvas">
          <MediaImage item={item} eager sizes={detail ? "200vw" : "100vw"} />
        </div>
        <span className="focus-shutter" aria-hidden="true" />
      </div>
      <div className="focus-bottom">
        <div>
          <h2 id={titleId}>{item.title}</h2>
          <p>
            {detail ? "Scroll or swipe to explore the details." : item.caption}
          </p>
        </div>
        <div className="focus-scales" aria-label="Photograph scale">
          <button
            className="focus-control"
            aria-pressed={!detail}
            onClick={() => changeScale(false)}
          >
            Fit
          </button>
          <button
            className="focus-control"
            aria-pressed={detail}
            onClick={() => changeScale(true)}
          >
            Detail +
          </button>
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
