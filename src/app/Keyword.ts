const RESET_SENT = [/^ပြန်စ/, /^reset/i];
const READ_NEWS = [/^(\d+) ပို့ပေးပါ/, /^read (\d+)/i];
const HELP_INFO = [/^အကူအညီ/, /^ကူ(ညီ)?/, /^help/i];
const LATEST_NEWS = [/^ဘာထူးလဲ/, /^သတင်း/, /^news/i];
const ARTICLES_COUNT = [/^(ကျန်|ရှိ)သေးလား/, /^ဒါပဲလား/, /^count/i];

export default class Keyword {
  protected command: boolean;
  protected others: any[];
  protected sent: boolean;

  constructor(public text: string) {}

  onAskHelp(callback: Function) {
    if (HELP_INFO.filter((keyword) => this.meta.match(keyword)).length) {
      callback();
      this.sent = true;
    }
  }

  onAskHeadlines(callback: Function) {
    if (LATEST_NEWS.filter((keyword) => this.meta.match(keyword)).length) {
      callback();
      this.sent = true;
    }
  }

  onAskRead(callback: Function) {
    const index = READ_NEWS.findIndex((keyword) => this.meta.match(keyword));
    if (index === -1) return;
    const matched = this.meta.match(READ_NEWS[index]);
    callback(matched[1]);
    this.sent = true;
  }

  onAskCount(callback: Function) {
    if (ARTICLES_COUNT.filter((keyword) => this.meta.match(keyword)).length) {
      callback(this);
      this.sent = true;
    }
  }

  onAskReset(callback: Function) {
    if (RESET_SENT.filter((keyword) => this.meta.match(keyword)).length) {
      callback(this);
      this.sent = true;
    }
  }

  onUnexisted(callback: Function) {
    this.sent || callback();
  }

  get meta(): string {
    return this.text.substr(0, 64);
  }
}
