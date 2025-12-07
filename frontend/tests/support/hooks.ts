import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { PlaywrightWorld } from './world';

BeforeAll(async function () {
  // Global setup if needed
});

AfterAll(async function () {
  // Global teardown if needed
});

Before(async function (this: PlaywrightWorld) {
  await this.init();
});

After(async function (this: PlaywrightWorld) {
  await this.cleanup();
});
