import { Bot, Credentials } from "./bot";
import { Utils } from "../utils";
import { Puppy } from "../puppy";

// ? Fallback simple bot only for view and scroll down logic
export class ViewBot extends Bot {
  credentials!: Credentials;
  credentialsCode: string = '';

  constructor(
    protected readonly utils: Utils,
    protected readonly puppy: Puppy,
  ) {
    super(utils, puppy);
  }

  loadCredentials(): void {
    // DO NOTHING
  }

  async like(): Promise<void> {
    // DO NOTHING
  }

  async subscribe(): Promise<void> {
    // DO NOTHING
  }

  canWorkWithLink(link: string): boolean {
    const supportedLinks: string[] = [
      'medium',
      'tproger',
      'itnext',
      'towardsdatascience',
    ];
    return supportedLinks.some(supportedLink => link.includes(supportedLink));
  }
}