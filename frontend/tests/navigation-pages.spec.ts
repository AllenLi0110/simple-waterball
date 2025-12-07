import { test, expect } from '@playwright/test';

test.describe('導航頁面功能', () => {
  test('排行榜頁面應該正常載入', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 使用更寬鬆的選擇器
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '排行榜' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示排行榜內容')).toBeVisible({ timeout: 5000 });
  });

  test('獎勵任務頁面應該正常載入', async ({ page }) => {
    await page.goto('/rewards-tasks');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '獎勵任務' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示獎勵任務內容')).toBeVisible({ timeout: 5000 });
  });

  test('挑戰歷程頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-journey');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '挑戰歷程' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示挑戰歷程內容')).toBeVisible({ timeout: 5000 });
  });

  test('挑戰地圖頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-map');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '挑戰地圖' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示挑戰地圖內容')).toBeVisible({ timeout: 5000 });
  });

  test('所有單元頁面應該正常載入', async ({ page }) => {
    await page.goto('/units');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '所有單元' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示所有單元內容')).toBeVisible({ timeout: 5000 });
  });

  test('SOP 寶典頁面應該正常載入', async ({ page }) => {
    await page.goto('/sop');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: 'SOP 寶典' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=這裡將顯示 SOP 寶典內容')).toBeVisible({ timeout: 5000 });
  });

  test('從側邊欄導航到排行榜頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的排行榜連結
    await page.click('text=排行榜', { timeout: 10000 });
    await page.waitForURL('/rankings', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '排行榜' })).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到獎勵任務頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的獎勵任務連結
    await page.click('text=獎勵任務', { timeout: 10000 });
    await page.waitForURL('/rewards-tasks', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '獎勵任務' })).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到挑戰歷程頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的挑戰歷程連結
    await page.click('text=挑戰歷程', { timeout: 10000 });
    await page.waitForURL('/challenge-journey', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '挑戰歷程' })).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到挑戰地圖頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的挑戰地圖連結
    await page.click('text=挑戰地圖', { timeout: 10000 });
    await page.waitForURL('/challenge-map', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '挑戰地圖' })).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到所有單元頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的所有單元連結
    await page.click('text=所有單元', { timeout: 10000 });
    await page.waitForURL('/units', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: '所有單元' })).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到 SOP 寶典頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 點擊側邊欄的 SOP 寶典連結
    await page.click('text=SOP 寶典', { timeout: 10000 });
    await page.waitForURL('/sop', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('h1, [role="heading"]').filter({ hasText: 'SOP 寶典' })).toBeVisible({ timeout: 10000 });
  });
});
