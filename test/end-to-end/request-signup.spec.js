const { test, expect } = require('@playwright/test')

test('Signup Request', async ({ page }) => {
  await page.goto('/signup')
  await expect(page).toHaveURL('/signup')

  await page.locator('input[name=email]').fill('new-person@example.com')
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL('/signup')
  await page.waitForSelector('text="Check the console for link"')
})
