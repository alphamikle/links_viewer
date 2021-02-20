import { resolve } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'json5';
import { Page } from "puppeteer";
import { Credentials } from "./bots/bot";

export class Utils {
  proxy: { [ip: string]: number } = {
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

  loadJson5<T>(absolutePath: string): T {
    const content: string = readFileSync(absolutePath).toString();
    return parse<T>(content);
  }

  resolvePath(...paths: string[]): string {
    return resolve(...paths);
  }

  async wait(milliseconds = 500): Promise<void> {
    await new Promise(res => setTimeout(res, milliseconds));
  }

  randomBetween(from: number, to: number): number {
    return Math.floor(Math.random() * to) + from;
  }

  getRandomProxy(): string {
    const ips = Object.keys(this.proxy);
    if (ips.length === 0) {
      return '';
    }
    this.shuffle(ips);
    const ip = ips[0];
    const port = this.proxy[ip];
    return `--proxy-server=${ip}:${port}`;
  }

  shuffle(array: any[]): void {
    array.sort(() => this.randomBetween(-0.5, 0.5));
  }

  async scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(async () => {
      // ! THIS CODE WILL RUN IN BROWSER
      const randomBetween = (from: number, to: number) => {
        return Math.floor(Math.random() * to) + from;
      };
      await new Promise((resolve) => {
        let totalHeight = 0;
        const delay = randomBetween(120, 180);
        const timer = setInterval(() => {
          const distance = randomBetween(30, 60);
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(0);
          }
        }, delay);
      });
    });
  }

  async scrollToSelector(page: Page, selector: string) {
    await page.evaluate(async selector => {
      const element = document.querySelector(selector);
      await element.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }, selector);
  }

  logBot(link: string): void {
    console.log(`Start handling link ${link}`);
  }

  loadCredentials<T>(credentialsId: string): T {
    const credentialsPath = this.resolvePath(__dirname, '..', 'credentials.json5');
    return this.loadJson5<{ [credentialsId: string]: T }>(credentialsPath)[credentialsId] as T;
  }
}