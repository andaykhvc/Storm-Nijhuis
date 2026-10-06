import type { Metadata } from "next";
import { site, getMedia } from "@/content/site";
import { MediaImage } from "@/components/media-image";
export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Storm Nijhuis / HELLION. Amsterdam. A creative world exploring skin, purity, desire and transformation.",
};
export default function About() {
  return (
    <main id="main" className="about-page">
      <div className="page-intro">
        <span className="eyebrow">Behind HELLION</span>
        <h1>
          Storm
          <br />
          <em>Nijhuis.</em>
        </h1>
        <p>
          Independent fashion.
          <br />
          {site.location}.
        </p>
      </div>
      <section className="about-composition">
        <div className="about-art">
          <MediaImage item={getMedia(site.home.isolated)} />
          <span className="image-caption">
            Sculpture / 03 <span>Selected photography</span>
          </span>
        </div>
        <div>
          <span className="eyebrow">The creative world</span>
          <h2>
            Body.
            <br />
            Material.
            <br />
            <em>Becoming.</em>
          </h2>
          {site.biography.length ? (
            site.biography.map((text) => <p key={text}>{text}</p>)
          ) : (
            <p>
              HELLION explores the space between purity and sin, skin and
              shedding, temptation and desire. Reptilian forms become a language
              of layers, surface tension and transformation.
            </p>
          )}
        </div>
      </section>
      {site.press.length ? (
        <section className="press">
          <span className="eyebrow">Selected appearances</span>
          {site.press.map((entry) => (
            <a
              href={entry.href}
              key={entry.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{entry.publication}</span>
              <h3>{entry.title}</h3>
              <span>{entry.year} ↗</span>
            </a>
          ))}
        </section>
      ) : null}
      <section id="contact" className="contact">
        <span className="eyebrow">Collaborations / Editorial / Design</span>
        <h2>
          Get in
          <br />
          <em>touch.</em>
        </h2>
        {site.contactEmail ? (
          <a className="contact-email" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail} ↗
          </a>
        ) : (
          <p className="contact-note">
            For collaborations, editorial and design enquiries, find HELLION on
            Instagram.
          </p>
        )}
        <div className="social-links">
          {site.socials.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
        <span className="eyebrow">Storm Nijhuis / {site.location}</span>
      </section>
    </main>
  );
}
