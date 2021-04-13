import DB from "./DB";

export default class BreakingNews {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ id, source, timestamp, title }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.datetime = new Date(parseInt(timestamp) || Date.now());
  }

  static find(id) {
    return DB.read()["highlights"].find((highlight) => highlight["id"] == id);
  }

  static get(limit = 0, date: Date, diff: string[]): BreakingNews[] {
    const highlights = (DB.read()["highlights"] || [])
      .map((highlight) => new BreakingNews(highlight))
      .sort((a, b) => b.datetime > a.datetime)
      .filter((highlight) => highlight.datetime.getDate() == date.getDate())
      .filter(({ id }) => !diff.includes(id));
    return limit ? highlights.reverse().slice(0, limit) : highlights;
  }
}
