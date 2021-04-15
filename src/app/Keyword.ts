const RESET_COMMAND = [/^\.reset/];
const UPDATE_COMMAND = [/^\.update/];
const RESET_SENT = [/ပြန်စ/, /^reset/i];
const LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
const ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /ဒါပဲလား/, /count/i];
const USAGE_HELP = [/ကူ(ညီ)?/, /help/i];
const SHOW_INFO = [/info/i];

export default class Keyword {
  protected sent: boolean;

  constructor(public text: string) {}

  get meta(): string {
    return this.text.substr(0, 64);
  }

  onAskHelp(callback: Function) {
    if (this.sent) return;
    if (USAGE_HELP.filter((keyword) => this.meta.match(keyword)).length) {
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

  onAskInfo(callback: Function) {
    if (this.sent) return;
    if (SHOW_INFO.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onReset(callback: Function) {
    if (this.sent) return;
    if (RESET_COMMAND.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onUpdate(callback: Function) {
    if (this.sent) return;
    if (UPDATE_COMMAND.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onUnexisted(callback: Function) {
    if (this.sent) return;
    this.sent = true;
    callback();
  }
}
