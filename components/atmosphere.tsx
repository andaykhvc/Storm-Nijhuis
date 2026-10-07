"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function Atmosphere() {
  const progress = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bar = progress.current;
    if (!bar) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interlude = document.querySelector<HTMLElement>(".type-interlude");
    const panels = [...document.querySelectorAll<HTMLElement>(".shedding")];
    let frame = 0;
    let pointerFrame = 0;
    let active: HTMLElement | null = null;
    let pointerX = 50;
    let pointerY = 50;

    function paint() {
      frame = 0;
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const amount =
        distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
      bar!.style.transform = `scaleX(${amount})`;
      if (interlude && !motion.matches) {
        const rect = interlude.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const position =
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);
          interlude.style.setProperty(
            "--type-shift",
            `${(position - 0.5) * 90}px`,
          );
        }
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    function resetPointer() {
      if (active) active.removeAttribute("data-lit");
      active = null;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    }
    function pointer(event: PointerEvent) {
      if (!fine.matches || motion.matches || event.pointerType !== "mouse")
        return;
      const panel = event.currentTarget as HTMLElement;
      if (active !== panel) resetPointer();
      active = panel;
      const bounds = panel.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      if (!pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          if (!active) return;
          active.dataset.lit = "true";
          active.style.setProperty("--light-x", `${pointerX}%`);
          active.style.setProperty("--light-y", `${pointerY}%`);
        });
    }
    function preferenceChanged() {
      resetPointer();
      interlude?.style.removeProperty("--type-shift");
      schedule();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("blur", resetPointer);
    motion.addEventListener("change", preferenceChanged);
    fine.addEventListener("change", preferenceChanged);
    for (const panel of panels) {
      panel.addEventListener("pointermove", pointer, { passive: true });
      panel.addEventListener("pointerleave", resetPointer);
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("blur", resetPointer);
      motion.removeEventListener("change", preferenceChanged);
      fine.removeEventListener("change", preferenceChanged);
      for (const panel of panels) {
        panel.removeEventListener("pointermove", pointer);
        panel.removeEventListener("pointerleave", resetPointer);
      }
      resetPointer();
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
