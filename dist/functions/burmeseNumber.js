"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numbers = [
    "\u1040",
    "\u1041",
    "\u1042",
    "\u1043",
    "\u1044",
    "\u1045",
    "\u1046",
    "\u1047",
    "\u1048",
    "\u1049",
];
function burmeseNumber(number) {
    return number
        .toString()
        .split("")
        .map(function (n) { return numbers[n] || n; })
        .join("");
}
exports.default = burmeseNumber;
