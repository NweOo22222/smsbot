import Config from "./Config";
import { UserAction } from "./Session";

const MAX_CHARACTER_COUNT = 3000;

export default class HourlySession {
  public expired: Date;
  public total_action: number;
  public notified: Boolean;
  public character_count: number;

  constructor(action: UserAction) {
    this.total_action = action.total_action || 0;
    this.character_count = action.character_count || 0;
    this.expired = new Date(
      action.expired
        ? action.expired
        : Date.now() + Number(Config.get("PER_HOURLY_SESSION"))
    );
    this.notified = Boolean(action.notified);
  }

  extend() {
    this.isExpired() && this.reset();
    return this;
  }

  incr(action: UserAction) {
    this.total_action += action.total_action || 0;
    this.character_count += action.character_count || 0;
    return this;
  }

  reset() {
    this.expired = new Date(
      Date.now() + Number(Config.get("PER_HOURLY_SESSION"))
    );
    this.total_action = 0;
    this.character_count = 0;
    this.notified = false;
  }

  isExpired() {
    return Date.now() > this.expired.getTime();
  }

  isDenied() {
    return (
      this.total_action >= Number(Config.get("MAX_HOURLY_LIMIT")) ||
      this.character_count >= MAX_CHARACTER_COUNT
    );
  }

  get remaining() {
    return Math.round((this.expired.getTime() - Date.now()) / 1000);
  }

  get characters() {
    return MAX_CHARACTER_COUNT - this.character_count;
  }

  get actions() {
    return Math.floor(
      Number(Config.get("MAX_HOURLY_LIMIT")) - this.total_action
    );
  }
}
