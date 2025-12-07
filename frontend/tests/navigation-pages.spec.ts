import { test, expect } from '@playwright/test';

test.describe('導航頁面功能', () => {
  test('排行榜頁面應該正常載入', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('排行榜');
    await expect(page.locator('text=這裡將顯示排行榜內容')).toBeVisible();
  });

  test('獎勵任務頁面應該正常載入', async ({ page }) => {
    await page.goto('/rewards-tasks');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('獎勵任務');
    await expect(page.locator('text=這裡將顯示獎勵任務內容')).toBeVisible();
  });

  test('挑戰歷程頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-journey');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('挑戰歷程');
    await expect(page.locator('text=這裡將顯示挑戰歷程內容')).toBeVisible();
  });

  test('挑戰地圖頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-map');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('挑戰地圖');
    await expect(page.locator('text=這裡將顯示挑戰地圖內容')).toBeVisible();
  });

  test('所有單元頁面應該正常載入', async ({ page }) => {
    await page.goto('/units');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('所有單元');
    await expect(page.locator('text=這裡將顯示所有單元內容')).toBeVisible();
  });

  test('SOP 寶典頁面應該正常載入', async ({ page }) => {
    await page.goto('/sop');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('SOP 寶典');
    await expect(page.locator('text=這裡將顯示 SOP 寶典內容')).toBeVisible();
  });

  test('從側邊欄導航到排行榜頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的排行榜連結
    await page.click('text=排行榜');
    await page.waitForURL('/rankings');
    
    await expect(page.locator('h1')).toContainText('排行榜');
  });

  test('從側邊欄導航到獎勵任務頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的獎勵任務連結
    await page.click('text=獎勵任務');
    await page.waitForURL('/rewards-tasks');
    
    await expect(page.locator('h1')).toContainText('獎勵任務');
  });

  test('從側邊欄導航到挑戰歷程頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的挑戰歷程連結
    await page.click('text=挑戰歷程');
    await page.waitForURL('/challenge-journey');
    
    await expect(page.locator('h1')).toContainText('挑戰歷程');
  });

  test('從側邊欄導航到挑戰地圖頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的挑戰地圖連結
    await page.click('text=挑戰地圖');
    await page.waitForURL('/challenge-map');
    
    await expect(page.locator('h1')).toContainText('挑戰地圖');
  });

  test('從側邊欄導航到所有單元頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的所有單元連結
    await page.click('text=所有單元');
    await page.waitForURL('/units');
    
    await expect(page.locator('h1')).toContainText('所有單元');
  });

  test('從側邊欄導航到 SOP 寶典頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 點擊側邊欄的 SOP 寶典連結
    await page.click('text=SOP 寶典');
    await page.waitForURL('/sop');
    
    await expect(page.locator('h1')).toContainText('SOP 寶典');
  });
});
