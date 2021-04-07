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
                'သတင်းအပြည့်အစုံကိုဖတ်ရန် - "read <id>" or "<ဂဏန်း၆လုံ> ဖတ်" ဥပမာ. read 450123',
                'ကျန်ရှိသည့်အရေအတွက်ကိုသိရန် - "count" or "ကျန်သေးလား"',
                'အစကပြန်လည်ရယူရန် - "reset" or "ပြန်စ"',
                "\n-by nweoo.com",
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
                    return "(" + id + ") " + title;
                })
                    .join("\n");
                res.send(text +
                    '\nနောက်ထပ်သတင်းများ "news"  အပြည့်အစုံဖတ်ရန် "read <id>"  ပိုမိုသိရှိရန် "help"');
            }
            else {
                res.send('နောက်ထပ်သတင်းများမရှိတော့ပါ။ သတင်းတွေကိုအစကရယူလိုပါက "reset" ဟုပို့ပါ။ သတင်းအပြည့်အစုံဖတ်လိုပါက "read <id>" ဟုပို့ပါ။ ဥပမာ. read 450111\n\nBot by nweoo.com');
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
            var text = article["content"];
            if (text.length > 1000) {
                text = text.slice(0, 997) + "…";
            }
            res.send(text + " - " + article["source"]);
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
            var total = tdy.length + sent.length;
            var text = tdy.length
                ? "\u1014\u1031\u102C\u1000\u103A\u1011\u1015\u103A\u101E\u1010\u1004\u103A\u1038 " + tdy.length + " \u1001\u102F \u1000\u103B\u1014\u103A\u1015\u102B\u1010\u101A\u103A\u104B \u101E\u1010\u1004\u103A\u1038\u1010\u1005\u103A\u1015\u102F\u1012\u103A\u1001\u103B\u1004\u103A\u1038\u1005\u102E\u1000\u102D\u102F\u1016\u1010\u103A\u101B\u1014\u103A \"read <id>\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B \u1015\u102D\u102F\u1019\u102D\u102F\u101E\u102D\u101B\u103E\u102D\u101B\u1014\u103A \"help\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B\n\nBot by nweoo.com"
                : 'နောက်ထပ်သတင်းများပို့ရန်မကျန်တော့ပါ။ သတင်းတစ်ပုဒ်ချင်းစီကိုဖတ်ရန် "read <id>" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com';
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
            res.send("\u101E\u1010\u1004\u103A\u1038\u1019\u103B\u102C\u1038\u1000\u102D\u102F\u1021\u1005\u1000\u1014\u1031\u1015\u103C\u1014\u103A\u101C\u100A\u103A\u101B\u101A\u1030\u1014\u102D\u102F\u1004\u103A\u1015\u102B\u1015\u103C\u102E\u104B \u1015\u102D\u102F\u1019\u102D\u102F\u101E\u102D\u101B\u103E\u102D\u101B\u1014\u103A \"help\" \u101F\u102F\u1015\u102D\u102F\u1037\u1015\u102B\u104B\n\nBot by nweoo.com");
        });
        keyword.onUnexisted(function () {
            return res.send('လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com');
        });
    }
    keyword.onUnexisted(function () { return res.status(400).end(); });
});
exports.default = router;
