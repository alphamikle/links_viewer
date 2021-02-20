import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import * as credentials from "../service_account_credentials.json";
import { Config } from "./config";

export class GoogleSheetHandler {
  async loadRows(): Promise<GoogleSpreadsheetRow[]> {
    const table = new GoogleSpreadsheet(Config.sheetId);
    await table.useServiceAccountAuth(credentials);
    await table.loadInfo();
    const sheet = await table.sheetsByIndex[Config.tableIndex];
    return await sheet.getRows();
  }

  async makeRowVisitedByBot(row: GoogleSpreadsheetRow, nickname: string) {
    nickname = `${nickname}-bot`;
    const oldValue = row[Config.botCellTitle];
    if (!oldValue) {
      row[Config.botCellTitle] = '';
    }
    const oldValues: string[] = (row[Config.botCellTitle] as string).split(',').map(value => value.trim()).filter(value => value !== nickname);
    oldValues.push(nickname);
    row[Config.botCellTitle] = oldValues.filter(value => value).join(', ');
    await row.save();
  }
}