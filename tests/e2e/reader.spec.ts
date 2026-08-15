import { expect, test } from "@playwright/test";

test.describe("koreo reader", () => {
  test("opens from the article, advances with keys, and returns focus on close", async ({ page }) => {
    await page.goto("/");

    const opener = page.getByRole("button", { name: /Open Koreo guided reading of the Quebrada de Humahuaca photograph/i }).first();
    await opener.click();

    const reader = page.getByRole("dialog", { name: "koreo viewer" });
    const progress = reader.getByRole("progressbar");
    await expect(reader).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", "1");

    await page.keyboard.press("ArrowRight");
    await expect(progress).toHaveAttribute("aria-valuenow", "2");

    await page.keyboard.press("End");
    await expect(progress).toHaveAttribute("aria-valuenow", "6");

    await page.keyboard.press("Escape");
    await expect(reader).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("opens the landscape reader and responds to keyboard navigation", async ({ page }) => {
    await page.goto("/cinque-terre");

    await page.getByRole("button", { name: /Open the Koreo guided reading of Cinque Terre/i }).first().click();

    const reader = page.getByRole("dialog", { name: "koreo viewer" });
    const progress = reader.getByRole("progressbar");
    await expect(reader).toBeVisible();
    await expect(reader.locator('[aria-label="koreo caption beats"]')).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(progress).toHaveAttribute("aria-valuenow", "2");

    await page.keyboard.press("Home");
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
  });
});
