import Highlight from "./Highlight";
import DB from "./DB";
import Headline from "./Headline";
import Session, { UserAction } from "./Session";

type Operator = "Telenor" | "Ooredoo" | "MPT" | "MYTEL";

export default class Phone {
  public id: string;
  public total_count: number;
  public first_date: Date;
  public last_date: Date;
  public headlines: string[];
  public highlights: string[];
  public operator: Operator;
  public session: Session;
  public premium: Boolean;
  public max_limit: number;
  public read_count: number;
  public read_reset: Date;
  public notified_emtpy: boolean;
  public notified_error: boolean;

  constructor(public number: string) {
    guessOperator(this);
    this.id = number;
    const clients = DB.read()["phone"];
    const i = clients.findIndex(({ id }) => id == this.id);
    const phone = i === -1 ? {} : clients[i];
    this.session = new Session(phone.session || {});
    this.first_date = new Date(phone.first_date || Date.now());
    this.last_date = new Date(phone.last_date || Date.now());
    this.total_count = phone.total_count || 0;
    this.headlines = phone.headlines || [];
    this.highlights = phone.highlights || [];
    this.notified_error = Boolean(phone.notified_error);
    this.notified_emtpy = Boolean(phone.notified_emtpy);

    this.max_limit = phone.max_limit || 0;
    if (this.max_limit) {
      this.read_reset = new Date(phone.read_reset || Date.now() + 2400 * 3600);
      this.read_count = phone.read_count || 0;
      this.premium = Boolean(this.read_count);
    }
  }

  extend() {
    this.readExpired() && this.resetReadLimit();
    return this;
  }

  resetReadLimit() {
    this.read_reset = new Date(Date.now() + 2400 * 3600);
    this.read_count = this.max_limit;
    this.premium = Boolean(this.read_count);
  }

  readExpired() {
    return this.read_reset && Date.now() > this.read_reset.getTime();
  }

  incr(action: UserAction) {
    this.session.incr(action);
    this.total_count++;
    return this;
  }

  markAsSent(highlights: Highlight[], headlines: Headline[]) {
    highlights.forEach(({ id }) => {
      this.highlights.push(id);
    });
    headlines.forEach(({ id }) => {
      this.headlines.push(id);
    });
    return this;
  }

  reset() {
    this.headlines = [];
    this.highlights = [];
    return this;
  }

  save() {
    const db = DB.read();
    const i = db["phone"]?.findIndex(({ id }) => id == this.id);
    this.last_date = new Date();
    if (i === -1) {
      db["phone"].push(this);
    } else {
      db["phone"][i] = this;
    }
    DB.save(db);
    return this;
  }

  get localNumber() {
    return this.number.replace("+95", "0");
  }
}

function guessOperator(phone: Phone) {
  try {
    let matched = phone.number.match(/^(?:\+95|0)?9(\d)(\d)(\d{5,7})/) || [];
    if (!matched) return;
    switch (matched[1]) {
      case "2":
      case "3":
      case "4":
      case "5":
      case "8":
        phone.operator = "MPT";
        break;
      case "6":
        phone.operator = "MYTEL";
        break;
      case "7":
        phone.operator = "Telenor";
        break;
      case "9":
        phone.operator = "Ooredoo";
        break;
    }
  } catch (e) {}
}
