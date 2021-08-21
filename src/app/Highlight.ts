import DB from "./DB";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timestamp: number;
}

export default class Highlight {
  public id: string;
  public title: string;
  public source: string;
  public timestamp: number;
  public createdAt: Date;

  constructor(highlight: NewsArticle) {
    this.id = highlight.id.toString();
    this.title = highlight.title;
    this.source = highlight.source;
    this.timestamp = highlight.timestamp;
    this.createdAt = new Date(highlight.timestamp);
  }

  static find(id) {
    return DB.read()["highlights"].find((highlight) => highlight["id"] == id);
  }

  static get(limit = 0, date: Date, diff: string[]): Highlight[] {
    const highlights = (DB.read()["highlights"] || [])
      .map((highlight) => new Highlight(highlight))
      .sort((a, b) => b.timestamp > a.timestamp)
      .filter((highlight) => highlight.createdAt.getDate() == date.getDate())
      .filter(({ id }) => !diff.includes(id));
    return limit ? highlights.reverse().slice(0, limit) : highlights;
  }
}
