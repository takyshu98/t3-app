import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create T3 App/);
});

test("ログイン状態でアクセスすると、ユーザ情報が表示される", async ({
  page,
}) => {
  const cookie = await page.context().cookies('http://localhost')
  console.log(cookie)
  await page.goto('/');
  // await page.getByRole('link', { name: /Sign in/i }).click();
  await page.waitForTimeout(1000);
});