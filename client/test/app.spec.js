import { test, expect } from "@playwright/test";

test("AI workspace opens", async ({ page }) => {
  await page.goto("http://localhost:5173/ai");
  await expect(page).toHaveURL(/\/ai$/);
  await expect(page.locator("body")).toContainText(/AI Workspace|Welcome back|Sign in/i);
});

test("public pricing page opens", async ({ page }) => {
  await page.goto("http://localhost:5173/pricing");
  await expect(page.getByText("Simple plans for every stage")).toBeVisible();
});

const viewports = [
  [375, 812],
  [390, 844],
  [412, 915],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
];

for (const [width, height] of viewports) {
  test(`pricing visual snapshot - ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:5173/pricing");
    await expect(page).toHaveScreenshot(`pricing-${width}x${height}.png`, {
      fullPage: true,
    });
  });
}

test("public navigation routes load", async ({ page }) => {
  for (const route of ["/features", "/solutions", "/blog", "/about", "/contact", "/privacy", "/terms"]) {
    await page.goto(`http://localhost:5173${route}`);
    await expect(page.locator("#main-content")).toBeVisible();
  }
});

test("protected workspace routes show authentication when signed out", async ({ page }) => {
  for (const route of ["/ai", "/dashboard", "/ai/history", "/ai/documents", "/ai/billing"]) {
    await page.goto(`http://localhost:5173${route}`);
    await expect(page.locator("body")).toContainText(/Welcome back|Sign in|AI Workspace|Loading your workspace/i);
  }
});
