import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, join } from "path";

const DATABASE_FILENAME = ".db.json";
const DATABASE_PATH = resolve(process.cwd(), DATABASE_FILENAME);

let data = { headlines: {}, articles: {}, phone: {} };

export default class DB {
  static read(): object {
    data = JSON.parse(readFileSync(DATABASE_PATH, "utf-8"));
    return data;
  }

  static save(db = null): void {
    writeFileSync(DATABASE_PATH, JSON.stringify(db || data), "utf-8");
  }
}

existsSync(DATABASE_PATH) || DB.save();
