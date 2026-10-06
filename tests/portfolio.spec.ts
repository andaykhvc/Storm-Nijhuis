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
async function scrollSequence(
  page: import("@playwright/test").Page,
  selector: string,
  step: number,
  count: number,
) {
  const wrapper = page.locator(selector).first();
  await expect(wrapper).toHaveClass(/is-scroll-linked/);
  const geometry = await wrapper.evaluate((element) => {
    const sticky = element.querySelector(".shed-sticky")!;
    const runway = element.querySelector(".shed-runway")!;
    return {
      start:
        element.getBoundingClientRect().top +
        window.scrollY -
        parseFloat(getComputedStyle(sticky).top),
      travel: runway.getBoundingClientRect().height,
    };
  });
  await page.evaluate(
    ({ geometry, step, count }) =>
      window.scrollTo({
        top: geometry.start + (geometry.travel * step) / (count - 1),
        behavior: "instant",
      }),
    { geometry, step, count },
  );
}

for (const route of ["/", "/hellion"]) {
  test(`${route} scrolls through every supplied photograph and reverses without controls`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.getByRole("slider")).toHaveCount(0);
    await expect(
      page.getByText("Shed the surface", { exact: true }),
    ).toHaveCount(0);
    const selector = ".shedding-wrap";
    const sequence = page.locator(".shedding-wrap").first();
    for (let index = 0; index < site.scrollSequence.length; index++) {
      const step =
        index === site.scrollSequence.length - 1 ? index : index + 0.2;
      await scrollSequence(page, selector, step, site.scrollSequence.length);
      const layer =
        index === site.scrollSequence.length - 1
          ? ".shed-under img"
          : ".shed-over img";
      await expect(sequence.locator(layer)).toBeVisible();
      await expect(sequence.locator(layer)).toHaveAttribute(
        "alt",
        getMedia(site.scrollSequence[index]).alt,
      );
      await expect
        .poll(() =>
          sequence
            .locator(".shedding")
            .evaluate((e) =>
              parseFloat((e as HTMLElement).style.getPropertyValue("--shed")),
            ),
        )
        .toBeGreaterThan(0);
      await expect(sequence.locator("img")).toHaveCount(
        index === site.scrollSequence.length - 1
          ? 2
          : index >= site.scrollSequence.length - 2
            ? 2
            : 3,
      );
    }
    await expect(sequence.locator(".surface-label")).toContainText("16 / 16");
    await scrollSequence(page, selector, 3.25, site.scrollSequence.length);
    await expect(sequence.locator(".shed-over img")).toHaveAttribute(
      "alt",
      getMedia(site.scrollSequence[3]).alt,
    );
    await scrollSequence(page, selector, 0, site.scrollSequence.length);
    await expect(sequence.locator(".shed-over img")).toHaveAttribute(
      "alt",
      getMedia(site.scrollSequence[0]).alt,
    );
    await expect
      .poll(() =>
        sequence
          .locator(".shedding")
          .evaluate((e) =>
            parseFloat((e as HTMLElement).style.getPropertyValue("--shed")),
          ),
      )
      .toBeLessThan(0.5);
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
test("lookbook follows scroll position in both directions", async ({
  page,
}) => {
  await page.goto("/hellion");
  await scrollSequence(
    page,
    ".lookbook .shedding-wrap",
    2.2,
    site.lookbook.length,
  );
  await expect(page.locator(".lookbook .shed-over img")).toHaveAttribute(
    "alt",
    getMedia(site.lookbook[2]).alt,
  );
  await scrollSequence(
    page,
    ".lookbook .shedding-wrap",
    0,
    site.lookbook.length,
  );
  await expect(page.locator(".lookbook .shed-over img")).toHaveAttribute(
    "alt",
    getMedia(site.lookbook[0]).alt,
  );
});
test("navigation works on touch and contact links to supplied Instagram", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Menu +" }).click();
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
  await scrollSequence(page, ".shedding-wrap", 2.5, site.scrollSequence.length);
  await expect(page.locator(".shed-over img")).toHaveAttribute(
    "alt",
    getMedia(site.scrollSequence[2]).alt,
  );
  await expect(page.locator(".shed-over")).toHaveCSS("clip-path", "none");
  await expect(page.locator(".shed-over")).toHaveCSS(
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

test("designer name and section index lead directly to the work and approach", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Storm Nijhuis" }),
  ).toBeVisible();
  const index = page.getByRole("navigation", { name: "On this page" });
  await index.getByRole("link", { name: /Approach/ }).click();
  await expect(page).toHaveURL(/#approach$/);
  await expect(
    page.getByRole("heading", { name: /The body sets/ }),
  ).toBeInViewport();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await index.getByRole("link", { name: /Selected work/ }).click();
  await expect(page).toHaveURL(/#selected-work$/);
  await expect(page.locator(".hero-statement h2")).toBeInViewport();
});
