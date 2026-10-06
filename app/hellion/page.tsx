import type { Metadata } from "next";
import Link from "next/link";
import { Shedding } from "@/components/shedding";
import { Lookbook } from "@/components/lookbook";
import { MediaImage } from "@/components/media-image";
import { site, getMedia } from "@/content/site";
export const metadata: Metadata = {
  title: "Hellion",
  description:
    "HELLION by Storm Nijhuis. Explore silhouettes, sculptural forms and garment details through a photographic study.",
};
export default function Hellion() {
  return (
    <main id="main" className="collection-page">
      <div className="page-intro">
        <span className="eyebrow">Selected work / Storm Nijhuis</span>
        <h1 className="gothic-title">HELLION</h1>
        <p>
          Clothing as a frame for the body.
          <br />A photographic study of form and transformation.
        </p>
      </div>
      <section className="collection-surface" aria-labelledby="surface-title">
        <div>
          <span className="eyebrow">01 / The photographic study</span>
          <h2 id="surface-title">
            Sixteen
            <br />
            points of
            <br />
            view.
          </h2>
          <p>
            Follow the same forms from portrait to full silhouette. Each
            photograph reveals a different relationship between the body and its
            outer layer.
          </p>
          <span className="content-note">
            Scroll down to reveal the next image.
            <br />
            Scroll up to return to the previous one.
          </span>
        </div>
        <Shedding items={site.scrollSequence.map(getMedia)} />
      </section>
      <section className="collection-quote" aria-labelledby="form-title">
        <span className="eyebrow">02 / Silhouette</span>
        <h2 id="form-title">
          A form changes
          <br />
          with its
          <br />
          point of view.
        </h2>
        <p>
          Front, side and back views show how volume moves around the body. The
          sequence below brings these perspectives together.
        </p>
      </section>
      <Lookbook items={site.lookbook.map(getMedia)} />
      <section className="material-section" aria-labelledby="material-title">
        <div>
          <span className="eyebrow">03 / Surface</span>
          <h2 id="material-title">
            Texture
            <br />
            in focus.
          </h2>
          <p>
            Close views show what a full silhouette can hide: a laced opening, a
            folded edge or a surface catching the light.
          </p>
        </div>
        <MediaImage item={getMedia(site.home.material)} />
      </section>
      <div className="next-page">
        <span className="eyebrow">Every photograph, at your own pace</span>
        <Link href="/archive">
          The archive <span>↗</span>
        </Link>
      </div>
    </main>
  );
}
