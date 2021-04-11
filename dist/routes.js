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
var _tasks = {};
var router = express_1.Router();
router.get("/call", function (req, res) {
    var message = new Message_1.default({
        body: decodeURIComponent(String(req.query.message)),
        address: req["phone"],
    });
    var phone = message.phone;
    var keyword = new Keyword_1.default(message.body);
    var text;
    keyword.onAskHelp(function () {
        text = "သတင်းများရယူရန် news (သို့) သတင်း လို့ပို့ပါ။";
        phone.incr({
            total_action: 1,
            character_count: text.length,
            read_count: 0,
        });
        res.send(text);
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
                actions.push("- နောက်ထပ်ရယူလိုပါက news ဟုပို့ပါ။");
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
            text = "သတင်းများနောက်ထပ်မရှိပါ။";
            phone
                .markAsSent(latest)
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: text.length,
            })
                .save();
            res.send(text);
        }
        socket_1.io().emit("users:update", { id: phone.id, type: "news" });
    });
    keyword.onAskRead(function (id) {
        text = "သတင်းအပြည့်အစုံကိုပို့လို့အဆင်မပြေလို့ဖျက်သိမ်းလိုက်ပါပြီ။";
        phone
            .incr({
            total_action: 1,
            character_count: text.length,
            read_count: 0,
        })
            .save();
        res.send(text);
        socket_1.io().emit("users:update", { id: phone.id, type: "read" });
    });
    keyword.onAskReset(function () {
        var text = "သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။";
        phone.reset();
        phone
            .incr({
            total_action: 1,
            read_count: 0,
            character_count: text.length,
        })
            .save();
        res.send(text);
        socket_1.io().emit("users:update", { id: phone.id, type: "reset" });
    });
    keyword.onUnexisted(function () {
        var text = "မှားနေပါတယ်။ သတင်းများရယူလိုပါက news ဟုပို့ပါ။";
        phone
            .incr({
            total_action: 1,
            character_count: text.length,
            read_count: 0,
        })
            .save();
        res.send(text);
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
