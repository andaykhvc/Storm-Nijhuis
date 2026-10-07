"use client";

import { useEffect, useRef } from "react";

const visitKey = "hellion-opening-seen";

export function Opening() {
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = curtain.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Deep links and restored scroll positions should land directly on their content.
    if (motion.matches || window.location.hash || window.scrollY > 0) return;
    try {
      if (sessionStorage.getItem(visitKey)) return;
      sessionStorage.setItem(visitKey, "1");
    } catch {
      // Storage may be disabled; the opening can still complete normally.
    }

    element.hidden = false;
    function dismiss() {
      element!.hidden = true;
      clearTimeout(timeout);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("keydown", dismiss);
      motion.removeEventListener("change", dismiss);
    }
    window.addEventListener("pointerdown", dismiss, { passive: true });
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });
    window.addEventListener("keydown", dismiss);
    motion.addEventListener("change", dismiss);
    // A bounded decorative opening, independent of image downloads or storage access.
    const timeout = setTimeout(dismiss, 2100);
    return dismiss;
  }, []);

  return (
    <div ref={curtain} className="opening" aria-hidden="true" hidden>
      <div className="opening-panel opening-top" />
      <div className="opening-panel opening-bottom" />
      <div className="opening-identity">
        <span className="opening-kicker">Amsterdam / HELLION</span>
        <span className="opening-name">Storm Nijhuis</span>
        <span className="opening-rule" />
        <span className="opening-kicker">A study in form</span>
      </div>
    </div>
  );
}
