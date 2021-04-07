const COUNTRY_CODE = require("../../data/countryCode.json");

export default class Phone {
  public code: string;
  public dial: string;
  public country: string;
  public operator: string;

  constructor(public number: string) {
    let country = guessCountry(this) || {};
    this.code = String(country["code"] || "");
    this.dial = String(country["dial_code"] || "");
    this.country = String(country["name"] || "");
    if (this.code === "MM") {
      guessOperator(this);
    }
  }

  get localNumber() {
    return this.number.replace(this.dial, "0");
  }
}

function guessCountry(phone: Phone): Object | undefined {
  phone.number = phone.number.replace(/^\s/, "+");
  return COUNTRY_CODE.filter(({ dial_code }) => {
    return phone.number.includes(dial_code);
  })[0];
}

function guessOperator(phone: Phone) {
  let [, n1, n2, n3] = phone.localNumber.match(/^09(\d)(\d)(\d{5,7})/) || [];
  switch (n1) {
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
