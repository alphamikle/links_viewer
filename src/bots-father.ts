import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { Bot } from "./bots/bot";
import { Utils } from "./utils";
import { Config } from "./config";
import { GoogleSheetHandler } from "./google-sheet-handler";
import { ViewBot } from "./bots/view-bot";

export class BotsFather {
  private linksToRows: Map<string, GoogleSpreadsheetRow> = new Map();

  constructor(
    private readonly rows: GoogleSpreadsheetRow[],
    private readonly bots: Bot[],
    private readonly utils: Utils,
    private readonly googleSheetHandler: GoogleSheetHandler,
  ) {
  }

  async doWork(): Promise<void> {
    this.addLinks();
    await this.handleLinks();
  }

  private addLinks(): void {
    this.linksToRows.clear();
    for (const row of this.rows) {
      const link = row[Config.linksCellTitle];
      if (link) {
        this.linksToRows.set(link, row);
      }
    }
  }

  private async handleLinks(): Promise<void> {
    for (const link of this.linksToRows.keys()) {
      const row = this.linksToRows.get(link) as GoogleSpreadsheetRow;
      await this.handleLink(link, row);
    }
  }

  private async handleLink(link: string, row: GoogleSpreadsheetRow) {
    const nickname = this.utils.loadCredentials<string>('nickname');
    if (!nickname) {
      throw new Error('Need to fill your nickname at "credentials.json5" file');
    }
    try {
      const bot = this.getBotForLink(link);
      await bot.loadCredentials();
      await bot.openPage(link);
      await bot.scrollDown();
      await bot.like();
      await bot.subscribe();
      await bot.close();
      if (!(bot instanceof ViewBot)) {
        await this.googleSheetHandler.makeRowVisitedByBot(row, nickname);
      }
    } catch (error) {
      console.log(error.toString());
    }
  }

  private getBotForLink(link: string): Bot {
    const bot = this.bots.find(bot => bot.canWorkWithLink(link));
    if (bot === undefined) {
      throw new Error(`Not found bot for link ${link}`);
    }
    return bot;
  }
}