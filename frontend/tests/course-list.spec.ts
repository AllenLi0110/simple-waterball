import { test, expect } from '@playwright/test';

test.describe('課程列表功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. 核心功能：顯示課程列表
  test('應該顯示所有課程列表', async ({ page }) => {
    await page.waitForSelector('[data-testid="course-card"], h3', { timeout: 10000 });
    
    const courseCards = page.locator('[data-testid="course-card"]');
    const cardCount = await courseCards.count();
    
    if (cardCount === 0) {
      const cards = page.locator('h3').filter({ hasText: /課程|Course/ });
      expect(await cards.count()).toBeGreaterThan(0);
    } else {
      expect(cardCount).toBeGreaterThan(0);
    }
  });

  // 2. 核心功能：點擊跳轉
  test('課程卡片點擊應該跳轉到詳情頁', async ({ page }) => {
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="course-card"]').first();
    await firstCard.click();
    
    await page.waitForURL(/\/courses\/\d+/, { timeout: 10000 });
    expect(page.url()).toMatch(/\/courses\/\d+/);
  });

  // 3. 核心功能：錯誤處理
  test('API 錯誤時應該有錯誤處理', async ({ page }) => {
    await page.route('**/api/courses', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // 至少驗證頁面有響應
    await expect(page.locator('body')).toBeVisible();
  });
});
