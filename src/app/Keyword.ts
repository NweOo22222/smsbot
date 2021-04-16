const RESET_SENT = [/ပြန်စ/, /^reset/i];
const LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
const ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /ဒါပဲလား/, /count/i];
const USAGE_HELP = [/ကူ(ညီ)?/, /info/i, /help/i];
const SHOW_INFO = [/info/i];
const THANKS = [/th(?:ank|z|x)/i, /ကျေးဇူး/];
const REPORTER = [/သတင်း(တွေ)?(ပေး|ပို့)/];

export default class Keyword {
  protected sent: boolean;

  constructor(public text: string) {}

  get meta(): string {
    return this.text.substr(0, 64);
  }

  onThanks(callback: Function) {
    if (this.sent) return;
    if (THANKS.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onUnexisted(callback: Function) {
    if (this.sent) return;
    this.sent = true;
    callback();
  }

  onAskReporter(callback: Function) {
    if (this.sent) return;
    if (REPORTER.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
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
}
