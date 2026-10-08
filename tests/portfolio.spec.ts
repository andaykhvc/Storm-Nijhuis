import { test, expect } from "@playwright/test";
import { site, getMedia } from "../content/site";
import AxeBuilder from "@axe-core/playwright";
for (const route of ["/", "/hellion", "/archive", "/about"]) {
  test(`${route} renders, loads photography and has no overflow or accessibility violations`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    // Audit the settled page after the finite decorative opening.
    await expect(page.locator(".opening")).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    const firstImage = page.locator("main img").first();
    await expect(firstImage).toBeVisible();
    await expect
      .poll(
        () =>
          firstImage.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        { timeout: 30000 },
      )
      .toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
async function scrollPair(
  page: import("@playwright/test").Page,
  selector: string,
  progress: number,
) {
  const wrapper = page.locator(selector).first();
  await expect(wrapper).toHaveClass(/is-scroll-linked/);
  await wrapper.locator(".shed-sticky").scrollIntoViewIfNeeded();
  // Let entrance motion finish before measuring the scroll range.
  await wrapper.evaluate(async (element) => {
    const animations: Animation[] = [];
    for (
      let ancestor: Element | null = element;
      ancestor;
      ancestor = ancestor.parentElement
    )
      animations.push(...ancestor.getAnimations());
    await Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    );
  });
  const geometry = await wrapper.evaluate((element) => ({
    start:
      element.getBoundingClientRect().top +
      window.scrollY -
      parseFloat(getComputedStyle(element.querySelector(".shed-sticky")!).top),
    travel: element.querySelector(".shed-runway")!.getBoundingClientRect()
      .height,
  }));
  await page.evaluate(
    ({ geometry, progress }) =>
      window.scrollTo({
        top: geometry.start + geometry.travel * progress,
        behavior: "instant",
      }),
    { geometry, progress },
  );
}

for (const route of ["/", "/hellion"]) {
  test(`${route} gives each panel only two related photos and reveals vertically in both directions`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.getByRole("slider")).toHaveCount(0);
    await expect(page.locator(".shedding-wrap")).toHaveCount(3);
    const pairs =
      route === "/"
        ? ([
            [".hero-composition .shedding-wrap", site.photoPairs.hero],
            [".detail-large .shedding-wrap", site.photoPairs.detail],
            [".detail-small .shedding-wrap", site.photoPairs.isolated],
          ] as const)
        : ([
            [".collection-surface .shedding-wrap", site.photoPairs.hero],
            [".lookbook .shedding-wrap", site.photoPairs.silhouette],
            [".material-section .shedding-wrap", site.photoPairs.material],
          ] as const);
    for (const [selector, ids] of pairs) {
      const panel = page.locator(selector);
      await expect(panel.locator("img")).toHaveCount(2);
      await expect(panel.locator(".shed-over img")).toHaveAttribute(
        "alt",
        getMedia(ids[0]).alt,
      );
      await expect(panel.locator(".shed-under img")).toHaveAttribute(
        "alt",
        getMedia(ids[1]).alt,
      );
      for (const progress of [0, 0.5, 1, 0.25, 0]) {
        await scrollPair(page, selector, progress);
        await expect
          .poll(() =>
            panel
              .locator(".shedding")
              .evaluate((e) =>
                parseFloat((e as HTMLElement).style.getPropertyValue("--shed")),
              ),
          )
          .toBeCloseTo(progress * 100, 0);
        await expect(panel.locator(".shedding")).toBeInViewport();
        await expect(panel.locator("img")).toHaveCount(2);
        if (progress === 0.5) {
          // The seam spans the width at mid-height: reveal comes from above.
          const geometry = await panel.evaluate((e) => {
            const stage = e.querySelector(".shedding")!.getBoundingClientRect();
            const seam = e.querySelector(".shed-seam")!.getBoundingClientRect();
            const edge = getComputedStyle(e.querySelector(".shed-over")!)
              .clipPath.slice(8, -1)
              .split(",")[0]
              .trim()
              .split(/\s+/)
              .map(parseFloat);
            return {
              stage: { width: stage.width, height: stage.height },
              seam: {
                width: seam.width,
                height: seam.height,
                y: seam.top - stage.top,
              },
              edge,
            };
          });
          expect(geometry.edge[0]).toBe(0);
          expect(geometry.edge[1]).toBeCloseTo(50, 0);
          expect(geometry.seam.width / geometry.stage.width).toBeGreaterThan(
            0.98,
          );
          expect(geometry.seam.height / geometry.stage.height).toBeLessThan(
            0.05,
          );
          expect(geometry.seam.y / geometry.stage.height).toBeCloseTo(0.5, 1);
        }
        if (progress === 1)
          await expect(panel.locator(".surface-label")).toContainText(
            "02 / 02",
          );
        if (progress === 0)
          await expect(panel.locator(".surface-label")).toContainText(
            "01 / 02",
          );
      }
    }
  });
}
test("archive filters, opens viewer, navigates and returns focus", async ({
  page,
}) => {
  await page.goto("/archive");
  await expect(page.locator(".archive-entry")).toHaveCount(16);
  await page.getByRole("button", { name: "Details", exact: true }).click();
  await expect(page.locator(".archive-entry")).toHaveCount(4);
  const first = page.locator(".archive-entry").first();
  await first.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".viewer-bottom h2")).toHaveText("Veil / 01");
  await page.getByRole("button", { name: "Next archive image" }).click();
  await expect(page.locator(".viewer-bottom h2")).toHaveText("Stripes / 02");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".viewer-bottom h2")).toHaveText("Veil / 01");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(first).toBeFocused();
});
test("navigation works on touch and contact links to supplied Instagram", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("link", { name: "Instagram / @hellion.sin" }),
  ).toHaveAttribute("href", "https://www.instagram.com/hellion.sin/");
  if (info.project.name === "mobile")
    await expect(page.getByRole("navigation")).not.toBeVisible();
});
test("reduced motion keeps content visible and eliminates animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".manifesto")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-title")).toHaveCSS("animation-name", "none");
  const selector = ".hero-composition .shedding-wrap";
  await scrollPair(page, selector, 0.75);
  await expect(page.locator(selector + " .shed-over")).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(page.locator(selector + " .surface-label")).toContainText(
    "02 / 02",
  );
  await scrollPair(page, selector, 0.25);
  await expect(page.locator(selector + " .shed-over")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(selector + " .surface-label")).toContainText(
    "01 / 02",
  );
  await expect(page.locator(".shed-over").first()).toHaveCSS(
    "clip-path",
    "none",
  );
  await expect(page.locator(".shed-over").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
});
test("unknown route returns a useful 404", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("link", { name: "Return to Hellion" }),
  ).toBeVisible();
});

