"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { MediaImage } from "@/components/media-image";
import type { Media } from "@/content/site";

const initialSurface = {
  "--shed": "0%",
  "--fold-a": "0%",
  "--fold-b": "0%",
  "--fold-c": "0%",
  "--fold-d": "0%",
  "--seam-opacity": "0",
} as CSSProperties;

function paintSurface(image: HTMLDivElement, progress: number) {
  const fold = Math.sin(progress * Math.PI);
  image.style.setProperty("--shed", `${progress * 100}%`);
  image.style.setProperty("--fold-a", `${fold * 2.5}%`);
  image.style.setProperty("--fold-b", `${fold * 1.5}%`);
  image.style.setProperty("--fold-c", `${fold * 3}%`);
  image.style.setProperty("--fold-d", `${fold}%`);
  image.style.setProperty(
    "--seam-opacity",
    progress > 0 && progress < 1 ? "1" : "0",
  );
  image.style.setProperty("--peel-stretch", `${1.02 + fold * 0.012}`);
}

export function Shedding({
  items,
  priority = true,
}: {
  items: Media[];
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const position = useRef({ index: 0, label: 0, progress: 0 });

  // Apply the mask after a pair changes so the previous photograph cannot flash back.
  useLayoutEffect(() => {
    if (surface.current)
      paintSurface(surface.current, position.current.progress);
  }, [index]);

  useEffect(() => {
    const container = wrapper.current;
    const panel = sticky.current;
    const image = surface.current;
    const distance = runway.current;
    if (!container || !panel || !image || !distance || items.length < 2) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    function configure() {
      dispose();
      if (!window.IntersectionObserver) return;
      const reduced = motion.matches;
      container!.classList.add("is-scroll-linked");
      let frame = 0;
      let listening = false;
      let top = 0;
      let travel = 1;

      function paint() {
        frame = 0;
        const progress = Math.max(
          0,
          Math.min(1, (top - container!.getBoundingClientRect().top) / travel),
        );
        const sequence = progress * (items.length - 1);
        const nextIndex = Math.min(
          Math.floor(sequence),
          items.length - (reduced ? 1 : 2),
        );
        const amount = reduced ? 0 : sequence - nextIndex;
        const changed = nextIndex !== position.current.index;
        const nextLabel = Math.min(
          items.length - 1,
          Math.floor(sequence + (reduced ? 0 : 0.5)),
        );
        if (nextLabel !== position.current.label) setLabelIndex(nextLabel);
        position.current = {
          index: nextIndex,
          label: nextLabel,
          progress: amount,
        };
        if (changed) setIndex(nextIndex);
        else paintSurface(image!, amount);
      }

      function schedule() {
        if (!frame) frame = window.requestAnimationFrame(paint);
      }

      function measure() {
        top = parseFloat(window.getComputedStyle(panel!).top) || 0;
        travel = Math.max(1, distance!.getBoundingClientRect().height);
        schedule();
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !listening) {
            window.addEventListener("scroll", schedule, { passive: true });
            listening = true;
          } else if (!entry.isIntersecting && listening) {
            window.removeEventListener("scroll", schedule);
            listening = false;
          }
          schedule();
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(container!);
      const resize = window.ResizeObserver ? new ResizeObserver(measure) : null;
      resize?.observe(panel!);
      resize?.observe(distance!);
      window.addEventListener("resize", measure, { passive: true });
      measure();

      dispose = () => {
        observer.disconnect();
        resize?.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", measure);
        window.cancelAnimationFrame(frame);
        container!.classList.remove("is-scroll-linked");
      };
    }

    configure();
    motion.addEventListener("change", configure);
    return () => {
      motion.removeEventListener("change", configure);
      dispose();
    };
  }, [items]);

  if (!items.length) return null;
  const outer = items[index];
  const inner = items[Math.min(index + 1, items.length - 1)];
  const upcoming = items[index + 2];

  return (
    <div
      ref={wrapper}
      className="shedding-wrap"
      style={{ "--sequence-steps": items.length - 1 } as CSSProperties}
    >
      <div ref={sticky} className="shed-sticky">
        <div ref={surface} className="shedding" style={initialSurface}>
          <div className="shed-under">
            <MediaImage
              item={inner}
              fit={inner.role === "full-look" ? "contain" : "cover"}
              eager
              sizes="(max-width: 700px) 100vw, 55vw"
            />
          </div>
          <div className="shed-over">
            <MediaImage
              item={outer}
              fit={outer.role === "full-look" ? "contain" : "cover"}
              eager
              priority={priority && index === 0}
              sizes="(max-width: 700px) 100vw, 55vw"
            />
          </div>
          <span className="shed-seam" aria-hidden="true" />
          <div className="surface-label">
            <span>
              {String(labelIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <span>{items[labelIndex].title}</span>
          </div>
        </div>
        {upcoming ? (
          <div className="shed-buffer" aria-hidden="true">
            <MediaImage
              item={upcoming}
              eager
              sizes="(max-width: 700px) 100vw, 55vw"
            />
          </div>
        ) : null}
      </div>
      <div ref={runway} className="shed-runway" aria-hidden="true" />
    </div>
  );
}
