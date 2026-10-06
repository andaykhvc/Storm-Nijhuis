import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/standard-italic.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { Header } from "@/components/header";
import { Motion } from "@/components/motion";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
export const metadata: Metadata = {
  title: {
    default: "HELLION — Storm Nijhuis",
    template: "%s — Storm Nijhuis / HELLION",
  },
  description: site.description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "HELLION — Storm Nijhuis",
    description: site.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HELLION — Storm Nijhuis",
    description: site.description,
  },
};
export const viewport: Viewport = { themeColor: "#e9e6dc" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <noscript>
          <style>{`.menu-toggle{display:none!important}.navigation{display:flex!important;position:static;flex-wrap:wrap;padding:0;box-shadow:none;border:0}.site-header{flex-wrap:wrap}.motion-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <Motion />
        {children}
        <Footer />
      </body>
    </html>
  );
}
