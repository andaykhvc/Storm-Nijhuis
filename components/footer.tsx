import Link from "next/link";
import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="footer-mark">
        HELLION<span>By Storm Nijhuis</span>
      </Link>
      <p>
        Skin is a beginning.
        <br />
        Not a boundary.
      </p>
      <div className="footer-meta">
        <span>{site.location}</span>
        <Link href="/about#contact">Contact ↗</Link>
        <span>© {new Date().getFullYear()} Storm Nijhuis</span>
      </div>
    </footer>
  );
}
