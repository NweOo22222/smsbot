import { MAX_TOTAL_ACTION, PER_SESSION } from "../settings";
import { UserAction } from "./Session";

export default class HourlySession {
  public expired: Date;
  public total_action: number;
  public notified: Boolean;

  constructor(action: UserAction) {
    this.total_action = action.total_action || 0;
    this.expired = new Date(
      action.expired ? action.expired : Date.now() + PER_SESSION
    );
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
    this.expired = new Date(Date.now() + PER_SESSION);
    this.total_action = 0;
    this.notified = false;
  }

  isExpired() {
    return new Date() > this.expired;
  }

  isDenied() {
    return this.total_action >= MAX_TOTAL_ACTION;
  }

  get remaining() {
    return Math.round((this.expired.getTime() - Date.now()) / 1000);
  }
}
