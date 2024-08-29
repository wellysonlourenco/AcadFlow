import puppeteer from 'puppeteer';

export async function getPdf(html: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  console.log('PDF gerado, tamanho:', pdf.length); // Log para depuração
  return pdf;
}
