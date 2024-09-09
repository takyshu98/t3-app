import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

test("ログイン未済の状態でアクセスすると、ユーザ情報が表示されない", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Create T3 App/);
  await expect(page.getByText(/Logged in as test/)).not.toBeVisible();
  await page.getByRole("link", { name: /Sign in/ }).isVisible();
});

test("ログイン済みの状態でアクセスすると、ユーザ情報が表示される", async ({
  browser,
}) => {
  const DUMMY_TOKEN = crypto.randomUUID();

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
      name: "next-auth.session-token",
      value: DUMMY_TOKEN,
      domain: process.env.BASE_URL
        ? new URL(process.env.BASE_URL).hostname
        : "localhost",
      path: "/",
      httpOnly: true,
      secure: Boolean(process.env.CI),
    },
  ]);

  const page = await context.newPage();
  await page.goto("/");

  await expect(page).toHaveTitle(/Create T3 App/);
  await expect(page.getByText(/Logged in as test/)).toBeVisible();
  await page.getByRole("link", { name: /Sign out/ }).isVisible();
  const html = await page.innerHTML("body");
  console.log(html);

  await prisma.session.delete({
    where: {
      sessionToken: DUMMY_TOKEN,
    },
  });
});
