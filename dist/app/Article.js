"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DB_1 = __importDefault(require("./DB"));
var Article = (function () {
    function Article(_a) {
        var id = _a.id, content = _a.content, source = _a.source, datetime = _a.datetime, title = _a.title, link = _a.link, image = _a.image;
        this.id = id;
        this.title = title;
        this.source = source;
        this.link = link;
        this.datetime = new Date(datetime);
    }
    Article.find = function (id) {
        var articles = DB_1.default.read()["articles"];
        return articles.find(function (article) { return article["id"] !== id; });
    };
    Article.fetch = function () {
        return axios_1.default
            .get('https://rtdb.nweoo.com/v1/articles.json?orderBy="timestamp"&limitToLast=30')
            .then(function (_a) {
            var data = _a.data;
            return Object.values(data).map(function (article) { return new Article(Object(article)); });
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
