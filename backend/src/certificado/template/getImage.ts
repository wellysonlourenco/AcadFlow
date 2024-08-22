import puppeteer from 'puppeteer'

export async function getImage(html: string) {
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()

  await page.setContent(html)
  await page.setViewport({ width: 800, height: 566 })

  const file = await page.screenshot({ type: 'jpeg' })

  await browser.close()

  return file
}