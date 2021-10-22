import DailySession from "./DailySession";
import HourlySession from "./HourlySession";

export interface UserAction {
  character_count?: number;
  total_action?: number;
  expired?: Date;
  notified?: Boolean;
}

export interface UserSession {
  daily: UserAction;
  hourly: UserAction;
  banned?: Boolean;
  disabled?: Boolean;
  unlimited?: Boolean;
}

export default class Session {
  public hourly: HourlySession;
  public daily: DailySession;
  public banned: Boolean;
  public disabled: Boolean;
  public unlimited: Boolean;

  constructor(session: UserSession) {
    this.daily = new DailySession(session.daily || {});
    this.hourly = new HourlySession(session.hourly || {});
    this.banned = Boolean(session.banned);
    this.disabled = Boolean(session.disabled);
    this.unlimited = Boolean(session.unlimited);
  }

  extend() {
    this.daily.extend();
    this.hourly.extend();
  }

  reset() {
    this.daily.reset();
    this.hourly.reset();
  }

  incr(action: UserAction) {
    this.daily.incr(action);
    this.hourly.incr(action);
    return this;
  }
}
