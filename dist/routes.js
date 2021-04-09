"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var axios_1 = __importDefault(require("axios"));
var Article_1 = __importDefault(require("./app/Article"));
var Headline_1 = __importDefault(require("./app/Headline"));
var Keyword_1 = __importDefault(require("./app/Keyword"));
var Message_1 = __importDefault(require("./app/Message"));
var Phone_1 = __importDefault(require("./app/Phone"));
var _tasks = {};
var router = express_1.Router();
router.get("/call", function (req, res) {
    var message = new Message_1.default({
        body: decodeURIComponent(String(req.query.message)),
        address: req["phone"],
    });
    var phone = message.phone;
    var keyword = new Keyword_1.default(message.body);
    keyword.onUpdate(function () {
        axios_1.default.get("http://localhost:3000/update").then(function () { return res.send("0"); });
    });
    if (message.via("Telenor")) {
        keyword.onAskHelp(function () {
            var text;
            if (keyword.meta.slice(0, 4) == "read") {
                text = [
                    "<နံပါတ်၆လုံး> ဆိုတဲ့နေရာမှာသတင်းအရှေ့မှာပါတဲ့နံပါတ်ကိုပြောင်းထည့်ပေးပါ။",
                ];
            }
            else {
                text = [
                    "1.သတင်းများရယူရန်  -  news  /  သတင်း  /  ဘာထူးလဲ",
                    "2.သတင်းအပြည့်အစုံကိုဖတ်ရန်  -  read <နံပါတ်၆လုံး>  /  <နံပါတ်၆လုံး> ဖတ်ရန်",
                    "3.ကျန်ရှိသည့်အရေအတွက်ကိုသိရန်  - count  /  ကျန်သေးလား",
                    "တို့ပို့ပြီးရယူနိုင်ပါတယ်။ <နံပါတ်၆လုံး> ဆိုတာသတင်းခေါင်းစဥ်အရှေ့ကအမှတ်စဥ်ကိုဆိုလိုတာပါ။",
                ];
            }
            text = text.join("\n");
            phone
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: text.length,
            })
                .save();
            res.send(text);
        });
        keyword.onAskHeadlines(function () {
            var text;
            var latest = Headline_1.default.latest(5, phone.headlines);
            var remain = Headline_1.default.latest(0, phone.headlines).length - latest.length;
            if (latest.length) {
                text = latest.map(function (_a) {
                    var id = _a.id, title = _a.title;
                    return "[" + id + "] " + title;
                }).join("\n");
                if (remain > 0) {
                    text += "\n- နောက်ထပ်သတင်းများရယူလိုပါက news ဟုပို့ပါ။";
                }
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
            else {
                text = "နောက်ထပ်သတင်းများမရှိပါ။";
                if (phone.session.canReadArticle()) {
                    text +=
                        " read <နံပါတ်၆လုံး> ဟုပို့ပြီးတစ်ပုဒ်စီတိုင်းကိုဖတ်နိုင်ပါတယ်။";
                }
                phone
                    .incr({
                    total_action: 1,
                    read_count: 0,
                    character_count: text.length,
                })
                    .save();
                res.send(text);
            }
        });
        keyword.onAskRead(function (id) {
            if (!phone.session.canReadArticle()) {
                res.status(419);
                res.send("<#419> သတင်းအပြည့်အစုံများကိုထပ်မံ၍မရနိုင်တော့ပါ။ နောက်မှထပ်မံပို့ကြည့်ပါ။");
                return;
            }
            var article = Article_1.default.find(id);
            if (!article)
                return res.send("\u101E\u1010\u1004\u103A\u1038 " + id + " \u1000\u102D\u102F \u101B\u103E\u102C\u1019\u1010\u103D\u1031\u1037\u1015\u102B\u104B");
            var text = String(article["content"]);
            var n = Math.floor(text.length / 600);
            var x = text.split(" ");
            var c = ["စာလုံးရေ" + text.length + "လုံးရှိပြီးအချိန်ကြာမြင့်နိုင်ပါ။"];
            var z = Math.floor(x.length / n);
            for (var i = 0; i < n; i++) {
                var p = i + 1;
                if (p === n) {
                    c.push(x.slice(i * z).join(" ") + " -" + article["source"]);
                }
                else {
                    c.push(x.slice(i * z, p * z).join(" ") + " (" + p + "/" + n + ")");
                }
            }
            _tasks[message.phone.number] = c;
            res.send("");
        });
        keyword.onAskCount(function () {
            var tdy = Headline_1.default.latest(0, []);
            var text = tdy.length
                ? "\u1014\u1031\u102C\u1000\u103A\u1011\u1015\u103A\u101E\u1010\u1004\u103A\u1038 " + tdy.length + " \u1001\u102F \u1000\u103B\u1014\u103A\u1015\u102B\u1010\u101A\u103A\u104B"
                : "နောက်ထပ်သတင်းများမရှိပါ။";
            phone
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: text.length,
            })
                .save();
            res.send(text);
        });
        keyword.onAskReset(function () {
            var text = "သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။";
            phone
                .incr({
                total_action: 1,
                read_count: 0,
                character_count: text.length,
            })
                .save();
            res.send(text);
        });
        keyword.onUnexisted(function () {
            var text = "မှားယွင်းနေပါတယ်။ အကူညီရယူလိုပါက help ဟုပို့ပါ။";
            phone
                .incr({
                total_action: 1,
                character_count: text.length,
                read_count: 0,
            })
                .save();
            res.send(text);
        });
    }
    keyword.onUnexisted(function () { return res.status(400).end(); });
});
router.get("/action", function (req, res) {
    var text;
    var number = req["phone"];
    if (!(number in _tasks)) {
        res.status(400);
        return;
    }
    var phone = new Phone_1.default(number);
    text = _tasks[number].shift();
    if (!_tasks[number].length) {
        _tasks[number] = undefined;
        delete _tasks[number];
    }
    phone
        .incr({
        total_action: 1,
        character_count: text.length,
        read_count: 1,
    })
        .save();
    res.send(text);
});
router.get("/update", function (req, res) {
    return Article_1.default.fetch()
        .then(function (articles) {
        Article_1.default.store(articles);
        res.status(201).send("0");
    })
        .catch(function (e) { return res.status(400); });
});
exports.default = router;
