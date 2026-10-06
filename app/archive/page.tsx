import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { media } from "@/content/site";
export const metadata: Metadata = {
  title: "Archive",
  description:
    "The HELLION photographic archive by Storm Nijhuis. Full silhouettes, close details and editorial portraits.",
};
export default function ArchivePage() {
  return (
    <main id="main" className="archive-page">
      <div className="archive-intro">
        <span className="eyebrow">Storm Nijhuis / HELLION</span>
        <h1>
          Photographic
          <br />
          archive.
        </h1>
        <div>
          <p>
            Sixteen photographs, from full silhouettes to close details.
            <br />
            Choose a view below and open an image to look closer.
          </p>
          <span className="content-note">
            Silhouettes / Details / Editorial
          </span>
        </div>
      </div>
      <Archive items={media} />
    </main>
  );
}
