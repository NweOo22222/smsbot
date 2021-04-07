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
      .get(
        'https://rtdb.nweoo.com/v1/_articles.json?orderBy="timestamp"&limitToLast=20'
      )
      .then(({ data }) => {
        return data;
      });
  }

  static filter(headlines: HeadlineNews[]) {
    return headlines.filter(
      ({ id }) =>
        DB.read()["headlines"].findIndex(({ id: _id }) => id !== _id) === -1
    );
  }

  static store(headlines: HeadlineNews[]) {
    const db = DB.read();
    db["headlines"] = headlines;
    DB.save(db);
  }

  static exclude(headlines: HeadlineNews[], sent = []) {
    return headlines.filter(
      ({ id }) => sent.findIndex((_id) => _id == id) == -1
    );
  }

  static getLatest(limit = 0, diff = []): HeadlineNews[] {
    const result = [];
    const headlines = DB.read()["headlines"];
    for (let entry of Object.entries(headlines)) {
      let headline = new HeadlineNews({
        id: entry[0],
        ...Object(entry[1]),
      });
      if (!diff.includes(headline["id"])) {
        result.push(headline);
      }
    }
    return limit ? result.reverse().slice(0, limit) : result.reverse();
  }
}
