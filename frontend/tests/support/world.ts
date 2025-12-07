import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export interface CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseURL: string;
}

export class PlaywrightWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseURL: string;

  constructor(options: IWorldOptions) {
    super(options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.baseURL = (options.parameters as any).baseURL || 'http://localhost:3000';
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.CI === 'true',
    });
    this.context = await this.browser.newContext({
      baseURL: this.baseURL,
    });
    this.page = await this.context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(PlaywrightWorld);
