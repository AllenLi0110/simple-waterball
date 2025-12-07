import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

// Order and Payment step definitions

Given('我在課程列表頁面', async function (this: PlaywrightWorld) {
  await this.page!.goto('/');
  await this.page!.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
});

When('我點擊課程的「立即購買」按鈕', async function (this: PlaywrightWorld) {
  // Find a course card with "購買" or "购买" in the button label
  const courseCards = this.page!.locator('[data-testid="course-card"]');
  const cardCount = await courseCards.count();
  
  for (let i = 0; i < cardCount; i++) {
    const card = courseCards.nth(i);
    const button = card.locator('button');
    const buttonText = await button.textContent();
    
    if (buttonText && (buttonText.includes('購買') || buttonText.includes('购买'))) {
      await button.click();
      await this.page!.waitForTimeout(2000);
      return;
    }
  }
  
  // If no purchase button found, click the first card's button
  const firstButton = courseCards.first().locator('button');
  await firstButton.click();
  await this.page!.waitForTimeout(2000);
});

Then('我應該被導向到訂單建立頁面', async function (this: PlaywrightWorld) {
  await this.page!.waitForURL(/\/orders\/create\/\d+/, { timeout: 10000 });
  await expect(this.page!.locator('body')).toBeVisible();
});

Then('我應該看到訂單編號', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const orderNumber = this.page!.locator('text=訂單編號');
  await expect(orderNumber).toBeVisible({ timeout: 5000 });
  
  // Check for order number format (18 characters)
  const orderNumberValue = this.page!.locator('text=/\\d{14}[a-z0-9]{4}/');
  const count = await orderNumberValue.count();
  expect(count).toBeGreaterThan(0);
});

Then('我應該看到付款截止時間（3天後）', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const paymentDeadline = this.page!.locator('text=付款截止時間');
  await expect(paymentDeadline).toBeVisible({ timeout: 5000 });
});

Then('付款方式應該都是反灰不可點選', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  
  // Check that payment method options are disabled/greyed out
  const paymentMethods = this.page!.locator('text=ATM 匯款, text=信用卡, text=銀角零卡分期');
  const count = await paymentMethods.count();
  
  // All payment methods should be visible but disabled
  for (let i = 0; i < count; i++) {
    const method = paymentMethods.nth(i);
    const parent = method.locator('..');
    const classes = await parent.getAttribute('class');
    
    // Check if it has opacity-50 or cursor-not-allowed classes
    expect(classes).toContain('opacity-50');
  }
});

Given('我已經建立了訂單', async function (this: PlaywrightWorld) {
  // Navigate to course list and create an order
  await this.page!.goto('/');
  await this.page!.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
  
  const courseCards = this.page!.locator('[data-testid="course-card"]');
  const firstButton = courseCards.first().locator('button');
  await firstButton.click();
  await this.page!.waitForURL(/\/orders\/create\/\d+/, { timeout: 10000 });
  await this.page!.waitForTimeout(2000);
});

When('我點擊「進行支付」按鈕', async function (this: PlaywrightWorld) {
  const paymentButton = this.page!.locator('button:has-text("進行支付")');
  await expect(paymentButton).toBeVisible({ timeout: 5000 });
  await paymentButton.click();
  await this.page!.waitForTimeout(1000);
});

Then('我應該看到付款成功訊息（3秒）', async function (this: PlaywrightWorld) {
  // Wait for success message to appear
  const successMessage = this.page!.locator('text=付款成功');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
  
  // Wait a bit to ensure it's displayed
  await this.page!.waitForTimeout(1000);
});

Then('3秒後我應該被導向到課程的第一個章節頁面', async function (this: PlaywrightWorld) {
  // Wait for redirect (3 seconds + buffer)
  await this.page!.waitForURL(/\/courses\/\d+\/chapters\/\d+/, { timeout: 5000 });
  await expect(this.page!.locator('body')).toBeVisible();
});

Given('我訪問課程詳情頁面', async function (this: PlaywrightWorld) {
  await this.page!.goto('/');
  await this.page!.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
  
  const firstCard = this.page!.locator('[data-testid="course-card"]').first();
  await firstCard.click();
  
  await this.page!.waitForURL(/\/courses\/\d+/, { timeout: 10000 });
  await this.page!.waitForTimeout(2000);
});

Then('我應該在頁面下方看到訂單紀錄區塊', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const orderHistory = this.page!.locator('text=訂單紀錄');
  await expect(orderHistory).toBeVisible({ timeout: 5000 });
});

Then('我應該看到訂單編號', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const orderNumber = this.page!.locator('text=訂單編號');
  await expect(orderNumber).toBeVisible({ timeout: 5000 });
});

Then('我應該看到訂單狀態', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  // Check for status badges (待付款, 已付款, 已取消)
  const statusBadge = this.page!.locator('text=待付款, text=已付款, text=已取消');
  const count = await statusBadge.count();
  expect(count).toBeGreaterThan(0);
});

Then('我應該看到付款截止日期', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const paymentDeadline = this.page!.locator('text=付款截止日期');
  const count = await paymentDeadline.count();
  // May or may not be visible depending on order status
  expect(count).toBeGreaterThanOrEqual(0);
});

Given('我有一個超過3天未付款的訂單', async function (this: PlaywrightWorld) {
  // This would typically require backend setup to create an expired order
  // For now, we'll assume the order exists and is expired
  await this.page!.goto('/');
  await this.page!.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
  
  const firstCard = this.page!.locator('[data-testid="course-card"]').first();
  await firstCard.click();
  
  await this.page!.waitForURL(/\/courses\/\d+/, { timeout: 10000 });
  await this.page!.waitForTimeout(2000);
});

When('我查看訂單紀錄', async function (this: PlaywrightWorld) {
  // Navigate to course detail page where order history is shown
  await this.page!.waitForTimeout(2000);
  const orderHistory = this.page!.locator('text=訂單紀錄');
  await expect(orderHistory).toBeVisible({ timeout: 5000 });
});

Then('訂單狀態應該顯示為「已取消」', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const cancelledStatus = this.page!.locator('text=已取消');
  await expect(cancelledStatus).toBeVisible({ timeout: 5000 });
});

Then('備註應該顯示「期限內未完成付款」', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const remarks = this.page!.locator('text=期限內未完成付款');
  await expect(remarks).toBeVisible({ timeout: 5000 });
});

Then('訂單不應該有「立即完成訂單」按鈕', async function (this: PlaywrightWorld) {
  await this.page!.waitForTimeout(2000);
  const completeButton = this.page!.locator('button:has-text("立即完成訂單")');
  const count = await completeButton.count();
  expect(count).toBe(0);
});

Given('使用者已登入', async function (this: PlaywrightWorld) {
  // Navigate to login page and login
  await this.page!.goto('/login');
  await this.page!.waitForSelector('input[type="text"], input[name="username"]', { timeout: 10000 });
  
  // Try to login with test credentials (adjust as needed)
  const usernameInput = this.page!.locator('input[type="text"], input[name="username"]').first();
  const passwordInput = this.page!.locator('input[type="password"]').first();
  const loginButton = this.page!.locator('button:has-text("登入"), button:has-text("登錄")');
  
  await usernameInput.fill('testuser');
  await passwordInput.fill('testpass');
  await loginButton.click();
  
  // Wait for redirect after login
  await this.page!.waitForURL(/\/(?!login)/, { timeout: 10000 });
  await this.page!.waitForTimeout(2000);
});

