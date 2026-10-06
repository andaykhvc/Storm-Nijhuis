import Link from "next/link";
import { site, getMedia } from "@/content/site";
import { Shedding } from "@/components/shedding";
import { MediaImage } from "@/components/media-image";
export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>Independent fashion</span>
          <span>Amsterdam / NL</span>
          <span>A study in transformation</span>
        </div>
        <div className="hero-title">
          <h1 id="hero-title">
            HELLION
            <span className="title-star" aria-hidden="true">
              ∗
            </span>
          </h1>
          <div className="hero-title-bottom">
            <span>The world of Storm Nijhuis</span>
            <span>Purity / sin / skin</span>
          </div>
        </div>
        <div className="hero-composition">
          <div className="hero-statement">
            <span className="eyebrow">
              <span className="red-dot" />
              An ongoing transformation
            </span>
            <h2>
              Nothing <br />
              stays
              <br />
              <em>innocent.</em>
            </h2>
            <p>
              A surface. A tension.
              <br />A body becoming something else.
            </p>
            <Link className="text-link" href="/hellion">
              Enter Hellion <span>↗</span>
            </Link>
            <span className="hero-side-note">01 — Skin / surface / desire</span>
          </div>
          <Shedding items={site.scrollSequence.map(getMedia)} />
        </div>
        <div className="hero-foot">
          <span>Scroll to unfold ↓</span>
          <span>Selected imagery / HELLION</span>
        </div>
      </section>
      <section className="manifesto">
        <span className="eyebrow">01 / The creative world</span>
        <h2>
          Between purity
          <br />
          and <em>temptation.</em>
        </h2>
        <div className="manifesto-bottom">
          <span className="small-symbol" aria-hidden="true">
            ∗
          </span>
          <p>
            Skin remembers.
            <br />
            Layers conceal.
            <br />
            Transformation reveals.
          </p>
          <Link className="text-link" href="/hellion">
            Explore the world ↗
          </Link>
        </div>
      </section>
      <section className="details">
        <div className="detail-large">
          <MediaImage
            item={getMedia(site.home.detail)}
            sizes="(max-width: 700px) 100vw, 60vw"
          />
          <span className="image-caption">
            Gloss / 01 <span>Selected photography</span>
          </span>
        </div>
        <div className="detail-small">
          <span className="eyebrow">02 / Beneath the surface</span>
          <MediaImage
            item={getMedia(site.home.isolated)}
            sizes="(max-width: 700px) 55vw, 25vw"
          />
          <h2>
            To shed is
            <br />
            to <em>begin.</em>
          </h2>
          <Link className="text-link" href="/archive">
            View the archive ↗
          </Link>
        </div>
      </section>
      <section className="closing">
        <span className="eyebrow">Storm Nijhuis / Amsterdam</span>
        <h2>
          A new skin.
          <br />
          The same <em>desire.</em>
        </h2>
        <Link className="text-link" href="/about">
          About Storm ↗
        </Link>
      </section>
    </main>
  );
}
