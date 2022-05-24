import axios from "axios";
import DB from "./DB";
import Headline from "./Headline";

export default class Article {
  public id: string;
  public content: string;
  public image: string;
  public source: string;
  public link: string;
  public title: string;
  public timestamp: number;
  public createdAt: Date;

  constructor({ id, title, content, image, source, timestamp }) {
    this.id = id;
    this.title = String(title)
      .replace(/\((?:ရုပ်သံ|ဓာတ်ပုံ)\)/gm, "")
      .replace(/\s/gm, "");
    this.content = String(content).replace(/\n\n\n\n/gm, "\n");
    this.image = image;
    this.source = source;
    this.timestamp = timestamp;
    this.createdAt = new Date(timestamp);
  }

  find(keyword) {
    return this.content.match(new RegExp(keyword, "gmi"));
  }

  toHeadline() {
    return new Headline({
      id: this.id,
      title: this.title,
      source: this.source,
      timestamp: this.timestamp,
      createdAt: this.createdAt,
    });
  }

  static fetchAll(): Article[] {
    return (DB.read()["full_articles"] || []).map(
      (article) => new Article(article)
    );
  }

  static update(limit: number = 30): Promise<Article[]> {
    return axios
      .get("https://news.nweoo.com/api/news/articles?limit=" + limit)
      .then(({ data }) => (data || []).map((article) => new Article(article)));
  }

  static store(articles: Article[]) {
    const db = DB.read();
    db["articles"] = articles;
    DB.save(db);
  }
}
