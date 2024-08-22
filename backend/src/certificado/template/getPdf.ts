import puppeteer from 'puppeteer'

export async function getPdf(html: string) {
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  await page.emulateMediaType('screen')

  const file = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
  })

  await browser.close()

  return file
}
