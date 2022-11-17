const { test, expect } = require('@playwright/test')
const magiclink = process.env.PLAYWRIGHT_MAGICLINK

test('Signup link validates', async ({ page }) => {
  await page.goto(magiclink)
  await expect(page).toHaveURL('/auth/register')

  await page.locator('input[name=firstname]').fill('new')
  await page.locator('input[name=lastname]').fill('person')
  await page.locator('text="Save"').click()
  await expect(page).toHaveURL('/auth/welcome')
  await page.waitForSelector('text="Welcome New Account new-person@example.com you are Logged In."')

  await page.goto('/example-auth')
  await expect(page).toHaveURL('/example-auth') // should be the after redirect location
  await expect(page).toBeDefined()

  await page.goto('/accounts')
  await expect(page).toHaveURL('/')
  await page.goto('/roles')
  await expect(page).toHaveURL('/')

  await page.goto('/example-auth')
  const logout = await page.waitForSelector('form[action="/logout"]>button')
  await logout.click()
  await page.goto('/example-auth')
  await expect(page).toHaveURL('/login')
})
