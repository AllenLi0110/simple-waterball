import { test, expect } from '@playwright/test';

test.describe('導航頁面功能', () => {
  test('排行榜頁面應該正常載入', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 使用更寬鬆的選擇器，允許更多時間載入
    const heading = page.locator('h1').filter({ hasText: '排行榜' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示排行榜內容')).toBeVisible({ timeout: 10000 });
  });

  test('獎勵任務頁面應該正常載入', async ({ page }) => {
    await page.goto('/rewards-tasks');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '獎勵任務' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示獎勵任務內容')).toBeVisible({ timeout: 10000 });
  });

  test('挑戰歷程頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-journey');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '挑戰歷程' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示挑戰歷程內容')).toBeVisible({ timeout: 10000 });
  });

  test('挑戰地圖頁面應該正常載入', async ({ page }) => {
    await page.goto('/challenge-map');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '挑戰地圖' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示挑戰地圖內容')).toBeVisible({ timeout: 10000 });
  });

  test('所有單元頁面應該正常載入', async ({ page }) => {
    await page.goto('/units');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '所有單元' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示所有單元內容')).toBeVisible({ timeout: 10000 });
  });

  test('SOP 寶典頁面應該正常載入', async ({ page }) => {
    await page.goto('/sop');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: 'SOP 寶典' });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=這裡將顯示 SOP 寶典內容')).toBeVisible({ timeout: 10000 });
  });

  test('從側邊欄導航到排行榜頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 等待側邊欄載入，使用更寬鬆的選擇器
    await page.waitForSelector('a[href="/rankings"], a:has-text("排行榜")', { timeout: 15000 });
    
    // 使用 href 屬性來精確定位連結
    const rankingsLink = page.locator('a[href="/rankings"]').first();
    await expect(rankingsLink).toBeVisible({ timeout: 15000 });
    await rankingsLink.click();
    
    await page.waitForURL('/rankings', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '排行榜' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('從側邊欄導航到獎勵任務頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('a[href="/rewards-tasks"]', { timeout: 15000 });
    const rewardsLink = page.locator('a[href="/rewards-tasks"]').first();
    await expect(rewardsLink).toBeVisible({ timeout: 15000 });
    await rewardsLink.click();
    
    await page.waitForURL('/rewards-tasks', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '獎勵任務' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('從側邊欄導航到挑戰歷程頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('a[href="/challenge-journey"]', { timeout: 15000 });
    const journeyLink = page.locator('a[href="/challenge-journey"]').first();
    await expect(journeyLink).toBeVisible({ timeout: 15000 });
    await journeyLink.click();
    
    await page.waitForURL('/challenge-journey', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '挑戰歷程' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('從側邊欄導航到挑戰地圖頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('a[href="/challenge-map"]', { timeout: 15000 });
    const mapLink = page.locator('a[href="/challenge-map"]').first();
    await expect(mapLink).toBeVisible({ timeout: 15000 });
    await mapLink.click();
    
    await page.waitForURL('/challenge-map', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '挑戰地圖' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('從側邊欄導航到所有單元頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('a[href="/units"]', { timeout: 15000 });
    const unitsLink = page.locator('a[href="/units"]').first();
    await expect(unitsLink).toBeVisible({ timeout: 15000 });
    await unitsLink.click();
    
    await page.waitForURL('/units', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: '所有單元' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('從側邊欄導航到 SOP 寶典頁面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('a[href="/sop"]', { timeout: 15000 });
    const sopLink = page.locator('a[href="/sop"]').first();
    await expect(sopLink).toBeVisible({ timeout: 15000 });
    await sopLink.click();
    
    await page.waitForURL('/sop', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heading = page.locator('h1').filter({ hasText: 'SOP 寶典' });
    await expect(heading).toBeVisible({ timeout: 15000 });
  });
});
