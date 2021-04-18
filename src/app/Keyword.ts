const RESET_SENT = [/ပြန်စ/, /^reset/i];
const LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
const ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /ဒါပဲလား/, /count/i];
const USAGE_HELP = [/ကူညီ/, /help/i];
const SHOW_INFO = [/info/i];
const SEARCH_CONTENT = [/^["'](.+)['"]$/];
const IGNORE_KEYWORDS = [/nweoo\.com/i, /(0|\+95)9758035929/];
const ASK_REPORTER = [/သတင်း(တွေ)?(ပေး|ပို့)/];
const ANSWER_OKAY = [/ok/i];
const ANSWER_THANKS = [/th(?:ank|z|x)/i, /ကျေးဇူး/];
const INTRODUCION = [
  /^hi/i,
  /^hello/i,
  /^mornee/i,
  /^good (morining|evening|night)/i,
  /^မင်္ဂလာ/,
  /^ဟယ်လို/,
  /^မောနင်း/,
];
const READ_ARTICLE = [
  /^read [\{\<\[\('"]?(\d+)["'\)\]\>\}]?/i,
  /^[\{\<\[\('"]?(\d{5,7})["'\)\]\>\}]?/,
];

export default class Keyword {
  protected sent: boolean;

  constructor(public text: string) {}

  get meta(): string {
    return this.text.substr(0, 64);
  }

  onIgnore(callback: Function) {
    if (this.sent) return;
    if (IGNORE_KEYWORDS.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onReplyThanks(callback: Function) {
    if (this.sent) return;
    if (ANSWER_THANKS.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onReplyOkay(callback: Function) {
    if (this.sent) return;
    if (ANSWER_OKAY.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onCommonMistake(callback: Function) {
    if (this.sent) return;
    if (INTRODUCION.filter((keyword) => this.meta.match(keyword)).length) {
      this.sent = true;
      callback();
    }
  }

  onUnmatched(callback: Function) {
    if (this.sent) return;
    this.sent = true;
    callback();
  }

  onSearchContent(callback: Function) {
    if (this.sent) return;
    let matched: any = SEARCH_CONTENT.filter((keyword) =>
      this.text.match(keyword)
    );
    matched = matched.pop();
    if (matched) {
      matched = this.text.match(matched);
      this.sent = true;
      callback(matched[1]);
    }
  }

  onAskReporter(callback: Function) {
    if (this.sent) return;
    if (ASK_REPORTER.filter((keyword) => this.meta.match(keyword)).length) {
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

  onAskRead(callback: Function) {
    if (this.sent) return;
    let matched: any = READ_ARTICLE.filter((keyword) =>
      this.meta.match(keyword)
    );
    matched = matched.pop();
    if (matched) {
      matched = this.text.match(matched);
      this.sent = true;
      callback(matched[1]);
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
