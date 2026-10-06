import Link from "next/link";
import { site, getMedia } from "@/content/site";
import { Shedding } from "@/components/shedding";
import { MediaImage } from "@/components/media-image";
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
          <h1 id="hero-title">Storm Nijhuis</h1>
          <div className="hero-title-bottom">
            <span>HELLION / Selected work</span>
            <span>Silhouette. Structure. Surface.</span>
          </div>
        </div>
        <nav className="section-index" aria-label="On this page">
          <a href="#selected-work">
            <span>01</span> Selected work <span>↓</span>
          </a>
          <a href="#approach">
            <span>02</span> Approach <span>↓</span>
          </a>
          <Link href="/archive">
            <span>03</span> Archive <span>↗</span>
          </Link>
          <Link href="/about#contact">
            <span>04</span> Contact <span>↗</span>
          </Link>
        </nav>
        <div id="selected-work" className="hero-composition">
          <div className="hero-statement">
            <span className="eyebrow">01 / Selected work</span>
            <h2>HELLION</h2>
            <p>
              A study of how clothing changes the outline of the body. Dark
              silhouettes, contrasting stripes and sculptural forms bring
              structure and softness into the same frame.
            </p>
            <Link className="text-link" href="/hellion">
              Explore the work <span>↗</span>
            </Link>
            <span className="hero-side-note">
              16 photographs / Scroll down to reveal the next. Scroll up to
              return.
            </span>
          </div>
          <Shedding items={site.scrollSequence.map(getMedia)} />
        </div>
        <div className="hero-foot">
          <span>Storm Nijhuis / HELLION</span>
          <Link href="/archive">Browse every photograph ↗</Link>
        </div>
      </section>
      <section
        id="approach"
        className="manifesto"
        aria-labelledby="approach-title"
      >
        <span className="eyebrow">02 / Approach</span>
        <h2 id="approach-title">
          The body sets
          <br />
          the shape.
        </h2>
        <div className="manifesto-bottom">
          <span className="small-symbol" aria-hidden="true">
            ✦
          </span>
          <p>
            A raised collar changes a profile. A curved headpiece extends a
            silhouette. A veil changes what we see. HELLION brings these
            gestures together to explore how a garment can frame, conceal and
            reshape the body.
          </p>
          <Link className="text-link" href="/hellion">
            View the visual study ↗
          </Link>
        </div>
      </section>
      <section className="details" aria-labelledby="details-title">
        <div className="detail-large">
          <MediaImage
            item={getMedia(site.home.detail)}
            sizes="(max-width: 700px) 100vw, 60vw"
          />
          <span className="image-caption">
            Gloss / 01 <span>Profile and structure</span>
          </span>
        </div>
        <div className="detail-small">
          <span className="eyebrow">03 / Form & detail</span>
          <MediaImage
            item={getMedia(site.home.isolated)}
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
            View the archive ↗
          </Link>
        </div>
      </section>
      <section className="closing" aria-labelledby="closing-title">
        <span className="eyebrow">04 / About & contact</span>
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
          About Storm ↗
        </Link>
      </section>
    </main>
  );
}
