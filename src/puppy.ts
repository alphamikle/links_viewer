import { Browser, launch, Page } from "puppeteer";
import { Utils } from "./utils";
import { Config } from "./config";

export class Puppy {
  private browser?: Browser;

  constructor(
    private readonly utils: Utils,
  ) {
  }

  async constructBrowser() {
    this.browser = await launch({
      headless: Config.headless,
      defaultViewport: {
        height: this.utils.randomBetween(800, 1200),
        width: this.utils.randomBetween(900, 1000),
      },
      args: [
        this.utils.getRandomProxy(),
      ]
    });
  }

  async openPage(): Promise<Page> {
    if (this.browser === undefined) {
      throw new Error('Browser is not constructed');
    }
    const page = await this.browser.newPage();
    await page.setCacheEnabled(false);
    return page;
  }

  async closePage(page: Page): Promise<void> {
    if (page !== undefined) {
      await page.close();
    }
  }

  async destroyBrowser() {
    if (this.browser !== undefined) {
      await this.browser.close();
    }
    this.browser = undefined;
  }
}