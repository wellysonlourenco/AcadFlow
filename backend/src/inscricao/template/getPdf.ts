import puppeteer from 'puppeteer';

export async function getPdf(html: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('screen')

  const pdf = await page.pdf({ format: 'A4', printBackground: true, });
  await browser.close();
  //console.log('PDF gerado, tamanho:', pdf.length); // Log para depuração
  return pdf;
}
