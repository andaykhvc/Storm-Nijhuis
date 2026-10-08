"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { FocusView } from "@/components/focus-view";
import { MediaImage } from "@/components/media-image";
import type { Media } from "@/content/site";

const initialSurface = {
  "--shed": "0%",
  "--fold-a": "0%",
  "--fold-b": "0%",
  "--fold-c": "0%",
  "--fold-d": "0%",
  "--seam-opacity": "0",
  "--outer-opacity": "1",
} as CSSProperties;

function paintSurface(
  image: HTMLDivElement,
  progress: number,
  reduced: boolean,
) {
  const fold = reduced ? 0 : Math.sin(progress * Math.PI);
  image.style.setProperty(
    "--outer-opacity",
    reduced && progress >= 0.5 ? "0" : "1",
  );
  image.style.setProperty("--shed", `${progress * 100}%`);
  image.style.setProperty("--fold-a", `${fold * 2.5}%`);
  image.style.setProperty("--fold-b", `${fold * 1.5}%`);
  image.style.setProperty("--fold-c", `${fold * 3}%`);
  image.style.setProperty("--fold-d", `${fold}%`);
  image.style.setProperty(
    "--seam-opacity",
    progress > 0 && progress < 1 ? "1" : "0",
  );
}

export function Shedding({
  items,
  priority = false,
  sizes = "(max-width: 700px) 100vw, 55vw",
}: {
  items: readonly [Media, Media];
  priority?: boolean;
  sizes?: string;
}) {
  const [labelIndex, setLabelIndex] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const label = useRef(0);

  useEffect(() => {
    const container = wrapper.current;
    const panel = sticky.current;
    const image = surface.current;
    const distance = runway.current;
    if (!container || !panel || !image || !distance) return;

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
        const nextLabel = progress >= 0.5 ? 1 : 0;
        if (nextLabel !== label.current) {
          label.current = nextLabel;
          setLabelIndex(nextLabel);
        }
        paintSurface(image!, progress, reduced);
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

  const [outer, inner] = items;

  return (
    <div
      ref={wrapper}
      className="shedding-wrap"
      style={{ "--photo-ratio": outer.width / outer.height } as CSSProperties}
    >
      <div ref={sticky} className="shed-sticky">
        <div
          ref={surface}
          className="shedding"
          style={{ ...initialSurface, aspectRatio: outer.width / outer.height }}
        >
          <div className="shed-under">
            <MediaImage
              item={inner}
              fit="contain"
              eager={priority}
              sizes={sizes}
            />
          </div>
          <div className="shed-over">
            <MediaImage
              item={outer}
              fit="contain"
              priority={priority}
              sizes={sizes}
            />
          </div>
          <span className="shed-seam" aria-hidden="true" />
        </div>
        <div className="surface-caption">
          <div className="surface-label">
            <span>{String(labelIndex + 1).padStart(2, "0")} / 02</span>
            <span>{items[labelIndex].title}</span>
          </div>
          <FocusView item={items[labelIndex]} />
        </div>
      </div>
      <div ref={runway} className="shed-runway" aria-hidden="true" />
    </div>
  );
}
