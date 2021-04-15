import Highlight from "./Highlight";
import Credit from "./Credit";
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
  public credit: Credit;
  public operator: Operator;
  public session: Session;

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
    this.credit = new Credit(phone.credit || {});
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
}
