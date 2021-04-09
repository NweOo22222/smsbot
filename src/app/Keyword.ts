const UPDATE = [/^\.update/];
const RESET_SENT = [/^ပြန်စ/, /^reset/i];
const READ_NEWS = [
  /^(\d+) ?(?:ကို)?ပို့(?:ပေးပါ)?/,
  /^(\d+) ?(?:ကို)?ဖတ်(?:ရန်)?/,
  /^read ?(\d+)/i,
  /^read ?[\[<("'#](\d+)['")>\]]/i,
  /^(\d+)$/,
];
const LATEST_NEWS = [/^ဘာထူးလဲ/, /^သတင်း/, /^news/i];
const ARTICLES_COUNT = [/^(ကျန်|ရှိ)သေးလား/, /^ဒါပဲလား/, /^count/i];
const HELP_INFO = [/^အကူအညီ/, /^ကူ(ညီ)?/, /^help/i, /^info/i];

export default class Keyword {
  protected sent: boolean;

  constructor(public text: string) {}

  onAskHelp(callback: Function) {
    if (this.sent) return;
    if (HELP_INFO.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onAskHeadlines(callback: Function) {
    if (this.sent) return;
    if (LATEST_NEWS.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onAskRead(callback: Function) {
    if (this.sent) return;
    const index = READ_NEWS.findIndex((keyword) => this.meta.match(keyword));
    if (index === -1) return;
    const matched = this.meta.match(READ_NEWS[index]);
    this.sent = true;
    callback(matched[1]);
  }

  onAskCount(callback: Function) {
    if (this.sent) return;
    if (ARTICLES_COUNT.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback(this);
    }
  }

  onAskReset(callback: Function) {
    if (this.sent) return;
    if (RESET_SENT.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback(this);
    }
  }

  onUpdate(callback: Function) {
    if (this.sent) return;
    if (UPDATE.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onUnexisted(callback: Function) {
    if (this.sent) return;
    this.sent = true;
    callback();
  }

  get meta(): string {
    return this.text.substr(0, 64);
  }
}
