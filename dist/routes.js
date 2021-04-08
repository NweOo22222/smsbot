"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var express_1 = require("express");
var Article_1 = __importDefault(require("./app/Article"));
var DB_1 = __importDefault(require("./app/DB"));
var Headline_1 = __importDefault(require("./app/Headline"));
var Keyword_1 = __importDefault(require("./app/Keyword"));
var Message_1 = __importDefault(require("./app/Message"));
var router = express_1.Router();
var _tasks = {};
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
    var keyword = new Keyword_1.default(inputMessage.body);
    keyword.onUpdate(function () {
        axios_1.default
            .get("http://localhost:3000/update")
            .then(function () {
            return res.send("[Command] Updated at " + new Date().toLocaleString());
        });
    });
    if (inputMessage.via("Telenor")) {
        var db_1 = DB_1.default.read();
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
                'သတင်းအပြည့်အစုံကိုဖတ်ရန် - "read <id>" or "<id> ဖတ်" ဥပမာ။ read 450123',
                'ကျန်ရှိသည့်အရေအတွက်ကိုသိရန် - "count" or "ကျန်သေးလား"',
                'အစကပြန်လည်ရယူရန် - "reset" or "ပြန်စ"',
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
            var latest = Headline_1.default.getLatest(5, sent);
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            (_a = db_1["phone"][inputMessage.phone.number]["headlines"]).push.apply(_a, latest.map(function (_a) {
                var id = _a.id;
                return id;
            }));
            if (latest.length) {
                var text = latest
                    .map(function (_a) {
                    var id = _a.id, title = _a.title;
                    return "[" + id + "] " + title;
                })
                    .join("\n");
                res.send(text +
                    '\n\n- နောက်ထပ်သတင်းများရယူရန် "news"\n- သတင်းအပြည့်အစုံဖတ်ရန် "read <id>"');
            }
            else {
                res.send('နောက်ထပ်သတင်းများမရှိတော့ပါ။ သတင်းတွေကိုအစကရယူလိုပါက "reset" ဟုပို့ပါ။ သတင်းအပြည့်အစုံဖတ်လိုပါက "read <id>" ဟုပို့ပါ။ ဥပမာ. read 450111');
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
            db_1["phone"][inputMessage.phone.number]["times"]++;
            db_1["phone"][inputMessage.phone.number]["last_date"] = Date.now();
            var article = db_1["articles"].find(function (article) { return article["id"] == id; });
            if (!article) {
                res.send("\u101E\u1010\u1004\u103A\u1038 " + id + " \u1000\u102D\u102F \u101B\u103E\u102C\u1019\u1010\u103D\u1031\u1037\u1015\u102B\u104B");
                return;
            }
            var text = String(article["content"]);
            var n = Math.floor(text.length / 600);
            var x = text.split(" ");
            var c = [];
            var z = Math.floor(x.length / n);
            for (var i = 0; i < n; i++) {
                if (i == n) {
                    c.push(x.slice(i * z).join(" "));
                }
                else {
                    c.push(x.slice(i * z, (i + 1) * z).join(" "));
                }
            }
            _tasks[inputMessage.phone.number] = c;
            res.send("");
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
            var tdy = Headline_1.default.getLatest(0, sent);
            var text = tdy.length
                ? "\u1014\u1031\u102C\u1000\u103A\u1011\u1015\u103A\u101E\u1010\u1004\u103A\u1038 " + tdy.length + " \u1001\u102F \u1000\u103B\u1014\u103A\u1015\u102B\u1010\u101A\u103A\u104B \u101E\u1010\u1004\u103A\u1038\u1010\u1005\u103A\u1015\u102F\u1012\u103A\u1005\u102E\u1016\u1010\u103A\u101B\u1014\u103A \"read <id>\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B \u1015\u102D\u102F\u1019\u102D\u102F\u101E\u102D\u101B\u103E\u102D\u101B\u1014\u103A \"help\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B"
                : 'နောက်ထပ်သတင်းများပို့ရန်မကျန်တော့ပါ။ သတင်းတစ်ပုဒ်စီဖတ်ရန် "read <id>" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။';
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
            res.send("သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။");
        });
        keyword.onUnexisted(function () {
            return res.send('လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။');
        });
    }
    keyword.onUnexisted(function () { return res.status(400).end(); });
});
router.get("/action/:token", function (req, res) {
    var token = req.params.token;
    if (!(String(token) in _tasks)) {
        return res.send("");
    }
    res.send(_tasks[String(token)].shift());
});
router.get("/update", function (req, res) {
    return Headline_1.default.fetch()
        .then(function (headlines) {
        Headline_1.default.store(headlines);
        Article_1.default.fetch()
            .then(function (articles) {
            Article_1.default.store(articles);
            res.status(201).json({ status: "updated" });
        })
            .catch(function (e) {
            e.response ? res.send(e.response["data"]) : res.send(e.message);
        });
    })
        .catch(function (e) {
        return e.response ? res.send(e.response["data"]) : res.send(e.message);
    });
});
exports.default = router;
