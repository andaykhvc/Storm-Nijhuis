import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404 / Out of sight</span>
      <h1>
        A different
        <br />
        <em>surface.</em>
      </h1>
      <Link className="text-link" href="/">
        Return to Hellion ↗
      </Link>
    </main>
  );
}