test("homepage keeps the work and links without repeating subsection labels", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Storm Nijhuis" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "On this page" }),
  ).toHaveCount(0);
  await expect(
    page.locator(
      ".hero-statement > .eyebrow, .manifesto > .eyebrow, .detail-small > .eyebrow, .closing > .eyebrow",
    ),
  ).toHaveCount(0);
  await expect(page.locator(".hero-statement h2")).toHaveText("HELLION");
  await expect(
    page.getByRole("heading", { name: /The body sets/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore the work", exact: true }).click();
  await expect(page).toHaveURL(/\/hellion$/);
  await page.goto("/");
  await page.getByRole("link", { name: "View the archive", exact: true }).click();
  await expect(page).toHaveURL(/\/archive$/);
  await page.goto("/");
  await page.getByRole("link", { name: "About Storm", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
});

test("opening completes automatically and only plays once per tab", async ({
  page,
}) => {
  await page.goto("/");
  const opening = page.locator(".opening");
  await expect(opening).toBeVisible();
  await expect(opening).toHaveAttribute("aria-hidden", "true");
  await expect(opening).toBeHidden({ timeout: 4000 });
  await page.reload();
  await expect(page.locator(".menu-toggle")).toBeEnabled();
  await expect(opening).toBeHidden();
  await expect(
    page.getByRole("heading", { level: 1, name: "Storm Nijhuis" }),
  ).toBeVisible();
});

test("opening dismisses on interaction and reading progress follows the page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".opening")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".opening")).toBeHidden();
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page
        .locator(".reading-progress")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeGreaterThan(0.99);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator(".reading-progress")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeLessThan(0.01);
});

test("deep links and reduced motion bypass the opening", async ({ page }) => {
  await page.goto("/about#contact");
  await expect(page.locator(".menu-toggle")).toBeEnabled();
  await expect(page.locator(".opening")).toBeHidden();
  await expect(page.locator("#contact")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".opening")).toBeHidden();
  await expect(page.locator(".type-track").first()).toHaveCSS(
    "transform",
    "none",
  );
});

test("focus view fits the revealed photo and restores the page", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await scrollPair(page, ".hero-composition .shedding-wrap", 1);
  const panel = page.locator(".hero-composition .shedding");
  const revealed = getMedia(site.photoPairs.hero[1]);
  const launch = panel.getByRole("button", {
    name: `Open focus view of ${revealed.title}`,
  });
  await launch.click();
  const dialog = page.getByRole("dialog", {
    name: revealed.title,
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("alt", revealed.alt);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await expect(dialog.getByRole("button")).toHaveCount(1);
  const stage = dialog.locator(".focus-stage");
  expect(
    await stage.evaluate(
      (element) =>
        element.scrollWidth <= element.clientWidth &&
        element.scrollHeight <= element.clientHeight,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(launch).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(panel.locator("img")).toHaveCount(2);
});

test("contact sheet keeps filters and image navigation working", async ({
  page,
}) => {
  await page.goto("/archive");
  await page
    .getByRole("button", { name: "Contact sheet", exact: true })
    .click();
  await expect(page.locator(".archive-grid")).toHaveAttribute(
    "data-layout",
    "contact",
  );
  await expect(page.locator(".archive-entry")).toHaveCount(16);
  const frames = page.locator(".archive-image");
  const firstFrame = await frames.nth(0).boundingBox();
  const secondFrame = await frames.nth(1).boundingBox();
  expect(Math.abs(firstFrame!.width - secondFrame!.width)).toBeLessThan(2);
  expect(Math.abs(firstFrame!.height - secondFrame!.height)).toBeLessThan(2);
  await page.getByRole("button", { name: "Details", exact: true }).click();
  await expect(page.locator(".archive-entry")).toHaveCount(4);
  const first = page.locator(".archive-entry").first();
  await first.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Next archive image" }).click();
  await expect(page.locator(".viewer-bottom h2")).toHaveText("Stripes / 02");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(first).toBeFocused();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Editorial grid", exact: true })
    .click();
  await expect(page.locator(".archive-grid")).toHaveAttribute(
    "data-layout",
    "editorial",
  );
  await expect(page.locator(".archive-entry")).toHaveCount(4);
});

test("photographic workbench respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hellion");
  await page.locator(".focus-launch").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".focus-shutter")).toBeHidden();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.goto("/archive");
  await page
    .getByRole("button", { name: "Contact sheet", exact: true })
    .click();
  expect(
    await page
      .locator(".archive-entry img")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});
