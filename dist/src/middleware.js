"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Phone_1 = __importDefault(require("./app/Phone"));
function middleware(req, res, next) {
    if ("version" in req.query) {
        req["_version"] = String(req.query.version);
    }
    if ("operator" in req.query) {
        req["operator"] = String(req.query.operator);
    }
    if ("phone" in req.query) {
        req["phone"] = String(req.query.phone).replace(/^\s/, "+");
        var phone_1 = new Phone_1.default(req["phone"]);
        var message = decodeURIComponent(String(req.query["message"] || ""));
        if (phone_1) {
            var session_1 = phone_1.session;
            var reset = function () {
                session_1.restart();
                phone_1.save();
                return true;
            };
            if (message.match(/\.update/)) {
                return next();
            }
            if (message.match(/\.reset/)) {
                return reset() && res.end();
            }
            if (session_1.isExpired()) {
                return reset() && next();
            }
            if (session_1.isDenied()) {
                return res
                    .status(419)
                    .send("<#419> ဝန်ဆောင်မှုများထပ်မံမရရှိနိုင်တော့ပါ။ နောက်မှပြန်ပြီး ပို့ကြည့်ပါ။");
            }
        }
        return next();
    }
    return next();
}
exports.default = middleware;
