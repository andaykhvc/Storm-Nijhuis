import { Shedding } from "@/components/shedding";
import type { Media } from "@/content/site";

export function Lookbook({ items }: { items: Media[] }) {
  if (!items.length) return null;
  return (
    <section
      className="lookbook"
      aria-label="Scroll through the visual sequence"
    >
      <Shedding items={items} priority={false} />
      <div className="lookbook-aside">
        <span className="eyebrow">The sequence</span>
        <h2>
          Another
          <br />
          <em>skin.</em>
        </h2>
        <p>
          Scroll down to move forward.
          <br />
          Scroll up to return.
        </p>
      </div>
    </section>
  );
}
