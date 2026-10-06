import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404 / Page not found</span>
      <h1>
        Page not
        <br />
        found.
      </h1>
      <Link className="text-link" href="/">
        Return to Hellion ↗
      </Link>
    </main>
  );
}
