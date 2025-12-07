import { test, expect } from '@playwright/test';

test.describe('用戶認證功能', () => {
  // 1. 核心功能：註冊
  test('應該能夠成功註冊新用戶', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    // 填寫註冊表單
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶');
    await page.locator('[data-testid="register-username-input"]').fill('testuser' + Date.now());
    await page.locator('[data-testid="register-password-input"]').fill('testpass123');
    
    // 點擊註冊按鈕
    await page.locator('[data-testid="register-submit-button"]').click();
    
    // 等待成功訊息或跳轉到登入頁面
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('/login');
  });

  // 2. 核心功能：登入
  test('應該能夠成功登入', async ({ page }) => {
    // 先註冊一個用戶
    const username = 'testuser' + Date.now();
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶');
    await page.locator('[data-testid="register-username-input"]').fill(username);
    await page.locator('[data-testid="register-password-input"]').fill('testpass123');
    await page.locator('[data-testid="register-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    // 登入
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="login-username-input"]').fill(username);
    await page.locator('[data-testid="login-password-input"]').fill('testpass123');
    await page.locator('[data-testid="login-submit-button"]').click();
    
    // 等待跳轉到首頁
    await page.waitForURL('/', { timeout: 10000 });
    expect(page.url()).toMatch(/\/$/);
  });

  // 3. 核心功能：登出
  test('應該能夠成功登出', async ({ page }) => {
    // 先登入
    const username = 'testuser' + Date.now();
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶');
    await page.locator('[data-testid="register-username-input"]').fill(username);
    await page.locator('[data-testid="register-password-input"]').fill('testpass123');
    await page.locator('[data-testid="register-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="login-username-input"]').fill(username);
    await page.locator('[data-testid="login-password-input"]').fill('testpass123');
    await page.locator('[data-testid="login-submit-button"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // 點擊登出按鈕
    await page.locator('[data-testid="logout-button"]').click();
    await page.waitForTimeout(1000);
    
    // 應該被導航到登入頁面
    await page.waitForURL('/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  // 4. 核心功能：登入失敗
  test('錯誤密碼應該顯示錯誤訊息', async ({ page }) => {
    // 先註冊
    const username = 'testuser' + Date.now();
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶');
    await page.locator('[data-testid="register-username-input"]').fill(username);
    await page.locator('[data-testid="register-password-input"]').fill('testpass123');
    await page.locator('[data-testid="register-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    // 使用錯誤密碼登入
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="login-username-input"]').fill(username);
    await page.locator('[data-testid="login-password-input"]').fill('wrongpassword');
    await page.locator('[data-testid="login-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    // 應該顯示錯誤訊息
    const errorMessage = page.locator('text=/錯誤|失敗|Invalid/');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  // 5. 核心功能：註冊失敗（帳號已存在）
  test('重複帳號應該顯示錯誤訊息', async ({ page }) => {
    const username = 'testuser' + Date.now();
    
    // 第一次註冊
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶1');
    await page.locator('[data-testid="register-username-input"]').fill(username);
    await page.locator('[data-testid="register-password-input"]').fill('testpass123');
    await page.locator('[data-testid="register-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    // 嘗試用相同帳號再次註冊
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="register-name-input"]').fill('測試用戶2');
    await page.locator('[data-testid="register-username-input"]').fill(username);
    await page.locator('[data-testid="register-password-input"]').fill('testpass456');
    await page.locator('[data-testid="register-submit-button"]').click();
    await page.waitForTimeout(2000);
    
    // 應該顯示錯誤訊息
    const errorMessage = page.locator('text=/已存在|already exists|帳號已存在/');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});
