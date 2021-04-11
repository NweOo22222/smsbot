"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Article_1 = __importDefault(require("./app/Article"));
var Headline_1 = __importDefault(require("./app/Headline"));
var Keyword_1 = __importDefault(require("./app/Keyword"));
var Message_1 = __importDefault(require("./app/Message"));
var Phone_1 = __importDefault(require("./app/Phone"));
var socket_1 = require("./socket");
var config_js_1 = require("../config.js");
var _tasks = {};
var router = express_1.Router();
router.get("/call", function (req, res) {
    var message = new Message_1.default({
        body: decodeURIComponent(String(req.query.message)),
        address: req["phone"],
    });
    var phone = message.phone;
    var keyword = new Keyword_1.default(message.body);
    keyword.onAskHelp(function () {
        phone.incr({
            total_action: 1,
            character_count: config_js_1.ON_HELP.length,
            read_count: 0,
        });
        res.send(config_js_1.ON_HELP);
        socket_1.io().emit("users:update", { id: phone.id, type: "help" });
    });
    keyword.onAskHeadlines(function () {
        var actions = [];
        var latest = Headline_1.default.latest(5, phone.headlines);
        var remain = Headline_1.default.latest(0, phone.headlines).length - latest.length;
        if (latest.length) {
            actions.push.apply(actions, latest.map(function (_a) {
                var title = _a.title, datetime = _a.datetime;
                return datetime.getDate() +
                    "/" +
                    Number(datetime.getMonth() + 1) +
                    " " +
                    title;
            }));
            if (remain > 0)
                actions.push(config_js_1.ON_HEADLINES_NEXT);
            _tasks[message.phone.number] = actions;
            phone
                .markAsSent(latest)
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: 0,
            })
                .save();
            res.send("");
        }
        else {
            phone
                .markAsSent(latest)
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: config_js_1.ON_HEADLINES_NULL.length,
            })
                .save();
            res.send(config_js_1.ON_HEADLINES_NULL);
        }
        socket_1.io().emit("users:update", { id: phone.id, type: "news" });
    });
    keyword.onAskReset(function () {
        phone.reset();
        phone
            .incr({
            total_action: 1,
            read_count: 0,
            character_count: config_js_1.ON_RESET.length,
        })
            .save();
        res.send(config_js_1.ON_RESET);
        socket_1.io().emit("users:update", { id: phone.id, type: "reset" });
    });
    keyword.onUnexisted(function () {
        phone
            .incr({
            total_action: 1,
            character_count: config_js_1.ON_UNEXISTED.length,
            read_count: 0,
        })
            .save();
        res.send(config_js_1.ON_UNEXISTED);
        socket_1.io().emit("users:update", { id: phone.id, type: "unexisted" });
    });
});
router.get("/action", function (req, res) {
    var text;
    var number = req["phone"];
    if (typeof _tasks[number] !== "object" || !_tasks[number].length) {
        return res.status(400).end();
    }
    var phone = new Phone_1.default(number);
    text = _tasks[number].shift();
    if (!_tasks[number].length) {
        _tasks[number] = undefined;
        delete _tasks[number];
    }
    phone
        .incr({
        total_action: 0,
        character_count: text.length,
        read_count: 0,
    })
        .save();
    res.send(text);
    socket_1.io().emit("users:update", { id: phone.id, type: "action" });
});
router.get("/update", function (req, res) {
    return Article_1.default.fetch()
        .then(function (articles) {
        Article_1.default.store(articles);
        res.status(201).send("0");
    })
        .catch(function (e) { return res.status(400).end(); });
});
exports.default = router;
