import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import * as config from "../settings";

const DATABASE_FILENAME = ".config.json";
const DATABASE_PATH = resolve(dirname(dirname(__dirname)), DATABASE_FILENAME);

export default class Config {
  static init() {
    existsSync(DATABASE_PATH) || this.save({});
  }

  static read(): object {
    return JSON.parse(readFileSync(DATABASE_PATH, "utf-8"));
  }

  static save(config: object) {
    writeFileSync(DATABASE_PATH, JSON.stringify(config, null, 2), "utf-8");
  }

  static get(keyName: string) {
    return this.read()[keyName] || config[keyName] || undefined;
  }

  static getAll() {
    const result = [];
    const userConfig = this.read();
    Object.entries(config).forEach(
      ([keyName, defaultValue]) =>
        (result[keyName] = userConfig[keyName] || defaultValue)
    );
    return result;
  }
}
