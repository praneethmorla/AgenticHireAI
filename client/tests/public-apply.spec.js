import { test, expect } from "@playwright/test";

test("public app shell loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Recruiter login" })).toBeVisible();
});
