const { devices } = require('@playwright/test')

const config = {
  // webServer: {
  //   command: 'cd mock && rm -rf tmp-mock && node ../../../src/index.js new tmp-mock && cd tmp-mock && node ../../../../src/index.js generate auth && npx sandbox',
  //   url: 'http://localhost:3333',
  // },
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3333',
  },
  testDir: './',
  timeout: 60 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

  ],

}

module.exports = config
