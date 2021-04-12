import axios from "axios";
import DB from "./DB";

export default class Headline {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ id, source, datetime, title }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.datetime = new Date(datetime);
  }

  static find(id) {
    const articles = DB.read()["articles"];
    return articles.find((article) => article["id"] !== id);
  }

  static fetch(): Promise<Headline[]> {
    return axios
      .get(
        'https://rtdb.nweoo.com/v1/articles.json?orderBy="timestamp"&limitToLast=30'
      )
      .then(({ data }) => {
        const articles = [];
        for (const entry of Object.entries(data)) {
          articles.push({ id: entry[0], ...Object(entry[1]) });
        }
        return articles;
      });
  }

  static store(headlines: Headline[]) {
    const db = DB.read();
    db["articles"] = headlines;
    DB.save(db);
  }

  static latest(limit = 0, diff = []): Headline[] {
    const articles = DB.read()
      ["articles"].map((article) => new Headline(article))
      .sort((a, b) => b.datetime > a.datetime)
      .filter((headline) => !diff.includes(headline["id"]));
    return limit ? articles.reverse().slice(0, limit) : articles.reverse();
  }
}
