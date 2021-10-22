"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Headline = (function () {
    function Headline(_a) {
        var id = _a.id, source = _a.source, timestamp = _a.timestamp, createdAt = _a.createdAt, title = _a.title;
        this.id = id;
        this.title = String(title).replace(/ /gm, "");
        this.source = source;
        this.timestamp = timestamp;
        this.createdAt = new Date(createdAt);
    }
    Headline.find = function (id) {
        return DB_1.default.read()["articles"].find(function (article) { return article["id"] == id; });
    };
    Headline.store = function (headlines) {
        var db = DB_1.default.read();
        db["articles"] = headlines;
        DB_1.default.save(db);
    };
    Headline.latest = function (limit, diff) {
        if (limit === void 0) { limit = null; }
        if (diff === void 0) { diff = []; }
        var articles = (DB_1.default.read()["articles"] || [])
            .map(function (article) { return new Headline(article); })
            .sort(function (a, b) { return b.timestamp - a.timestamp; })
            .filter(function (headline) {
            return !headline.title.match(/(?:\((?:ရုပ်သံ|ဆောင်းပါး)\)|ကာတွန်း\()/) &&
                !diff.includes(headline["id"]);
        });
        if (limit === null) {
            return articles;
        }
        return limit > 0 ? articles.slice(0, limit) : [];
    };
    return Headline;
}());
exports.default = Headline;
