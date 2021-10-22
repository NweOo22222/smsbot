import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "../settings";

const DATABASE_FILENAME = ".config.json";
const DATABASE_PATH = resolve(dirname(dirname(__dirname)), DATABASE_FILENAME);

type SIMSlot = -1 | 0 | 1;

type ConfigKeyName =
  | "MOBILE_NUMBER"
  | "USE_SIMSLOT"
  | "MAX_DAILY_LIMIT"
  | "PER_DAILY_SESSION"
  | "MAX_HOURLY_LIMIT"
  | "PER_HOURLY_SESSION"
  | "MAX_CHARACTER_LIMIT"
  | "SPAM_PROTECTION_TIME"
  | "NEWS_PER_SMS"
  | "ACTION_SCORE";

export interface Configuration {
  MOBILE_NUMBER: string;
  USE_SIMSLOT: SIMSlot;
  MAX_DAILY_LIMIT: number;
  PER_DAILY_SESSION: number;
  MAX_HOURLY_LIMIT: number;
  PER_HOURLY_SESSION: number;
  MAX_CHARACTER_LIMIT: number;
  SPAM_PROTECTION_TIME: number;
  NEWS_PER_SMS: number;
  ACTION_SCORE: number;
}

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

  static set(keyName: ConfigKeyName | string, value: any) {
    if (!(keyName in config)) {
      throw new Error("Unexisted key [" + keyName + "]");
    }
    const userConfig = this.read();
    userConfig[keyName] = value;
    this.save(userConfig);
  }

  static get(keyName: ConfigKeyName) {
    return this.getAll()[keyName] || undefined;
  }

  static getAll(): Configuration {
    const userConfig = this.read();

    return {
      MOBILE_NUMBER: userConfig["MOBILE_NUMBER"] || config.MOBILE_NUMBER,
      USE_SIMSLOT: userConfig["USE_SIMSLOT"] || config.USE_SIMSLOT,
      SPAM_PROTECTION_TIME:
        userConfig["SPAM_PROTECTION_TIME"] || config.SPAM_PROTECTION_TIME,
      MAX_CHARACTER_LIMIT:
        userConfig["MAX_CHARACTER_LIMIT"] || config.MAX_CHARACTER_LIMIT,
      MAX_HOURLY_LIMIT:
        userConfig["MAX_HOURLY_LIMIT"] || config.MAX_HOURLY_LIMIT,
      MAX_DAILY_LIMIT: userConfig["MAX_DAILY_LIMIT"] || config.MAX_DAILY_LIMIT,
      PER_DAILY_SESSION:
        userConfig["PER_DAILY_SESSION"] || config.PER_DAILY_SESSION,
      PER_HOURLY_SESSION:
        userConfig["PER_HOURLY_SESSION"] || config.PER_HOURLY_SESSION,
      NEWS_PER_SMS: userConfig["NEWS_PER_SMS"] || config.NEWS_PER_SMS,
      ACTION_SCORE: userConfig["ACTION_SCORE"] || config.ACTION_SCORE,
    };
  }
}
