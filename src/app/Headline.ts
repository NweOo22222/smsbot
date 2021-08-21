import axios from "axios";
import DB from "./DB";

export default class Headline {
  public id: string;
  public title: string;
  public source: string;
  public timestamp: number;
  public createdAt: Date;

  constructor({ id, source, timestamp, createdAt, title }) {
    this.id = id;
    this.title = String(title).replace(/ /gm, "");
    this.source = source;
    this.timestamp = timestamp;
    this.createdAt = new Date(createdAt);
  }

  static find(id) {
    return DB.read()["articles"].find((article) => article["id"] == id);
  }

  static store(headlines: Headline[]) {
    const db = DB.read();
    db["articles"] = headlines;
    DB.save(db);
  }

  static latest(limit = null, diff = []): Headline[] {
    const articles = (DB.read()["articles"] || [])
      .map((article) => new Headline(article))
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter(
        (headline) =>
          !headline.title.match(/(?:\((?:ရုပ်သံ|ဆောင်းပါး)\)|ကာတွန်း\()/) &&
          !diff.includes(headline["id"])
      );
    if (limit === null) {
      return articles;
    }
    return limit > 0 ? articles.slice(0, limit) : [];
  }
}
