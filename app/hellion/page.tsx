import type { Metadata } from "next";
import Link from "next/link";
import { Shedding } from "@/components/shedding";
import { Lookbook } from "@/components/lookbook";
import { site, getMediaPair } from "@/content/site";
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
            A portrait,
            <br />
            another
            <br />
            view.
          </h2>
          <p>
            Two portraits of the same striped look. Raised sleeves frame the
            face in one image; the second reveals the silhouette around it.
          </p>
          <span className="content-note">
            Scroll down to reveal the next image.
            <br />
            Scroll up to return to the previous one.
          </span>
        </div>
        <Shedding items={getMediaPair(site.photoPairs.hero)} priority />
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
          Front and side views show how volume moves around the body. The pair
          below brings these perspectives together.
        </p>
      </section>
      <Lookbook items={getMediaPair(site.photoPairs.silhouette)} />
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
        <Shedding items={getMediaPair(site.photoPairs.material)} />
      </section>
      <div className="next-page">
        <span className="eyebrow">Every photograph, at your own pace</span>
        <Link href="/archive">The archive</Link>
      </div>
    </main>
  );
}
