import type { Metadata, Viewport } from "next";
import "@fontsource/unifrakturcook/700.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { Header } from "@/components/header";
import { Opening } from "@/components/opening";
import { Atmosphere } from "@/components/atmosphere";
import { Motion } from "@/components/motion";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
export const metadata: Metadata = {
  title: {
    default: "Storm Nijhuis — HELLION",
    template: "%s — Storm Nijhuis / HELLION",
  },
  description: site.description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Storm Nijhuis — HELLION",
    description: site.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Storm Nijhuis — HELLION",
    description: site.description,
  },
};
export const viewport: Viewport = { themeColor: "#090909" };
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
        <Opening />
        <Atmosphere />
        <Header />
        <Motion />
        {children}
        <Footer />
      </body>
    </html>
  );
}
