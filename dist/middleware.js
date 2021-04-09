"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Phone_1 = __importDefault(require("./app/Phone"));
function middleware(req, res, next) {
    if ("phone" in req.query) {
        req["phone"] = String(req.query.phone).replace(/^\s/, "+");
        var phone = new Phone_1.default(req["phone"]);
        if (phone) {
            var session = phone.session;
            if (session.isExpired()) {
                session.restart();
                phone.save();
                return next();
            }
            if (session.isDenied()) {
                var message = req.query["message"];
                if (message === ".update") {
                    session.restart();
                    phone.save();
                    return next();
                }
                return res
                    .status(419)
                    .send("<#419> ဝန်ဆောင်မှုများထပ်မံမရရှိနိုင်တော့ပါ။ နောက်မှပြန်ပြီး ပို့ကြည့်ပါ။");
            }
        }
        return next();
    }
    else {
        if ("allow_me" in req.query) {
            return next();
        }
        return res.status(400).send("");
    }
}
exports.default = middleware;
