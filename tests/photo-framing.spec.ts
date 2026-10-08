import { test, expect, type Locator } from "@playwright/test";

async function expectCompletePhoto(image: Locator, frameSelector: string) {
  await image.scrollIntoViewIfNeeded();
  await image.evaluate((element: HTMLImageElement) => element.decode());
  const geometry = await image.evaluate((element: HTMLImageElement, selector) => {
    const box = element.getBoundingClientRect();
    const frame = element.closest(selector)!.getBoundingClientRect();
    const style = getComputedStyle(element);
    const naturalRatio = element.naturalWidth / element.naturalHeight;
    const scale =
      style.objectFit === "cover"
        ? Math.max(box.width / element.naturalWidth, box.height / element.naturalHeight)
        : Math.min(box.width / element.naturalWidth, box.height / element.naturalHeight);
    const width = element.naturalWidth * scale;
    const height = element.naturalHeight * scale;
    const [x, y] = style.objectPosition.split(" ").map(parseFloat);
    const left = box.left + ((box.width - width) * x) / 100;
    const top = box.top + ((box.height - height) * y) / 100;
    return {
      left: left - Math.max(frame.left, box.left),
      top: top - Math.max(frame.top, box.top),
      right: Math.min(frame.right, box.right) - (left + width),
      bottom: Math.min(frame.bottom, box.bottom) - (top + height),
      naturalRatio,
      frameRatio: frame.width / frame.height,
    };
  }, frameSelector);
  // Check the painted photograph, including any scale transform, against its clipping frame.
  for (const edge of [geometry.left, geometry.top, geometry.right, geometry.bottom])
    expect(edge).toBeGreaterThanOrEqual(-1);
  return geometry;
}

for (const route of ["/", "/hellion"]) {
  test(`${route} fits both photos and keeps controls outside the composition`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator(".menu-toggle")).toBeEnabled();
    await page.keyboard.press("Escape");
    for (const panel of await page.locator(".shed-sticky").all()) {
      const photos = panel.locator(".shedding img");
      for (const image of await photos.all())
        await expectCompletePhoto(image, ".shedding");
      const frame = await panel.locator(".shedding").boundingBox();
      const caption = await panel.locator(".surface-caption").boundingBox();
      const focus = await panel.getByRole("button").boundingBox();
      expect(caption!.y).toBeGreaterThanOrEqual(frame!.y + frame!.height - 1);
      expect(focus!.y).toBeGreaterThanOrEqual(frame!.y + frame!.height - 1);
    }
  });
}

test("archive fits every photo before and after hover in both layouts", async ({ page }) => {
  await page.goto("/archive");
  for (const layout of ["Editorial grid", "Contact sheet"]) {
    await page.getByRole("button", { name: layout, exact: true }).click();
    for (const entry of await page.locator(".archive-entry").all()) {
      const image = entry.locator("img");
      const geometry = await expectCompletePhoto(image, ".archive-image");
      if (layout === "Editorial grid")
        expect(geometry.frameRatio).toBeCloseTo(geometry.naturalRatio, 2);
      await entry.hover();
      await expectCompletePhoto(image, ".archive-image");
    }
  }
});

test("about photography preserves the source proportions", async ({ page }) => {
  await page.goto("/about");
  const geometry = await expectCompletePhoto(page.locator(".about-art img"), ".about-art");
  const ratio = await page.locator(".about-art img").evaluate(element => {
    const box = element.getBoundingClientRect();
    return box.width / box.height;
  });
  expect(ratio).toBeCloseTo(geometry.naturalRatio, 2);
});

test("short viewports and reduced motion retain the complete paired photo", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hellion");
  const panel = page.locator(".lookbook .shed-sticky");
  for (const image of await panel.locator(".shedding img").all())
    await expectCompletePhoto(image, ".shedding");
  const frame = await panel.locator(".shedding").boundingBox();
  expect(frame!.height).toBeLessThan(390);
});
