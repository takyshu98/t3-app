import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  console.log('Page URL:', page.url());

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create T3 App/);
});
