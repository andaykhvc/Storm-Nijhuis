import type { Metadata } from "next";
import { site, getMedia } from "@/content/site";
import { MediaImage } from "@/components/media-image";
export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Storm Nijhuis, the designer behind HELLION. Explore the work and get in touch through Instagram.",
};
export default function About() {
  return (
    <main id="main" className="about-page">
      <div className="page-intro">
        <span className="eyebrow">About / The designer</span>
        <h1 className="gothic-title">
          Storm
          <br />
          Nijhuis.
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
          <span className="eyebrow">Storm Nijhuis / HELLION</span>
          <h2>
            The work,
            <br />
            in context.
          </h2>
          {site.biography.length ? (
            site.biography.map((text) => <p key={text}>{text}</p>)
          ) : (
            <p>
              HELLION is the fashion work of Storm Nijhuis, based in Amsterdam.
              This portfolio brings together full silhouettes, editorial
              portraits and close details. Layered forms, contrasting stripes
              and extended profiles show how clothing can alter the outline of
              the body.
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
          touch.
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
