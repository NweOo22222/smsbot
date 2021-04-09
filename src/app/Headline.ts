import DB from "./DB";

export default class Headline {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ source, id, datetime, title }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.datetime = new Date(datetime);
  }

  static filter(headlines: Headline[]) {
    const articles = DB.read()["articles"];
    return headlines.filter(
      ({ id }) => articles.findIndex(({ id: _id }) => id !== _id) === -1
    );
  }

  static exclude(headlines: Headline[], sent = []) {
    return headlines.filter(({ id }) => !sent.find((_id) => _id == id));
  }

  static latest(limit = 0, diff = []): Headline[] {
    const articles = DB.read()
      ["articles"].map((article) => new Headline(article))
      .sort((a, b) => b.datetime > a.datetime)
      .filter((headline) => !diff.includes(headline["id"]));
    return limit ? articles.reverse().slice(0, limit) : articles.reverse();
  }
}
