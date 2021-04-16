"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Phone_1 = __importDefault(require("./app/Phone"));
var config_1 = require("./config");
var printf_1 = __importDefault(require("printf"));
var socket_1 = require("./socket");
var Config_1 = __importDefault(require("./app/Config"));
function middleware(req, res, next) {
    if (!("phone" in req.query)) {
        return res.status(400).end();
    }
    var phone = new Phone_1.default(req["phone"]);
    var message = decodeURIComponent(String(req.query["message"] || ""));
    var session = phone.session;
    session.extend();
    if (message.match(/^\.update$/)) {
        res.redirect("/update");
        return res.end();
    }
    if (message.match(/^\.reset$/)) {
        session.daily.reset();
        session.hourly.reset();
        phone.save();
        return res.end();
    }
    if (message.match(/^\.banned$/)) {
        session.banned = !Boolean(session.banned);
        phone.save();
        return res.status(401).end();
    }
    if (session.banned) {
        return res.status(403).end();
    }
    if (message.match(/^on$/i) && session.disabled) {
        session.disabled = false;
        phone.incr({ total_action: 1 });
        res.send("SMS Chatbot ကို ပြန်လည်စတင်လိုက်ပါပြီ။ - nweoo.com");
        phone.save();
        return res.end();
    }
    if (session.disabled) {
        return res.status(204).end();
    }
    if (message.match(/^off$/i)) {
        session.disabled = true;
        phone.save();
        res.send("SMS Chatbot ကို ပြန်လည်ဖွင့်လိုပါက ON ဟုပို့ပါ။ - nweoo.com");
        return res.end();
    }
    if (session.daily.isDenied()) {
        if (!session.daily.notified) {
            var response = void 0;
            var minute = Math.round(session.daily.remaining / 60);
            var hour = Math.round(minute / 60);
            if (hour < 1) {
                response = printf_1.default(config_1.ON_RATE_LIMIT, Config_1.default.get("MOBILE_NUMBER"), "နောက် " + minute + " မိနစ်နေမှ");
            }
            else {
                response = printf_1.default(config_1.ON_RATE_LIMIT, Config_1.default.get("MOBILE_NUMBER"), "နောက် " + hour + " နာရီနေမှ");
            }
            session.daily.notified = true;
            phone.save();
            socket_1.io().emit("users:update", phone);
            return res.send(response);
        }
        return res.status(419).end();
    }
    if (session.hourly.isDenied()) {
        if (!session.hourly.notified) {
            var remain = Math.round(session.hourly.remaining / 60);
            var response = printf_1.default(config_1.ON_RATE_LIMIT, Config_1.default.get("MOBILE_NUMBER"), "နောက် " + remain + " မိနစ်နေမှ");
            session.hourly.notified = true;
            phone.save();
            socket_1.io().emit("users:update", phone);
            return res.send(response);
        }
        return res.status(419).end();
    }
    phone.save();
    next();
}
exports.default = middleware;
