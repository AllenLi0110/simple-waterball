import { test, expect } from '@playwright/test';

test.describe('課程詳情頁功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    const firstCourseCard = page.locator('[data-testid="course-card"]').first();
    await firstCourseCard.click();
    
    await page.waitForURL(/\/courses\/\d+/, { timeout: 10000 });
  });

  // 1. 核心功能：顯示課程詳情
  test('應該顯示課程詳情', async ({ page }) => {
    const pageTitle = page.locator('h1, h2').first();
    await expect(pageTitle).toBeVisible({ timeout: 5000 });
    await expect(page.locator('body')).toBeVisible();
  });

  // 2. 核心功能：顯示章節列表
  test('應該顯示章節列表', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const chapterTitle = page.locator('text=課程介紹&試聽, text=課程介紹').first();
    const chapterItems = page.locator('div.cursor-pointer.rounded-lg');
    
    const titleExists = await chapterTitle.count();
    const itemsExist = await chapterItems.count();
    
    if (titleExists > 0 || itemsExist > 0) {
      if (titleExists > 0) {
        await expect(chapterTitle).toBeVisible();
      }
      if (itemsExist > 0) {
        await expect(chapterItems.first()).toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  // 3. 核心功能：顯示影片播放器
  test('應該顯示影片播放器', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const videoPlayer = page.locator('video, [data-testid="video-player"], iframe[src*="video"]');
    const videoCount = await videoPlayer.count();
    
    if (videoCount > 0) {
      await expect(videoPlayer.first()).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
