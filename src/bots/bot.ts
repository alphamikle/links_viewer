import { Utils } from "../utils";
import { Page } from "puppeteer";
import { Puppy } from "../puppy";
import Timeout = NodeJS.Timeout;
import { Config } from "../config";

export interface IBot {
  // login and password for bot auth
  credentials: Credentials;

  // key of object, which contains credentials in credentials.json5 file
  credentialsCode: string;

  // ? First step
  // logic for loading credentials; see habr-bot for example
  loadCredentials(): void;

  // ? Second step
  // logic for opening bot page
  openPage(link: string): Promise<void>;

  // ? Third step
  // logic for view articles of bot
  scrollDown(): Promise<void>;

  // ? Fourth step
  // like logic (clamps in medium)
  like(): Promise<void>;

  // ? Fifth step
  // subscribe (if you want)
  subscribe(): Promise<void>;

  // ? Sixth step
  // logic for closing page
  close(): Promise<void>;

  // logic for handling, which links bot can parse
  canWorkWithLink(link: string): boolean;
}

export interface Credentials {
  login: string;
  password: string;
}

export abstract class Bot implements IBot {
  protected page!: Page;
  protected link!: string;
  private timer?: Timeout;

  protected constructor(
    protected readonly utils: Utils,
    protected readonly puppy: Puppy,
  ) {
  }

  abstract credentials: Credentials;
  abstract credentialsCode: string;

  loadCredentials(): void {
    this.credentials = this.utils.loadCredentials<Credentials>(this.credentialsCode);
  }

  async openPage(link: string): Promise<void> {
    this.utils.logBot(link);
    this.link = link;
    this.page = await this.puppy.openPage();
    this.forcedClosing();
    await this.page.goto(link);
    this.cancelForcedClosing();
  }

  async scrollDown(): Promise<void> {
    if (this.page !== undefined) {
      await this.utils.scrollToBottom(this.page);
      await this.utils.wait(1000);
    }
  }

  abstract like(): Promise<void>;

  abstract subscribe(): Promise<void>;

  async close(): Promise<void> {
    await this.puppy.closePage(this.page);
  }

  abstract canWorkWithLink(link: string): boolean;

  private forcedClosing() {
    this.timer = setTimeout(async () => {
      if (this.timer !== undefined) {
        await this.close();
        this.timer = undefined;
      }
    }, Config.timeout * 1000);
  }

  private cancelForcedClosing() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}