import axios from "axios";
import DB from "./DB";

export default class Headline {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ id, source, datetime, timestamp, title }) {
    this.id = id;
    this.title = String(title).replace(/ /gm, "");
    this.source = source;
    this.datetime = new Date(datetime || parseInt(timestamp) || Date.now());
  }

  static find(id) {
    return DB.read()["articles"].find((article) => article["id"] == id);
  }

  static fetch(): Promise<Headline[]> {
    return axios
      .get("https://api.nweoo.com/news/headlines?limit=30")
      .then(({ data }) => {
        const articles = [];
        for (const entry of Object.entries(data)) {
          articles.push({ id: entry[0], ...Object(entry[1]) });
        }
        return articles
          .map((article) => new Headline(article))
          .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
      });
  }

  static store(headlines: Headline[]) {
    const db = DB.read();
    db["articles"] = headlines;
    DB.save(db);
  }

  static latest(limit = null, diff = []): Headline[] {
    const articles = (DB.read()["articles"] || [])
      .map((article) => new Headline(article))
      .sort((a, b) => b.datetime - a.datetime)
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
