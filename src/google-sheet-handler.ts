import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import * as credentials from "../service_account_credentials.json";

export class GoogleSheetLoader {
  private readonly sheetId = '1HBfHxP9RIvtejR0wk04JGt-Xn6q8CsJ9LTNeYb0hnPI';
  private readonly tableIndex = 1;

  async loadRows(): Promise<GoogleSpreadsheetRow[]> {
    const table = new GoogleSpreadsheet(this.sheetId);
    await table.useServiceAccountAuth(credentials);
    await table.loadInfo();
    const sheet = await table.sheetsByIndex[this.tableIndex];
    return await sheet.getRows();
  }
}