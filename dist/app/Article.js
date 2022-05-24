"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DB_1 = __importDefault(require("./DB"));
var Headline_1 = __importDefault(require("./Headline"));
var Article = (function () {
    function Article(_a) {
        var id = _a.id, title = _a.title, content = _a.content, image = _a.image, source = _a.source, timestamp = _a.timestamp;
        this.id = id;
        this.title = String(title)
            .replace(/\((?:ရုပ်သံ|ဓာတ်ပုံ)\)/gm, "")
            .replace(/\s/gm, "");
        this.content = String(content).replace(/\n\n\n\n/gm, "\n");
        this.image = image;
        this.source = source;
        this.timestamp = timestamp;
        this.createdAt = new Date(timestamp);
    }
    Article.prototype.find = function (keyword) {
        return this.content.match(new RegExp(keyword, "gmi"));
    };
    Article.prototype.toHeadline = function () {
        return new Headline_1.default({
            id: this.id,
            title: this.title,
            source: this.source,
            timestamp: this.timestamp,
            createdAt: this.createdAt,
        });
    };
    Article.fetchAll = function () {
        return (DB_1.default.read()["full_articles"] || []).map(function (article) { return new Article(article); });
    };
    Article.update = function (limit) {
        if (limit === void 0) { limit = 30; }
        return axios_1.default
            .get("https://news.nweoo.com/api/news/articles?limit=" + limit)
            .then(function (_a) {
            var data = _a.data;
            return (data || []).map(function (article) { return new Article(article); });
        });
    };
    Article.store = function (articles) {
        var db = DB_1.default.read();
        db["articles"] = articles;
        DB_1.default.save(db);
    };
    return Article;
}());
exports.default = Article;
