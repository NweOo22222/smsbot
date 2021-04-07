export default class Phone {
  public code: string;
  public dial: string;
  public country: string;
  public operator: string;

  constructor(public number: string) {
    this.number = this.number.replace(/^\s/, "+");
    guessOperator(this);
  }

  get localNumber() {
    return this.number.replace(this.dial, "0");
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
