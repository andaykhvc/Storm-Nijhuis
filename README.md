# Storm Nijhuis / HELLION

An editorial fashion portfolio built with Next.js App Router, React and TypeScript. The visual language is predominantly black with white typography: a bold, locally served blackletter nameplate, strong sans-serif text and photographs in their supplied colours. The copy describes visible forms and how to browse the work. Fonts are served locally. Interface labels use plain text without emoji or decorative icon glyphs. There are no trackers, accounts, database or commerce dependencies.

## Run locally

Node.js 22.18 or later (24 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production:

```sh
npm run build
npm start
```

## Experiences

- `/`: Storm Nijhuis nameplate, descriptive section headings and direct links to the work, archive and about page, without a repeated subsection index or numbered labels. A tactile, organic seam reveals the next photograph. Each of the three image panels contains exactly two related photographs. Scroll down to reveal the second image from top to bottom through the organic seam; scroll up to reverse the reveal. Each panel stays in view for its own short transition. Reduced motion switches between the same two images without peeling or distortion.
- Paired photographs include a Focus control for the currently revealed image. A vertical shutter opens an immersive native dialog with the complete photograph fitted to the screen. Keyboard Escape restores focus to the exact opener.
- `/hellion`: collection story, paired portraits, a front/side silhouette pair and paired texture details.
- `/archive`: all 16 unique supplied photographs, grouped by silhouettes, details and editorial compositions. Switch between the editorial grid and a numbered contact sheet with a short vertical exposure animation. Both layouts retain the current filter and native modal viewer, which supports arrows, Escape, focus restoration and touch controls.
- `/about`: supplied creative-world text, Amsterdam location and the verified Instagram link. Biography, email and selected press remain optional until supplied.

Responsive compositions are tailored for mobile. Scroll reveals use IntersectionObserver; the shedding mask follows scroll position through a passive listener and event-driven animation frames, active only near the image. A two-shutter opening plays once per tab, completes in 2.1 seconds and dismisses immediately on interaction. Deep links, restored scroll positions and reduced-motion visitors bypass it; content remains available with JavaScript disabled. A scroll progress line, moving typographic interlude and mouse-following photographic light add atmosphere without changing the palette or fonts. There are no perpetual animation loops or animation libraries. All effects respect reduced-motion preferences. Navigation and the viewer have keyboard access; ordinary keyboard scrolling also drives the image transition. If JavaScript is disabled, editorial content and navigation remain visible; interactive controls require JavaScript.

## Update content

Edit `content/site.ts`. Images, navigation, home assignments, related photo pairs, biography, email, social links and press are centralized here. Add an image to `public/media`, then create a typed `Media` record containing its actual width, height, alt text, role and descriptive title. Use its ID in `site.home` or a two-photo tuple in `site.photoPairs` to curate without changing components. Photographs retain their complete source composition: paired frames follow the first photo's proportions and fit both images without zooming, editorial archive entries and about photography use their intrinsic proportions, and the contact sheet fits each complete image into a uniform frame. Reveal labels and the Focus control sit below the photo. `position` controls alignment within a fitted frame.

`content/media-provenance.json` maps the 16 photographs to the user-supplied source filenames. The `.jpeg` and `.jpg` versions of the veiled-eye close-up depict the same photo; it appears once in the archive. Titles describe imagery, not official look numbers or collection names. No collection dates, material construction claims, photographer credits, awards, education or press were inferred. Add verified credits and facts when available.

Photographs were prepared at up to 2400 × 3000 pixels with high-quality JPEG encoding. Keep the original files separately for future print or re-export needs. Next Image serves responsive AVIF/WebP variants, reserves dimensions and lazily loads noncritical imagery. Only the primary opening image is preloaded. Grain is deliberately retained.

## Verify

```sh
npm run validate:content
npm run lint
npm run typecheck
npm run build
npx playwright install chromium webkit
npm test
```

Browser tests cover every route on desktop Chromium and mobile WebKit, image decoding, overflow, automated WCAG checks, top-to-bottom paired reveals and scroll reversal, archive filtering, modal keyboard behavior and focus restoration, silhouette pair transitions, contact links, reduced motion, photographic focus and page-scroll restoration, contact-sheet filtering and the 404. The test runner uses a production server; it may reuse an existing local server outside CI.

## Deploy to Vercel

Import this GitHub repository into Vercel, choose the Next.js framework preset and Node.js 24, and deploy. Use the default `npm run build` command. No environment variables are required for the current site. After the final domain is known, add `metadataBase`, canonical URLs and a sitemap using that verified domain; no domain is invented here.

Connecting Vercel and publishing a deployment are separate from committing this repository. CI validates content, lint, types, production build and both browser test projects on pushes and pull requests.

## Content still needed

An approved biography, direct email, photo credits, verified garment notes and verified press entries can be added to the existing content fields. Empty press and biography lists do not create fictitious entries or blank CV sections. Instagram is the current contact destination.
