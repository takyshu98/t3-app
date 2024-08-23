import { test, expect } from '@playwright/test';
import { PrismaClient } from "@prisma/client";

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create T3 App/);
});

test("ログイン状態でアクセスすると、ユーザ情報が表示される", async ({
  browser,
}) => {
  // const cookie = await page.context().cookies('http://localhost')
  // console.log(cookie)
  const prisma = new PrismaClient();
  // あらかじめSessionテーブルにテストユーザと紐づくレコードを作成しておく
  const existingRecord = await prisma.session.findUnique({
    where: {
      sessionToken: "dummy"
    },
  });
    
  if (existingRecord) {
    await prisma.session.delete({
      where: {
        sessionToken: "dummy"
      },
    });
  }

  await prisma.session.create({
    data: {
      sessionToken: "dummy",
      userId: "1",
      expires: new Date(new Date().getTime() + 86400),
    },
  });

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: 'dummy',
      domain: 'localhost:3000',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  ]);

  // ログインしていないとアクセスできないページのテストをする
  const page = await context.newPage();

  await page.goto('/');
  // await page.getByRole('link', { name: /Sign in/i }).click();
  await page.waitForTimeout(1000);
});