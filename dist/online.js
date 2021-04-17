"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var socket_1 = require("./socket");
var Config_1 = __importDefault(require("./app/Config"));
var axios_1 = __importDefault(require("axios"));
var middleware_1 = __importDefault(require("./middleware"));
var Message_1 = __importDefault(require("./app/Message"));
var Headline_1 = __importDefault(require("./app/Headline"));
var config_1 = require("./config");
var Keyword_1 = __importDefault(require("./app/Keyword"));
var settings_1 = require("./settings");
var printf_1 = __importDefault(require("printf"));
var Highlight_1 = __importDefault(require("./app/Highlight"));
var _tasks = {};
var router = express_1.Router();
router.get("/online", middleware_1.default, function (req, res) {
    var message = new Message_1.default({
        body: decodeURIComponent(String(req.query.message)),
        address: req["phone"],
    });
    var phone = message.phone;
    var keyword = new Keyword_1.default(message.body);
    keyword.onAskHelp(function () {
        var text = printf_1.default(config_1.ON_HELP, Config_1.default.get("MOBILE_NUMBER"));
        phone.incr({
            total_action: 1,
        });
        axios_1.default
            .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(text))
            .then(function () {
            res.end();
            socket_1.io().emit("users:update", phone);
        })
            .catch(function (e) {
            console.log(e);
            console.log("> Error on sending message to server...");
            res.status(500).end();
        });
    });
    keyword.onAskHeadlines(function () {
        var actions = [];
        var highlights = Highlight_1.default.get(5, new Date(), phone.highlights).reverse();
        var latest = Headline_1.default.latest(5 - highlights.length, phone.headlines).reverse();
        var remain = Headline_1.default.latest(0, phone.headlines).length;
        var result = __spreadArray(__spreadArray([], highlights), latest);
        if (result.length) {
            actions.push.apply(actions, result.map(function (_a) {
                var title = _a.title, datetime = _a.datetime;
                return title +
                    " " +
                    datetime.getDate() +
                    "/" +
                    Number(datetime.getMonth() + 1);
            }));
            if (remain > 0 && phone.session.hourly.total_action <= 1) {
                actions.push(printf_1.default(config_1.ON_HEADLINES_NEXT, remain - latest.length));
            }
            _tasks[message.phone.number] = actions;
            phone
                .markAsSent(highlights, latest)
                .incr({
                total_action: 1,
            })
                .save();
            actions.forEach(function (action) {
                return axios_1.default
                    .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(action))
                    .then(function () {
                    console.log("bulkSMS: sent");
                })
                    .catch(function (e) {
                    console.log(e);
                    console.log("> Error on sending message to server...");
                });
            });
            res.end();
        }
        else {
            var text = printf_1.default(config_1.ON_HEADLINES_NULL, Config_1.default.get("MOBILE_NUMBER"));
            phone
                .markAsSent(highlights, latest)
                .incr({
                total_action: 1,
            })
                .save();
            axios_1.default
                .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(text))
                .then(function () {
                res.end();
                socket_1.io().emit("users:update", phone);
            })
                .catch(function (e) {
                console.log(e);
                console.log("> Error on sending message to server...");
                res.status(500).end();
            });
        }
        socket_1.io().emit("users:update", phone);
    });
    keyword.onAskCount(function () {
        var remain = Headline_1.default.latest(0, phone.headlines).length;
        var text = printf_1.default(config_1.ON_REMAINING_COUNT, remain);
        phone
            .incr({
            total_action: 1,
        })
            .save();
        axios_1.default
            .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(text))
            .then(function () {
            res.end();
            socket_1.io().emit("users:update", phone);
        })
            .catch(function (e) {
            console.log(e);
            console.log("> Error on sending message to server...");
            res.status(500).end();
        });
    });
    keyword.onAskReset(function () {
        var text = printf_1.default(config_1.ON_RESET, Config_1.default.get("MOBILE_NUMBER"));
        phone
            .reset()
            .incr({
            total_action: 1,
        })
            .save();
        axios_1.default
            .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(text))
            .then(function () {
            res.end();
            socket_1.io().emit("users:update", phone);
        })
            .catch(function (e) {
            console.log(e);
            console.log("> Error on sending message to server...");
            res.status(500).end();
        });
        socket_1.io().emit("users:update", phone);
    });
    keyword.onUnmatched(function () {
        var text = printf_1.default(config_1.ON_UNEXISTED, Config_1.default.get("MOBILE_NUMBER"));
        phone
            .incr({
            total_action: 1,
        })
            .save();
        axios_1.default
            .get(settings_1.SMS_GATEWAY_API + "/send?phone=" + phone.number + "&message=" + encodeURIComponent(text))
            .then(function () {
            res.end();
            socket_1.io().emit("users:update", phone);
        })
            .catch(function (e) {
            console.log(e);
            console.log("> Error on sending message to server...");
            res.status(500).end();
        });
        socket_1.io().emit("users:update", phone);
    });
});
