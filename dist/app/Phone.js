"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var COUNTRY_CODE = require("../../data/countryCode.json");
var Phone = (function () {
    function Phone(number) {
        this.number = number;
        var country = guessCountry(this) || {};
        this.code = String(country["code"] || "");
        this.dial = String(country["dial_code"] || "");
        this.country = String(country["name"] || "");
        if (this.code === "MM") {
            guessOperator(this);
        }
    }
    Object.defineProperty(Phone.prototype, "localNumber", {
        get: function () {
            return this.number.replace(this.dial, "0");
        },
        enumerable: false,
        configurable: true
    });
    return Phone;
}());
exports.default = Phone;
function guessCountry(phone) {
    phone.number = phone.number.replace(/^\s/, "+");
    return COUNTRY_CODE.filter(function (_a) {
        var dial_code = _a.dial_code;
        return phone.number.includes(dial_code);
    })[0];
}
function guessOperator(phone) {
    var _a = phone.localNumber.match(/^09(\d)(\d)(\d{5,7})/) || [], n1 = _a[1], n2 = _a[2], n3 = _a[3];
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
