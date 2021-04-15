"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Phone_1 = __importDefault(require("./app/Phone"));
var config_1 = require("./config");
var printf_1 = __importDefault(require("printf"));
var socket_1 = require("./socket");
var settings_1 = require("./settings");
function middleware(req, res, next) {
    if (!("phone" in req.query)) {
        return res.status(400).end();
    }
    var phone = new Phone_1.default(req["phone"]);
    var message = decodeURIComponent(String(req.query["message"] || ""));
    var session = phone.session;
    var reset = function () {
        session.restart();
        phone.save();
        return true;
    };
    if (message.match(/\.update/)) {
        res.redirect("/update");
        return res.end();
    }
    if (message.match(/\.reset/)) {
        reset();
        return res.end();
    }
    if (session.isExpired()) {
        reset();
        return next();
    }
    if (session.isDenied()) {
        return res.status(419).end();
    }
    if (session.isReachedLimit()) {
        var remain = Math.round(session.remaining / 60);
        var response = printf_1.default(config_1.ON_RATE_LIMIT, settings_1.MOBILE_NUMBER, "နောက် " + remain + " မိနစ်နေမှ");
        phone.incr({
            total_action: 1,
        });
        phone.save();
        socket_1.io().emit("users:update", { id: phone.id, type: "limited" });
        return res.send(response);
    }
    next();
}
exports.default = middleware;
