import { Shedding } from "@/components/shedding";
import type { Media } from "@/content/site";
export function Lookbook({ items }: { items: readonly [Media, Media] }) {
  return (
    <section
      className="lookbook"
      aria-label="Scroll through the visual sequence"
    >
      <Shedding items={items} priority={false} />
      <div className="lookbook-aside">
        <span className="eyebrow">The silhouette pair</span>
        <h2>
          Shape.
          <br />
          Volume.
          <br />
          Proportion.
        </h2>
        <p>
          Front and side views of the same silhouette.
          <br />
          Scroll down to move forward.
          <br />
          Scroll up to return.
        </p>
      </div>
    </section>
  );
}
