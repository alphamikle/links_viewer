import { Utils } from "./utils";

export interface Params {
  [key: string]: any;
}

export class Config {
  private params: Map<string, any> = new Map();

  private static instance: Config;

  constructor(
    private readonly utils: Utils,
  ) {
    this.init();
    Config.instance = this;
  }

  private init(): void {
    this.params.clear();
    const paramsPath = this.utils.resolvePath(__dirname, '..', 'config.json5');
    const params = this.utils.loadJson5<Params>(paramsPath);
    for (const key of Object.getOwnPropertyNames(params)) {
      const value = params[key];
      this.params.set(key, value);
    }
  }

  static get sheetId(): string {
    return Config.instance.params.get('sheetId');
  }

  static get tableIndex(): number {
    return Config.instance.params.get('tableIndex');
  }

  static get linksCellTitle(): string {
    return Config.instance.params.get('linksCellTitle');
  }

  static get botCellTitle(): string {
    return Config.instance.params.get('botCellTitle');
  }

  static get headless(): boolean {
    return Config.instance.params.get('headless');
  }

  static get timeout(): number {
    return Config.instance.params.get('timeout');
  }
}