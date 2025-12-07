import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

// 核心步驟定義

Then('我應該看到課程列表', async function (this: PlaywrightWorld) {
  const courseCards = this.page!.locator('[data-testid="course-card"]');
  const cardCount = await courseCards.count();
  
  if (cardCount === 0) {
    const courses = this.page!.locator('h3').filter({ hasText: /課程|Course/ });
    expect(await courses.count()).toBeGreaterThan(0);
  } else {
    expect(cardCount).toBeGreaterThan(0);
  }
});

Then('每個課程卡片應該顯示標題', async function (this: PlaywrightWorld) {
  const firstCard = this.page!.locator('[data-testid="course-card"]').first();
  if (await firstCard.count() === 0) {
    const title = this.page!.locator('h3').first();
    await expect(title).toBeVisible();
  } else {
    const title = firstCard.locator('h3, h2, .text-xl, .text-2xl').first();
    await expect(title).toBeVisible();
  }
});

Given('頁面顯示課程列表', async function (this: PlaywrightWorld) {
  await this.page!.waitForSelector('[data-testid="course-card"], h3', { timeout: 10000 });
});

When('我點擊一個課程卡片', async function (this: PlaywrightWorld) {
  const firstCard = this.page!.locator('[data-testid="course-card"]').first();
  if (await firstCard.count() === 0) {
    await this.page!.locator('h3').first().click();
  } else {
    await firstCard.click();
  }
});

Then('我應該被導航到課程詳情頁', async function (this: PlaywrightWorld) {
  await this.page!.waitForURL(/\/courses\/\d+/, { timeout: 10000 });
  const url = this.page!.url();
  expect(url).toMatch(/\/courses\/\d+/);
});

Given('後端 API 不可用', async function (this: PlaywrightWorld) {
  await this.page!.route('**/api/courses', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });
});
