import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { Bot } from "./bots/bot";
import { ViewBot } from "./bots/view-bot";

export class Liker {
  private links: string[] = [];

  constructor(
    private rows: GoogleSpreadsheetRow[],
    private readonly bots: Bot[],
  ) {
  }

  async doWork(): Promise<void> {
    this.addLinks();
    await this.handleLinks();
  }

  private addLinks(): void {
    this.links = [];
    for (const row of this.rows) {
      this.links.push(row['']);
    }
  }

  private async handleLinks(): Promise<void> {
    for (const link of this.links) {
      await this.handleLink(link);
    }
  }

  private async handleLink(link: string) {
    const bot = this.getBotForLink(link);
    await bot.loadCredentials();
    await bot.openPage(link);
    await bot.like();
    await bot.subscribe();
    await bot.scrollDown();
    await bot.close();
  }

  private getBotForLink(link: string): Bot {
    const bot = this.bots.find(bot => bot.canWorkWithLink(link));
    if (bot === undefined) {
      return this.bots.find(bot => bot instanceof ViewBot) as ViewBot;
    }
    return bot;
  }
}