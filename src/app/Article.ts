import axios from "axios";
import DB from "./DB";

export default class Article {
  public id: string;
  public title: string;
  public content: string;
  public source: string;
  public link: string;
  public image: string;
  public datetime: Date;

  constructor({ id, content, source, datetime, title, link, image }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.source = source;
    this.link = link;
    this.datetime = new Date(datetime);
  }

  static fetch(): Promise<Article[]> {
    return axios
      .get(
        'https://rtdb.nweoo.com/v1/articles.json?orderBy="timestamp"&limitToLast=20'
      )
      .then(({ data }) => data);
  }

  static store(articles: Article[]) {
    const db = DB.read();
    db["articles"] = articles;
    DB.save(db);
  }
}
