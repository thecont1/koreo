import { expect, test, type Page } from "@playwright/test";

const routes: Array<{ path: string; assert: (page: Page) => Promise<void> }> = [
  {
    path: "/",
    assert: async (page) => expect(page.getByRole("heading", { name: /Quebrada de Humahuaca/i })).toBeVisible(),
  },
  {
    path: "/guide",
    assert: async (page) => expect(page.getByRole("heading", { name: /One image/i })).toBeVisible(),
  },
  {
    path: "/author",
    assert: async (page) => expect(page.getByRole("heading", { name: /Mark the point/i })).toBeVisible(),
  },
  {
    path: "/cinque-terre",
    assert: async (page) =>
      expect(page.getByRole("button", { name: /Open the Koreo guided reading of Cinque Terre/i }).first()).toBeVisible(),
  },
];

for (const route of routes) {
  test(`smoke: ${route.path} renders`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page).toHaveTitle(/koreo/i);
    await expect(page.locator("#root")).not.toBeEmpty();
    await route.assert(page);
  });
}
