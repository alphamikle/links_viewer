import { Bot, Credentials } from "./bot";
import { Utils } from "../utils";
import { Puppy } from "../puppy";

export class HabrBot extends Bot {
  credentials!: Credentials;
  credentialsCode: string = 'habr';

  private readonly upArrowSelector = '.voting-wjt__button';
  private readonly upArrowSelectedSelector = '.voting-wjt__button_plus';
  private readonly userProfileLinkSelector = '.post__user-info.user-info';

  constructor(
    protected readonly utils: Utils,
    protected readonly puppy: Puppy,
  ) {
    super(utils, puppy);
  }

  async openPage(link: string): Promise<void> {
    await super.openPage(link);
    await this.auth();
  }

  async like(): Promise<void> {
    await this.clickOnUpArrow();
    await this.upKarma();
  }

  async subscribe(): Promise<void> {
    // DO NOTHING
  }

  canWorkWithLink(link: string): boolean {
    return link.includes('habr');
  }

  private async auth(): Promise<void> {
    const loginButtonSelector = '#login';
    const emailInputSelector = '#email_field';
    const passwordInputSelector = '#password_field';
    const submitButtonSelector = '#login_form > fieldset > div.form__buttons.s-buttons > button';
    const searchButtonSelector = '#search-form-btn';

    const isLoginButtonExist = await this.page.$(loginButtonSelector);
    if (isLoginButtonExist) {
      await this.page.waitForSelector(loginButtonSelector);
      await this.utils.wait();
      await this.page.click(loginButtonSelector);
      await this.page.waitForSelector(emailInputSelector);
      await this.utils.wait();
      await this.page.click(emailInputSelector);
      await this.page.type(emailInputSelector, this.credentials.login, { delay: this.utils.randomBetween(40, 60) });
      await this.page.click(passwordInputSelector);
      await this.page.type(passwordInputSelector, this.credentials.password, { delay: this.utils.randomBetween(40, 60) });
      await this.utils.wait();
      await this.page.click(submitButtonSelector);
      await this.page.waitForSelector(searchButtonSelector);
    }
  }

  private async clickOnUpArrow() {
    const selectedArrow = await this.page.$(this.upArrowSelectedSelector);
    const unselectedArrow = await this.page.$(this.upArrowSelector);
    if (!selectedArrow && unselectedArrow) {
      await this.utils.scrollToSelector(this.page, this.upArrowSelector);
      await this.utils.wait();
      await this.page.click(this.upArrowSelector);
      await this.utils.wait();
    }
  }

  private async upKarma() {
    const userProfileButton = await this.page.$(this.userProfileLinkSelector);
    if (userProfileButton) {
      await this.utils.scrollToSelector(this.page, this.userProfileLinkSelector);
      await this.utils.wait(1000);
      await this.page.click(this.userProfileLinkSelector);
      await this.utils.wait(3000);
    }
    await this.clickOnUpArrow();
  }
}