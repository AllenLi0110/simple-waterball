import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

// 註冊相關步驟
Given('我訪問註冊頁面', async function (this: PlaywrightWorld) {
  await this.page!.goto('/register');
  await this.page!.waitForLoadState('networkidle');
});

When('我輸入名字 {string}', async function (this: PlaywrightWorld, name: string) {
  const nameInput = this.page!.locator('[data-testid="register-name-input"]');
  await nameInput.fill(name);
});

When('我輸入帳號 {string}', async function (this: PlaywrightWorld, username: string) {
  // 判斷是在註冊頁面還是登入頁面
  const registerUsernameInput = this.page!.locator('[data-testid="register-username-input"]');
  const loginUsernameInput = this.page!.locator('[data-testid="login-username-input"]');
  
  if (await registerUsernameInput.count() > 0) {
    await registerUsernameInput.fill(username);
  } else if (await loginUsernameInput.count() > 0) {
    await loginUsernameInput.fill(username);
  }
});

When('我輸入密碼 {string}', async function (this: PlaywrightWorld, password: string) {
  // 判斷是在註冊頁面還是登入頁面
  const registerPasswordInput = this.page!.locator('[data-testid="register-password-input"]');
  const loginPasswordInput = this.page!.locator('[data-testid="login-password-input"]');
  
  if (await registerPasswordInput.count() > 0) {
    await registerPasswordInput.fill(password);
  } else if (await loginPasswordInput.count() > 0) {
    await loginPasswordInput.fill(password);
  }
});

When('我點擊註冊按鈕', async function (this: PlaywrightWorld) {
  const registerButton = this.page!.locator('[data-testid="register-submit-button"]');
  await registerButton.click();
  await this.page!.waitForTimeout(1000); // 等待 API 響應
});

Then('我應該看到註冊成功訊息', async function (this: PlaywrightWorld) {
  const successMessage = this.page!.locator('text=註冊成功');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
});

Then('我應該被導航到登入頁面', async function (this: PlaywrightWorld) {
  await this.page!.waitForURL('/login', { timeout: 10000 });
  const url = this.page!.url();
  expect(url).toContain('/login');
});

// 登入相關步驟
Given('我訪問登入頁面', async function (this: PlaywrightWorld) {
  await this.page!.goto('/login');
  await this.page!.waitForLoadState('networkidle');
});

When('我點擊登入按鈕', async function (this: PlaywrightWorld) {
  const loginButton = this.page!.locator('[data-testid="login-submit-button"]');
  await loginButton.click();
  await this.page!.waitForTimeout(1000); // 等待 API 響應
});

Then('我應該看到登入成功訊息', async function (this: PlaywrightWorld) {
  const successMessage = this.page!.locator('text=登入成功');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
});

Then('我應該被導航到首頁', async function (this: PlaywrightWorld) {
  await this.page!.waitForURL('/', { timeout: 10000 });
  const url = this.page!.url();
  expect(url).toMatch(/\/$/);
});

Then('我應該看到登入失敗訊息', async function (this: PlaywrightWorld) {
  // 等待錯誤訊息出現（可能是 "Invalid username or password" 或其他錯誤訊息）
  const errorMessage = this.page!.locator('text=/錯誤|失敗|Invalid|錯誤的帳號或密碼/');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

// 登出相關步驟
Given('我已經登入系統', async function (this: PlaywrightWorld) {
  // 先註冊一個用戶
  await this.page!.goto('/register');
  await this.page!.waitForLoadState('networkidle');
  
  await this.page!.locator('[data-testid="register-name-input"]').fill('測試用戶');
  await this.page!.locator('[data-testid="register-username-input"]').fill('testuser');
  await this.page!.locator('[data-testid="register-password-input"]').fill('testpass123');
  await this.page!.locator('[data-testid="register-submit-button"]').click();
  await this.page!.waitForTimeout(2000);
  
  // 登入
  await this.page!.goto('/login');
  await this.page!.waitForLoadState('networkidle');
  await this.page!.locator('[data-testid="login-username-input"]').fill('testuser');
  await this.page!.locator('[data-testid="login-password-input"]').fill('testpass123');
  await this.page!.locator('[data-testid="login-submit-button"]').click();
  await this.page!.waitForTimeout(2000);
  
  // 確認已登入（應該在首頁）
  await this.page!.waitForURL('/', { timeout: 10000 });
});

When('我點擊登出按鈕', async function (this: PlaywrightWorld) {
  const logoutButton = this.page!.locator('[data-testid="logout-button"]');
  await logoutButton.click();
  await this.page!.waitForTimeout(1000);
});

Then('我應該看到登出成功訊息', async function (this: PlaywrightWorld) {
  // 登出後應該被導航到登入頁面，這表示登出成功
  await this.page!.waitForURL('/login', { timeout: 10000 });
});

// 預先註冊用戶的步驟
Given('我已經註冊了帳號 {string} 密碼 {string}', async function (this: PlaywrightWorld, username: string, password: string) {
  await this.page!.goto('/register');
  await this.page!.waitForLoadState('networkidle');
  
  await this.page!.locator('[data-testid="register-name-input"]').fill('測試用戶');
  await this.page!.locator('[data-testid="register-username-input"]').fill(username);
  await this.page!.locator('[data-testid="register-password-input"]').fill(password);
  await this.page!.locator('[data-testid="register-submit-button"]').click();
  await this.page!.waitForTimeout(2000);
  
  // 確認註冊成功（應該被導航到登入頁面）
  await this.page!.waitForURL('/login', { timeout: 10000 });
});

Then('我應該看到帳號已存在錯誤訊息', async function (this: PlaywrightWorld) {
  // 等待錯誤訊息出現（可能是 "Username already exists" 或其他錯誤訊息）
  const errorMessage = this.page!.locator('text=/已存在|already exists|帳號已存在/');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});
