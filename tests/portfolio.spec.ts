import { test, expect } from "@playwright/test";
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
test("shedding supports reveal, reset and keyboard adjustment", async ({
  page,
}) => {
  await page.goto("/");
  const range = page.getByRole("slider", { name: "Shed the surface" });
  await expect(range).toHaveValue("0");
  await page.getByRole("button", { name: "Reveal inner surface" }).click();
  await expect(range).toHaveValue("100");
  await page.getByRole("button", { name: "Restore outer surface" }).click();
  await range.focus();
  await range.press("ArrowRight");
  await expect(range).toHaveValue("1");
});
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
test("lookbook changes photographs and wraps", async ({ page }) => {
  await page.goto("/hellion");
  await expect(page.locator(".lookbook-info h3")).toHaveText("Silhouette / 01");
  await page
    .getByRole("button", { name: "Previous image", exact: true })
    .click();
  await expect(page.locator(".lookbook-info h3")).toHaveText("Texture / 03");
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".lookbook-info h3")).toHaveText("Silhouette / 01");
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
  await page.getByRole("button", { name: "Reveal inner surface" }).click();
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
