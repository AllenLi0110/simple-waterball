module.exports = {
  default: {
    requireModule: 'ts-node/register',
    require: [
      'tests/step-definitions/common.steps.ts',
      'tests/step-definitions/course-list.steps.ts',
      'tests/step-definitions/course-detail.steps.ts',
      'tests/support/world.ts',
      'tests/support/hooks.ts'
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'message:reports/cucumber-report.ndjson'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    paths: ['specs/features/**/*.feature'],
    worldParameters: {
      baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'
    },
    parallel: 0
  }
};
