import puppeteer from 'puppeteer';

export async function getPdf(html: string): Promise<Uint8Array> {

  console.log('Iniciando geração de PDF...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: null
  })
  console.log('Navegador iniciado');

  try {
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' })

    await page.emulateMediaType('screen')

    const file = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
    })

    return file
  } finally {
    console.log('PDF gerado com sucesso');

    await browser.close()
  }
}