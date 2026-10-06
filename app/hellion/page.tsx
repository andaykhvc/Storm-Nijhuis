import type { Metadata } from "next";
import Link from "next/link";
import { Shedding } from "@/components/shedding";
import { Lookbook } from "@/components/lookbook";
import { MediaImage } from "@/components/media-image";
import { site, getMedia } from "@/content/site";
export const metadata: Metadata = {
  title: "Hellion",
  description:
    "Explore the creative world of HELLION: skin, surface, purity and transformation.",
};
export default function Hellion() {
  return (
    <main id="main" className="collection-page">
      <div className="page-intro">
        <span className="eyebrow">The creative world / HELLION</span>
        <h1>
          Original
          <br />
          <em>sin.</em>
        </h1>
        <p>
          Purity and desire.
          <br />A tension held at the surface.
        </p>
      </div>
      <div className="collection-surface">
        <div>
          <span className="eyebrow">01 / Skin</span>
          <h2>
            A layer
            <br />
            between
            <br />
            <em>worlds.</em>
          </h2>
          <p>Scroll to reveal what lies beneath.</p>
          <span className="content-note">
            Skin, surface and transformation.
            <br />
            Selected HELLION imagery.
          </span>
        </div>
        <Shedding items={site.scrollSequence.map(getMedia)} />
      </div>
      <div className="collection-quote">
        <span className="eyebrow">02 / Transformation</span>
        <h2>
          What we shed
          <br />
          is also what
          <br />
          we <em>become.</em>
        </h2>
      </div>
      <Lookbook items={site.lookbook.map(getMedia)} />
      <section className="material-section">
        <div>
          <span className="eyebrow">03 / Surface tension</span>
          <h2>
            Closer
            <br />
            to the <em>skin.</em>
          </h2>
          <p>
            A visual language of layers, tension
            <br />
            and organic deformation.
          </p>
        </div>
        <MediaImage item={getMedia(site.home.material)} />
      </section>
      <div className="next-page">
        <span className="eyebrow">Continue exploring</span>
        <Link href="/archive">
          The archive <span>↗</span>
        </Link>
      </div>
    </main>
  );
}
