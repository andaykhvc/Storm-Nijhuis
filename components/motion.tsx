"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const path = usePathname();
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    // Photo panels keep stable coordinates for their scroll-scrubbed reveal.
    const sections = document.querySelectorAll(
      ".manifesto, .closing, .collection-quote, .about-composition",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    for (const section of sections) {
      section.classList.add("motion-reveal");
      observer.observe(section);
    }
    document.documentElement.classList.add("motion-ready");
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [path]);
  return null;
}
