const { test, expect } = require('@playwright/test')

test('Request a Magic Link', async ({ page }) => {
  await page.goto('/')
  await expect(page).toBeDefined()
  await expect(page).toHaveURL('/')

  await page.goto('/accounts') // should redirect to root
  await expect(page).toHaveURL('/')
  await page.goto('/example-auth') // should redirect to login
  await expect(page).toHaveURL('/login')

  await page.locator('input[name=email]').fill('admin@example.com')
  await page.keyboard.press('Enter')

  // Expects the URL to contain intro.
  await expect(page).toHaveURL('/login')
  await page.waitForSelector('text="Check the console for link"')

})
