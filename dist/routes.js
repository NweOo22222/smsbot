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
var socket_1 = require("./socket");
var config_1 = require("./config");
var middleware_1 = __importDefault(require("./middleware"));
var axios_1 = __importDefault(require("axios"));
var Config_1 = __importDefault(require("./app/Config"));
var settings_1 = require("./settings");
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
    keyword.onUnexisted(function () {
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
router.get("/call", middleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, phone, keyword;
    return __generator(this, function (_a) {
        message = new Message_1.default({
            body: decodeURIComponent(String(req.query.message)),
            address: req["phone"],
        });
        phone = message.phone;
        keyword = new Keyword_1.default(message.body);
        keyword.onAskReporter(function () {
            var text = printf_1.default(config_1.ON_HELP_REPORTER, Config_1.default.get("MOBILE_NUMBER"));
            phone.incr({ total_action: 1 });
            res.send(text);
            socket_1.io().emit("users:update", phone);
        });
        keyword.onAskHelp(function () {
            var text = printf_1.default(config_1.ON_HELP, Config_1.default.get("MOBILE_NUMBER"));
            phone.incr({ total_action: 1 });
            res.send(text);
            socket_1.io().emit("users:update", phone);
        });
        keyword.onAskHeadlines(function () {
            var actions = [];
            var highlights = Highlight_1.default.get(5, new Date(), phone.highlights).reverse();
            var latest = Headline_1.default.latest(5 - highlights.length, phone.headlines).reverse();
            var remain = Headline_1.default.latest(null, phone.headlines).length;
            var result = __spreadArray(__spreadArray([], highlights), latest);
            if (result.length) {
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
                if (remain && phone.session.hourly.total_action < 1) {
                    actions.push(printf_1.default(config_1.ON_HEADLINES_NEXT, remain - latest.length));
                }
                _tasks[message.phone.number] = actions;
                phone.markAsSent(highlights, latest).incr({ total_action: 1 }).save();
                res.end();
            }
            else {
                var text = printf_1.default(config_1.ON_HEADLINES_NULL, Config_1.default.get("MOBILE_NUMBER"));
                phone.markAsSent(highlights, latest).incr({ total_action: 1 }).save();
                res.send(text);
            }
            socket_1.io().emit("users:update", phone);
        });
        keyword.onAskCount(function () {
            var text = printf_1.default(config_1.ON_REMAINING_COUNT, Headline_1.default.latest(null, phone.headlines).length);
            phone.incr({ total_action: 0 }).save();
            res.send(text);
        });
        keyword.onAskReset(function () {
            phone.reset().incr({ total_action: 1 }).save();
            res.send(config_1.ON_RESET);
            socket_1.io().emit("users:update", phone);
        });
        keyword.onUnexisted(function () {
            var text = printf_1.default(config_1.ON_UNEXISTED, Config_1.default.get("MOBILE_NUMBER"));
            phone.incr({ total_action: 1 }).save();
            res.send(text);
            socket_1.io().emit("users:update", phone);
        });
        return [2];
    });
}); });
router.get("/action", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
        phone.incr({ total_action: 0 }).save();
        res.send(text);
        socket_1.io().emit("users:update", phone);
        return [2];
    });
}); });
router.get("/update", function (req, res) {
    return Headline_1.default.fetch()
        .then(function (articles) {
        Headline_1.default.store(articles);
        res.status(201).send("0");
    })
        .catch(function (e) { return res.status(400).end(); });
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
