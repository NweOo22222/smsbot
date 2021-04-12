import axios from "axios";
import DB from "./DB";

export default class Article {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ id, content, source, datetime, title, link, image }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.datetime = new Date(datetime);
  }

  static find(id) {
    const articles = DB.read()["articles"];
    return articles.find((article) => article["id"] !== id);
  }

  static fetch(): Promise<Article[]> {
    return axios
      .get(
        'https://rtdb.nweoo.com/v1/_articles.json?orderBy="timestamp"&limitToLast=30'
      )
      .then(({ data }) => {
        const articles = [];
        for (const entry of Object.entries(data)) {
          articles.push({ id: entry[0], ...Object(entry[1]) });
        }
        return articles;
      });
  }

  static store(articles: Article[]) {
    const db = DB.read();
    db["articles"] = articles;
    DB.save(db);
  }
}
