import { test as setup } from '@playwright/test';
import { PrismaClient } from "@prisma/client";

const authFile = 'e2e/config/storageState.json';

setup('authenticate', async ({ page }) => {
    const prisma = new PrismaClient();
    // あらかじめSessionテーブルにテストユーザと紐づくレコードを作成しておく
    await prisma.session.delete({
      where: {
        sessionToken: "dummy"
      },
    });
    await prisma.session.create({
      data: {
        sessionToken: "dummy",
        userId: "1",
        expires: new Date(new Date().getTime() + 86400),
      },
    });

  // NextAuth.jsのセッションcookieを設定
  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: 'dummy',
      domain: 'localhost:3000',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  ]);

  // 認証状態を保存
  await page.context().storageState({ path: authFile });
});