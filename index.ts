import { launch, Page } from 'puppeteer';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import * as credentials from './service_account_credentials.json';

const tableId = '1HBfHxP9RIvtejR0wk04JGt-Xn6q8CsJ9LTNeYb0hnPI';
const links: string[] = [];

const proxy: { [ip: string]: number } = {
  // '142.93.87.85': 8899, // slow, but
  // '89.185.228.233': 3128,
  // '109.86.219.179': 53438,
  // '179.96.28.58': 80,
  // '180.179.98.22': 3128,
  // '139.99.105.185': 80,
  // '148.251.20.79': 8080,
  // '89.39.100.173': 31041,
  // '115.75.1.184': 8118,
  // '51.75.147.43': 3128,
  // '154.79.248.124': 57853,
};

async function main(): Promise<void> {
  const table = new GoogleSpreadsheet(tableId);
  await table.useServiceAccountAuth(credentials);
  await table.loadInfo();
  const sheet = await table.sheetsByIndex[0];
  const rows = await sheet.getRows();
  for (const row of rows) {
    const link = row.link;
    const target = Number(row.target);
    const current = Number(row.current || 0);
    addLink(link, target, current);
  }
  shuffle(links);
  for (const link of links) {
    const browser = await launch({
      headless: false,
      defaultViewport: {
        height: randomBetween(800, 1200),
        width: randomBetween(500, 1200),
      },
      args: [
        getRandomProxy(),
      ]
    });
    const targetRow = rows.find(row => row.link === link) as GoogleSpreadsheetRow;
    const page = await browser.newPage();
    await page.goto(link);
    await autoScroll(page);
    await wait(randomBetween(200, 400));
    await page.close();
    await browser.close();
    const current = Number(targetRow.current || 0);
    targetRow.current = current + 1;
    await targetRow.save();
    console.log(`Link ${link} was viewed. Counter was changed from ${current} to ${targetRow.current}. Target views are ${targetRow.target}`);
  }
}

function addLink(link: string, target: number, current: number): void {
  const diff = Math.max(target - current, 1);
  for (let i = 0; i < diff; i++) {
    links.push(link);
  }
}

async function wait(milliseconds = 300): Promise<void> {
  await new Promise(res => setTimeout(res, milliseconds));
}

function randomBetween(from: number, to: number): number {
  return Math.floor(Math.random() * to) + from;
}

async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(0);
        }
      }, 60);
    });
  });
}

function shuffle(array: any[]): void {
  array.sort(() => randomBetween(-0.5, 0.5));
}

function getRandomProxy(): string {
  const ips = Object.keys(proxy);
  if (ips.length === 0) {
    return '';
  }
  shuffle(ips);
  const ip = ips[0];
  const port = proxy[ip];
  return `--proxy-server=${ip}:${port}`;
}

main().then(() => {
  console.log('All is done');
  process.exit(0);
});