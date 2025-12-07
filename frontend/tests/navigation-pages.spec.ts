import { test, expect } from '@playwright/test';

test.describe('導航頁面功能', () => {
  // 1. 核心功能：頁面載入
  test('排行榜頁面應該正常載入', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 使用 main 區域中的 h1，避免與 header 中的 h1 衝突
    const heading = page.locator('main h1, [role="main"] h1').filter({ hasText: '排行榜' }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  // 2. 核心功能：側邊欄導航
  test('從側邊欄導航到排行榜頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('a[href="/rankings"]', { timeout: 10000 });
    const rankingsLink = page.locator('a[href="/rankings"]').first();
    await expect(rankingsLink).toBeVisible({ timeout: 10000 });
    await rankingsLink.click();
    
    await page.waitForURL('/rankings', { timeout: 10000 });
    // 使用 main 區域中的 h1
    const heading = page.locator('main h1, [role="main"] h1').filter({ hasText: '排行榜' }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  // 3. 核心功能：另一個代表性頁面
  test('SOP 寶典頁面應該正常載入', async ({ page }) => {
    await page.goto('/sop');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 使用 main 區域中的 h1
    const heading = page.locator('main h1, [role="main"] h1').filter({ hasText: 'SOP 寶典' }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
