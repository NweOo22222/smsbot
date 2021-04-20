const RESET_SENT = [/ပြန်စ/, /^reset/i];
const LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
const ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /count/i];
const USAGE_HELP = [/ကူညီ/, /help/i];
const SHOW_INFO = [/info/i];
const SEARCH_CONTENT = [/^(?:search\s?)?["'](.+)['"]$/];
const COMMON_MISTAKES = [
  /hi/i,
  /hello/i,
  /mornee/i,
  /good (morining|evening|night)/i,
  /မင်္ဂလာ/,
  /ဟယ်လို/,
  /မောနင်း/,
  /ဟိုင်း/,
  /nweoo\.com/i,
  /th(?:ank|z|x)/i,
  /ok/i,
  /yes/i,
  /(0|\+95)9758035929/,
  /ကျေးဇူး/,
  /ဟုတ်/,
];
const READ_ARTICLE = [/^read [\{\<\[\('"]?(.+)["'\)\]\>\}]?$/i];

export default class Keyword {
  protected sent: boolean;

  constructor(public text: string) {}

  get meta(): string {
    return this.text.substr(0, 64);
  }

  onCommonMistake(callback: Function) {
    if (this.sent) return;
    if (COMMON_MISTAKES.filter((keyword) => this.meta.match(keyword)).length) {
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
