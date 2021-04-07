"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Article_1 = __importDefault(require("./app/Article"));
var DB_1 = __importDefault(require("./app/DB"));
var HeadlineNews_1 = __importDefault(require("./app/HeadlineNews"));
var Keyword_1 = __importDefault(require("./app/Keyword"));
var Message_1 = __importDefault(require("./app/Message"));
var router = express_1.Router();
router.get("/update", function (req, res) {
    HeadlineNews_1.default.fetch().then(function (headlines) {
        HeadlineNews_1.default.store(headlines);
        Article_1.default.fetch().then(function (articles) {
            Article_1.default.store(articles);
            res.status(201).json({ status: "updated" });
        });
    });
});
router.get("/call", function (req, res) {
    var _a = req.query, phone = _a.phone, message = _a.message;
    phone = String(phone).replace(/^\s/, "+");
    message = decodeURIComponent(String(message));
    var inputMessage = new Message_1.default({
        body: message,
        address: phone,
        sim_slot: "0",
        msg_box: "inbox",
        timestamps: Date.now.toString(),
        _id: 0,
    });
    if (inputMessage.via("Telenor")) {
        var db_1 = DB_1.default.read();
        var keyword = new Keyword_1.default(inputMessage.body);
        keyword.onAskHelp(function () {
            if (!(inputMessage.phone.number in db_1["phone"])) {
                db_1["phone"][inputMessage.phone.number] = {
                    times: 0,
                    first_date: Date.now(),
                    last_date: Date.now(),
                    headlines: [],
                };
            }
            var text = [
                'သတင်းများရယူရန် - "news" or "သတင်း" or "ဘာထူးလဲ"',
                'သတင်းရေတွက်ကိုသိရန် - "count" or "ကျန်သေးလား" or "ဒါပဲလား"',
                'အစကပြန်ရယူရန် - "reset" or "ပြန်စ"',
                'သတင်းအပြည့်အစုံဖတ်ရန် - "read {id}" or "{id} ပို့ပေးပါ"',
                "\nBot by nweoo.com",
            ];
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            DB_1.default.save(db_1);
            res.send(text.join("\n"));
        });
        keyword.onAskHeadlines(function () {
            var _a;
            if (!(inputMessage.phone.number in db_1["phone"])) {
                db_1["phone"][inputMessage.phone.number] = {
                    times: 0,
                    first_date: Date.now(),
                    last_date: Date.now(),
                    headlines: [],
                };
            }
            var sent = db_1["phone"][inputMessage.phone.number]["headlines"];
            var latest = HeadlineNews_1.default.getLatest(5, sent);
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            (_a = db_1["phone"][inputMessage.phone.number]["headlines"]).push.apply(_a, latest.map(function (_a) {
                var id = _a.id;
                return id;
            }));
            if (latest.length) {
                res.send(latest.map(function (_a) {
                    var id = _a.id, title = _a.title;
                    return "[" + id + "] " + title;
                }).join("\n"));
            }
            else {
                res.send('သတင်းများပို့ရန်မကျန်တော့ပါ။ အစကပြန်စရန် "reset" သို့ "ပြန်စ" ဟုပို့ပါ။');
            }
            DB_1.default.save(db_1);
        });
        keyword.onAskRead(function (id) {
            if (!(inputMessage.phone.number in db_1["phone"])) {
                db_1["phone"][inputMessage.phone.number] = {
                    times: 0,
                    first_date: Date.now(),
                    last_date: Date.now(),
                    headlines: [],
                };
            }
            var sent = db_1["phone"][inputMessage.phone.number]["headlines"];
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            if (!sent.includes(id)) {
                res.send("#" + id + " \u1000\u102D\u102F \u1015\u102D\u102F\u1037\u1006\u1031\u102C\u1004\u103A\u1011\u102C\u1038\u1001\u103C\u1004\u103A\u1038\u1019\u101B\u103E\u102D\u101E\u1031\u1038\u1015\u102B\u104B \u1021\u1000\u1030\u1021\u100A\u102E\u101B\u101A\u1030\u101B\u1014\u103A \"help\" or \"\u1000\u1030\u100A\u102E\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B");
                return;
            }
            var article = DB_1.default.read()["articles"].find(function (article) { return article.id == id; });
            if (!article) {
                res.send("#" + id + " \u1000\u102D\u102F\u101B\u103E\u102C\u1019\u1010\u103D\u1031\u1037\u1015\u102B\u104B \u1021\u1006\u1004\u103A\u1019\u1015\u103C\u1031\u1019\u103E\u102F\u1021\u1010\u103D\u1000\u103A\u1010\u1031\u102C\u1004\u103A\u1038\u1015\u1014\u103A\u1015\u102B\u1010\u101A\u103A\u104B \u1021\u1000\u1030\u1021\u100A\u102E\u101B\u101A\u1030\u101B\u1014\u103A \"help\" or \"\u1000\u1030\u100A\u102E\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B");
                return;
            }
            var text = article.content.replace(/\n/gm, "  ").replace(/\s{4}/gm, " ");
            if (text.length > 800) {
                text = text.slice(0, 800) + "...";
            }
            res.send("[" + article.id + "] " + text + " - " + article.source);
        });
        keyword.onAskCount(function () {
            if (!(inputMessage.phone.number in db_1["phone"])) {
                db_1["phone"][inputMessage.phone.number] = {
                    times: 0,
                    first_date: Date.now(),
                    last_date: Date.now(),
                    headlines: [],
                };
            }
            var sent = db_1["phone"][inputMessage.phone.number]["headlines"];
            var tdy = HeadlineNews_1.default.getLatest(0, sent);
            var total = tdy.length + sent.length;
            var remain = total - sent.length;
            var text = remain < 0
                ? "\u101E\u1010\u1004\u103A\u1038\u1019\u103B\u102C\u1038 " + total + " \u1001\u102F\u1021\u102C\u1038\u101C\u102F\u1036\u1038\u1000\u102D\u102F\u1015\u102D\u102F\u1037\u1006\u1031\u102C\u1004\u103A\u1015\u103C\u102E\u1038\u1015\u102B\u1015\u103C\u102D\u104B \u1021\u1005\u1000\u1015\u103C\u1014\u103A\u1005\u101B\u1014\u103A \"reset\" \u101E\u102D\u102F\u1037 \"\u1015\u103C\u1014\u103A\u1005\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B"
                : "\u101E\u1010\u1004\u103A\u1038\u1019\u103B\u102C\u1038 " + tdy.length + " \u1001\u102F\u101B\u103E\u102D\u1015\u103C\u102E\u1038 " + remain + " \u1001\u102F\u1015\u102D\u102F\u1037\u101B\u1014\u103A\u1000\u103B\u1014\u103A\u101B\u103E\u102D\u101E\u1031\u1038\u1015\u102B\u1010\u101A\u103A\u104B";
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            res.send(text);
        });
        keyword.onAskReset(function () {
            if (!(inputMessage.phone.number in db_1["phone"])) {
                db_1["phone"][inputMessage.phone.number] = {
                    times: 0,
                    first_date: Date.now(),
                    last_date: Date.now(),
                    headlines: [],
                };
            }
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            db_1["phone"][inputMessage.phone.number]["headlines"] = [];
            DB_1.default.save(db_1);
            res.send("\u101E\u1010\u1004\u103A\u1038\u1019\u103B\u102C\u1038\u1000\u102D\u102F\u1021\u1005\u1000\u1015\u103C\u1014\u103A\u1005\u1015\u103C\u102E\u1038\u1015\u102B\u1015\u103C\u102E\u1038\u104B \u101E\u1010\u1004\u103A\u1038\u1019\u103B\u102C\u1038\u101B\u101A\u1030\u101C\u102D\u102F\u1015\u102B\u1000 \"news\" or \"\u101E\u1010\u1004\u103A\u1038\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B \u1021\u1000\u1030\u1021\u100A\u102E\u101B\u101A\u1030\u101B\u1014\u103A \"help\" or \"\u1000\u1030\u100A\u102E\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B");
        });
        keyword.onUnexisted(function () { return res.status(400).end(); });
    }
});
exports.default = router;
