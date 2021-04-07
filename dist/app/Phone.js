"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phone = (function () {
    function Phone(number) {
        this.number = number;
        this.number = this.number.replace(/^\s/, "+");
        guessOperator(this);
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
function guessOperator(phone) {
    var matched = phone.number.match(/^(?:\+95|0)?9(\d)(\d)(\d{5,7})/) || [];
    if (!matched)
        return;
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
