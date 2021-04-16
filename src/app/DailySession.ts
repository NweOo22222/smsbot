import { UserAction } from "./Session";

const DAILY_SESSION = 24 * 3600 * 1000; // 24 hours
const MAX_DAILY_ACTION = 10;

export default class DailySession {
  public expired: Date;
  public total_action: number;
  public notified: Boolean;

  constructor(action: UserAction) {
    this.expired = new Date(
      action.expired ? action.expired : Date.now() + DAILY_SESSION
    );
    this.total_action = action.total_action || 0;
    this.notified = Boolean(action.notified);
  }

  extend() {
    this.isExpired() && this.reset();
    return this;
  }

  incr(action: UserAction) {
    this.total_action += action.total_action;
    return this;
  }

  reset() {
    this.expired = new Date(Date.now() + DAILY_SESSION);
    this.total_action = 0;
    this.notified = false;
  }

  isExpired() {
    return new Date() > this.expired;
  }

  isDenied() {
    return this.total_action >= MAX_DAILY_ACTION;
  }

  get remaining() {
    return Math.round((this.expired.getTime() - Date.now()) / 1000);
  }
}
