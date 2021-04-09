import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const DATABASE_FILENAME = ".db.json";
const DATABASE_PATH = resolve(process.cwd(), DATABASE_FILENAME);

export default class DB {
  static read(): object {
    return JSON.parse(readFileSync(DATABASE_PATH, "utf-8"));
  }

  static save(db: Object): void {
    writeFileSync(DATABASE_PATH, JSON.stringify(db), "utf-8");
  }
}

existsSync(DATABASE_PATH) || DB.save({ phone: [], articles: [] });
