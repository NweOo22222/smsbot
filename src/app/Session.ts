import { PER_SESSION, MAX_TOTAL_ACTION } from "../settings";

export interface UserAction {
  total_action: number;
}

export default class Session {
  public expired: Date;
  public total_action: number;

  constructor({ expired, total_action }) {
    this.expired = new Date(expired ? expired : Date.now() + PER_SESSION);
    this.total_action = total_action || 0;
  }

  incr(action: UserAction) {
    this.total_action += action.total_action;
    return this;
  }

  restart() {
    this.expired = new Date(Date.now() + PER_SESSION);
    this.total_action = 0;
  }

  isExpired() {
    return new Date() > this.expired;
  }

  isDenied() {
    return this.exceedTotalAction;
  }

  isReachedLimit() {
    return this.total_action == MAX_TOTAL_ACTION;
  }

  get exceedTotalAction() {
    return this.total_action > MAX_TOTAL_ACTION;
  }

  get remaining() {
    return Math.round((this.expired.getTime() - Date.now()) / 1000);
  }
}
