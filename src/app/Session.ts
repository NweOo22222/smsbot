import {
  PER_SESSION,
  MAX_CHARACTER_COUNT,
  MAX_READ_COUNT,
  MAX_TOTAL_ACTION,
} from "../config";

export interface UserAction {
  total_action: number;
  read_count: number;
  character_count: number;
}

export default class Session {
  protected expired: Date;
  public total_action: number;
  public read_count: number;
  public character_count: number;

  constructor({ expired, read_count, total_action, character_count }) {
    this.expired = new Date(expired ? expired : Date.now() + PER_SESSION);
    this.read_count = read_count || 0;
    this.character_count = character_count || 0;
    this.total_action = total_action || 0;
  }

  incr(action: UserAction) {
    this.total_action += action.total_action;
    this.read_count += action.read_count;
    this.character_count += action.character_count;
    return this;
  }

  restart() {
    this.expired = new Date(Date.now() + PER_SESSION);
    this.total_action = 0;
    this.read_count = 0;
    this.character_count = 0;
  }

  isExpired() {
    return Date.now() > this.expired.getTime();
  }

  canReadArticle() {
    return this.read_count < MAX_READ_COUNT;
  }

  isDenied() {
    return this.exceedCharacterCount || this.exceedTotalAction;
  }

  get exceedTotalAction() {
    return this.total_action > MAX_TOTAL_ACTION;
  }

  get exceedCharacterCount() {
    return this.character_count > MAX_CHARACTER_COUNT;
  }
}