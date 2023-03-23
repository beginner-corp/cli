const { test, expect } = require('@playwright/test')
const magiclink = process.env.PLAYWRIGHT_MAGICLINK

test('Magic Link validates', async ({ page }) => {
  await page.goto(magiclink)
  await expect(page).toHaveURL('/example-auth') // should be the after redirect location

  await expect(page).toBeDefined()

  await page.goto('/accounts')
  await expect(page).toHaveURL('/accounts')
  await page.waitForSelector('text="admin@example.com"')

  await page.goto('/accounts')
  await expect(page).toHaveURL('/accounts')

  await page.goto('/example-auth')
  const logout = await page.waitForSelector('form[action="/logout"]>button')
  await logout.click()
  await page.goto('/example-auth')
  await expect(page).toHaveURL('/login')

})
