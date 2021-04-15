import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";

const DATABASE_FILENAME = ".db.json";
const DATABASE_PATH = resolve(dirname(dirname(__dirname)), DATABASE_FILENAME);

export default class DB {
  static init() {
    existsSync(DATABASE_PATH) ||
      this.save({ phone: [], articles: [], highlights: [] });
  }

  static read(): object {
    return JSON.parse(readFileSync(DATABASE_PATH, "utf-8"));
  }

  static save(db: Object): void {
    writeFileSync(DATABASE_PATH, JSON.stringify(db), "utf-8");
  }
}
