import axios from "axios";
import DB from "./DB";

export default class HeadlineNews {
  public id: string;
  public title: string;
  public source: string;
  public datetime: Date;

  constructor({ source, id, timestamp, title }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.datetime = new Date(timestamp);
  }

  static fetch(): Promise<HeadlineNews[]> {
    return axios
      .get("https://nweoo-developer.herokuapp.com/news/headlines?limit=20")
      .then(({ data }) => {
        const result = [];
        Object.entries(data).forEach(([id, value]) =>
          result.push(new HeadlineNews({ id, ...Object(value) }))
        );
        return result;
      });
  }

  static filter(headlines: HeadlineNews[]) {
    return headlines.filter(
      ({ id }) =>
        DB.read()["headlines"].findIndex(({ id: _id }) => id !== _id) === -1
    );
  }

  static store(headlines: HeadlineNews[]) {
    DB.read()["headlines"].push(...headlines);
    DB.save();
  }

  static exclude(headlines: HeadlineNews[], sent = []) {
    return headlines.filter(
      ({ id }) => sent.findIndex((_id) => _id == id) == -1
    );
  }

  static getLatest(limit = 0, diff = []): HeadlineNews[] {
    let latest = DB.read()
      ["headlines"].sort(
        (a, b) => Date.parse(b["datetime"]) - Date.parse(a["datetime"])
      )
      .map((headline) => new HeadlineNews(headline));
    latest = diff.length ? this.exclude(latest, diff) : latest;
    return limit ? latest.slice(0, limit) : latest;
  }

  static getToday() {
    return DB.read()
      ["headlines"].sort((a, b) => b["datetime"] - a["datetime"])
      .filter(
        ({ datetime }) =>
          new Date(datetime).toLocaleString() == new Date().toLocaleString()
      );
  }

  static getWithin24Hours() {
    const within24Hours = Date.now() - 24 * 3600000;
    return DB.read()
      ["headlines"].sort((a, b) => b["datetime"] - a["datetime"])
      .filter(({ datetime }) => new Date(datetime).getTime() > within24Hours);
  }
}
