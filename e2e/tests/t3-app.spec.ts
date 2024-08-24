import { test, expect } from '@playwright/test';
import { PrismaClient } from "@prisma/client";

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create T3 App/);
  await page.getByRole('link', { name: /Sign in/i }).isVisible();
});

test("ログイン状態でアクセスすると、ユーザ情報が表示される", async ({
  browser,
}) => {
  const DUMMY_TOKEN = crypto.randomUUID()
  
  const prisma = new PrismaClient();
  await prisma.session.create({
    data: {
      sessionToken: DUMMY_TOKEN,
      userId: "1",
      expires: new Date(new Date().getTime() + 86400),
    },
  });

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: DUMMY_TOKEN,
      domain: process.env.BASE_URL ? new URL(process.env.BASE_URL).hostname : 'localhost',
      path: '/',
      httpOnly: true,
      secure: Boolean(process.env.CI),
    },
  ]);

  const page = await context.newPage();

  console.log('process.env.BASE_URL:', process.env.BASE_URL)
  const cookie = await page.context().cookies(process.env.BASE_URL || 'http://localhost')
  console.log(cookie)

  await page.goto('/');
  await page.getByRole('link', { name: /Sign out/i }).isVisible();

  await prisma.session.delete({
    where: {
      sessionToken: DUMMY_TOKEN
    },
  });
});