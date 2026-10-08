import Link from "next/link";
import { site, getMediaPair } from "@/content/site";
import { Shedding } from "@/components/shedding";
export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>Fashion portfolio</span>
          <span>Amsterdam / NL</span>
        </div>
        <div className="hero-title">
          <span className="eyebrow">The designer behind HELLION</span>
          <h1 id="hero-title">
            <span>Storm</span> <span>Nijhuis</span>
          </h1>
          <div className="hero-title-bottom">
            <span>HELLION / Selected work</span>
          </div>
        </div>
        <div id="selected-work" className="hero-composition">
          <div className="hero-statement">
            <h2>HELLION</h2>
            <p>
              A study of how clothing changes the outline of the body. Dark
              silhouettes, contrasting stripes and sculptural forms bring
              structure and softness into the same frame.
            </p>
            <Link className="text-link" href="/hellion">
              Explore the work
            </Link>
            <span className="hero-side-note">
              Two related photographs / Scroll down to reveal. Scroll up to
              return.
            </span>
          </div>
          <Shedding items={getMediaPair(site.photoPairs.hero)} priority />
        </div>
        <div className="hero-foot">
          <span>Storm Nijhuis / HELLION</span>
          <Link href="/archive">Browse every photograph</Link>
        </div>
      </section>
      <div className="type-interlude" aria-hidden="true">
        <div className="type-track">Body / Form / Surface</div>
        <div className="type-track type-track-outline">
          Surface / Form / Body
        </div>
      </div>
      <section
        id="approach"
        className="manifesto"
        aria-labelledby="approach-title"
      >
        <svg
          className="chapter-number"
          viewBox="0 0 600 600"
          aria-hidden="true"
        >
          <text x="0" y="480">
            II
          </text>
        </svg>
        <h2 id="approach-title">
          The body sets
          <br />
          the shape.
        </h2>
        <div className="manifesto-bottom">
          <p>
            A raised collar changes a profile. A curved headpiece extends a
            silhouette. A veil changes what we see. HELLION brings these
            gestures together to explore how a garment can frame, conceal and
            reshape the body.
          </p>
          <Link className="text-link" href="/hellion">
            View the visual study
          </Link>
        </div>
      </section>
      <section className="details" aria-labelledby="details-title">
        <div className="detail-large">
          <Shedding
            items={getMediaPair(site.photoPairs.detail)}
            sizes="(max-width: 700px) 100vw, 60vw"
          />
          <span className="image-caption">
            Glossy forms <span>Profile / reverse view</span>
          </span>
        </div>
        <div className="detail-small">
          <Shedding
            items={getMediaPair(site.photoPairs.isolated)}
            sizes="(max-width: 700px) 100vw, 30vw"
          />
          <h2 id="details-title">
            Read the
            <br />
            details.
          </h2>
          <p>
            The archive places full silhouettes alongside close views, so shape,
            texture and proportion can be seen together.
          </p>
          <Link className="text-link" href="/archive">
            View the archive
          </Link>
        </div>
      </section>
      <section className="closing" aria-labelledby="closing-title">
        <svg className="closing-seal" viewBox="0 0 600 600" aria-hidden="true">
          <text x="0" y="480">
            SN
          </text>
        </svg>
        <h2 id="closing-title">
          Storm Nijhuis.
          <br />
          Behind the work.
        </h2>
        <p>
          Learn more about HELLION or get in touch about a collaboration through
          Instagram.
        </p>
        <Link className="text-link" href="/about">
          About Storm
        </Link>
      </section>
    </main>
  );
}
