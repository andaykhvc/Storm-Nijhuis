import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { media } from "@/content/site";
export const metadata: Metadata = {
  title: "Archive",
  description:
    "The HELLION visual archive. Selected photography, silhouettes, garment details and editorial imagery.",
};
export default function ArchivePage() {
  return (
    <main id="main" className="archive-page">
      <div className="archive-intro">
        <span className="eyebrow">An evolving visual index</span>
        <h1>
          The <em>archive.</em>
        </h1>
        <div>
          <p>
            Fragments of a creative world.
            <br />
            Surfaces, layers, transformations.
          </p>
          <span className="content-note">
            The HELLION image library.
            <br />A changing visual world.
          </span>
        </div>
      </div>
      <Archive items={media} />
    </main>
  );
}
