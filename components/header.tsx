"use client";
import { useHydrated } from "@/components/use-hydrated";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
export function Header() {
  const ready = useHydrated();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <Link
        href="/"
        className="wordmark"
        aria-label="Storm Nijhuis home"
        onClick={() => setOpen(false)}
      >
        STORM NIJHUIS<span>Independent fashion / Amsterdam</span>
      </Link>
      <button
        className="menu-toggle"
        disabled={!ready}
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        className={open ? "navigation is-open" : "navigation"}
      >
        {site.navigation.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
