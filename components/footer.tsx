import Link from "next/link";
import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="footer-mark">
        Storm Nijhuis<span>HELLION / Fashion portfolio</span>
      </Link>
      <p>
        Selected silhouettes, portraits
        <br />
        and details from HELLION.
      </p>
      <div className="footer-meta">
        <span>{site.location}</span>
        <Link href="/about#contact">Contact ↗</Link>
        <span>© {new Date().getFullYear()} Storm Nijhuis</span>
      </div>
    </footer>
  );
}
