"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var printf_1 = __importDefault(require("printf"));
var Headline_1 = __importDefault(require("./app/Headline"));
var Keyword_1 = __importDefault(require("./app/Keyword"));
var Message_1 = __importDefault(require("./app/Message"));
var Phone_1 = __importDefault(require("./app/Phone"));
var Highlight_1 = __importDefault(require("./app/Highlight"));
var DB_1 = __importDefault(require("./app/DB"));
var burmeseNumber_1 = __importDefault(require("./functions/burmeseNumber"));
var remainingTime_1 = __importDefault(require("./functions/remainingTime"));
var socket_1 = require("./socket");
var config_1 = require("./config");
var middleware_1 = __importDefault(require("./middleware"));
var Config_1 = __importDefault(require("./app/Config"));
var analytics_1 = __importDefault(require("./functions/analytics"));
var verifySIM_1 = __importDefault(require("./verifySIM"));
var axios_1 = __importDefault(require("axios"));
var router = express_1.Router();
var _tasks = {};
var reports = [];
router.get("/call", middleware_1.default, verifySIM_1.default, function (req, res) {
    var message = new Message_1.default({
        body: decodeURIComponent(String(req.query.message)),
        address: req["phone"],
    });
    var phone = message.phone;
    var keyword = new Keyword_1.default(message.body);
    var session = phone.session;
    phone.extend().session.extend();
    if (!session.unlimited && session.daily.isDenied()) {
        if (!session.daily.notified) {
            var error = printf_1.default(config_1.ON_RATE_LIMIT, burmeseNumber_1.default(remainingTime_1.default(session.daily.remaining)));
            session.daily.notified = true;
            phone.save();
            socket_1.io().emit("users:update", phone);
            _tasks[phone.number] = [error];
            return res.end();
        }
        socket_1.io().emit("users:update", phone);
        return res.status(429).end();
    }
    if (!session.unlimited && session.hourly.isDenied()) {
        if (!session.hourly.notified) {
            var error = printf_1.default(config_1.ON_RATE_LIMIT, burmeseNumber_1.default(remainingTime_1.default(session.hourly.remaining)));
            session.hourly.notified = true;
            phone.save();
            socket_1.io().emit("users:update", phone);
            _tasks[phone.number] = [error];
            return res.end();
        }
        socket_1.io().emit("users:update", phone);
        return res.status(429).end();
    }
    keyword.onAskInfo(function () {
        var dailyAction = Math.round(session.daily.actions / Number(Config_1.default.get("ACTION_SCORE")));
        var hourlyAction = Math.round(session.hourly.actions / Number(Config_1.default.get("ACTION_SCORE")));
        var text = session.unlimited
            ? config_1.NO_SMS_LIMIT
            : printf_1.default(config_1.ON_SMS_LIMIT, burmeseNumber_1.default(remainingTime_1.default(session.hourly.remaining)), burmeseNumber_1.default(hourlyAction), burmeseNumber_1.default(remainingTime_1.default(session.daily.remaining)), burmeseNumber_1.default(dailyAction));
        if (phone.premium) {
            text += " [PREMIUM]";
        }
        text += " - nweoo.com";
        phone.notified_error = false;
        phone.incr({ total_action: 0 }).save();
        _tasks[phone.number] = [text];
        res.end();
    });
    keyword.onAskHeadlines(function () {
        var actions = [];
        var news_count = Number(Config_1.default.get("NEWS_PER_SMS"));
        var highlights = Highlight_1.default.get(news_count, new Date(), phone.highlights);
        var latest = Headline_1.default.latest(news_count - highlights.length, phone.headlines);
        var remain = Highlight_1.default.get(null, new Date(), phone.highlights).length +
            Headline_1.default.latest(null, phone.headlines).length -
            latest.length;
        var result = __spreadArray(__spreadArray([], highlights), latest);
        if (result.length) {
            phone.notified_error = false;
            actions.push.apply(actions, result.map(function (_a) {
                var title = _a.title, datetime = _a.datetime, source = _a.source;
                return title.split(" ").join("") +
                    " -" +
                    source +
                    " " +
                    datetime.getDate() +
                    "/" +
                    Number(datetime.getMonth() + 1);
            }));
            if (remain > news_count) {
                phone.notified_emtpy = false;
            }
            _tasks[message.phone.number] = actions;
            phone.markAsSent(highlights, latest).incr({ total_action: 0 }).save();
            res.end();
        }
        else {
            var text = config_1.ON_HEADLINES_NULL;
            if (!phone.notified_emtpy) {
                phone.notified_emtpy = true;
                _tasks[phone.number] = [text];
                phone.incr({ total_action: 0.8 }).save();
            }
            else {
                phone.incr({ total_action: 0.5 }).save();
            }
            res.end();
        }
    });
    keyword.onAskCount(function () {
        var count = Headline_1.default.latest(null, phone.headlines).length;
        var text = count
            ? printf_1.default(config_1.ON_REMAINING_COUNT, burmeseNumber_1.default(count))
            : config_1.ON_REMAINING_COUNT_NULL;
        phone.notified_error = false;
        phone.incr({ total_action: 0 }).save();
        _tasks[phone.number] = [text];
        res.end();
    });
    keyword.onCommonMistake(function () {
        res.status(400).end();
    });
    keyword.onUnmatched(function () {
        res.status(404).end();
    });
    if (reports.length) {
        console.log("[Queue:REPORT]", reports.length);
        reports.forEach(function (report) {
            axios_1.default
                .post("https://api.nweoo.com/report", report)
                .then(function (_a) {
                var data = _a.data;
                reports = reports.filter(function (_report) { return _report !== report; });
            })
                .catch(function (e) { var _a; return console.log("[ATTEMPT_FAILED:REPORT]", ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
        });
    }
    socket_1.io().emit("users:update", phone);
    socket_1.io().emit("messages:update", message.body);
});
router.get("/action", analytics_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, number, phone;
    return __generator(this, function (_a) {
        number = req["phone"];
        if (typeof _tasks[number] !== "object" || !_tasks[number].length) {
            return [2, res.status(400).end()];
        }
        phone = new Phone_1.default(number);
        text = _tasks[number].shift();
        if (!_tasks[number].length) {
            _tasks[number] = undefined;
            delete _tasks[number];
        }
        socket_1.io().emit("users:update", phone);
        phone.incr({ total_action: 0.2, character_count: text.length }).save();
        res.send(text);
        return [2];
    });
}); });
router.get("/report", function (req, res) {
    var _a = req.query, phone = _a.phone, message = _a.message;
    if (!(phone && message)) {
        return res.status(400).end();
    }
    message = String(message)
        .replace(/#n[we]{2}oo/gim, "")
        .trim();
    var data = {
        phone: phone,
        message: message,
        timestamp: Date.now(),
    };
    res.end();
    axios_1.default.post("https://api.nweoo.com/report", data).catch(function (e) {
        console.log("[FAILED:REPORT]", reports.length);
        reports.push(data);
    });
});
router.get("/update", function (req, res) {
    return Headline_1.default.fetch()
        .then(function (articles) { return Headline_1.default.store(articles); })
        .then(function () { return res.send("updated"); })
        .catch(function (e) { return res.send(e.message); });
});
router.post("/update", function (req, res) {
    var _a = req.body, title = _a.title, source = _a.source, timestamp = _a.timestamp;
    if (!(title && source && timestamp)) {
        return res.redirect(req.headers["referer"] || "/articles.html");
    }
    var db = DB_1.default.read();
    if (!("highlights" in db))
        db["highlights"] = [];
    var highlights = db["highlights"];
    var i = 0;
    title.split("\n").forEach(function (title) {
        title = String(title).trim();
        title &&
            highlights.push(new Highlight_1.default({
                id: (Date.now() + i++).toString(),
                title: title,
                source: source,
                timestamp: timestamp,
            }));
    });
    DB_1.default.save(db);
    res.redirect("/articles.html");
});
exports.default = router;
