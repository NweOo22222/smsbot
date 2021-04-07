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
        this.content = content.replace(/\n/gm, " ").replace(/\s\s/gm, "");
        this.image = image;
        this.source = source;
        this.link = link;
        this.datetime = new Date(datetime);
    }
    Article.fetch = function () {
        return axios_1.default
            .get('https://rtdb.nweoo.com/v1/articles.json?orderBy="timestamp"&limitToLast=50')
            .then(function (_a) {
            var data = _a.data;
            return Object.values(data).map(function (article) { return new Article(Object(article)); });
        });
    };
    Article.store = function (articles) {
        var db = DB_1.default.read();
        for (var _i = 0, _a = Object.entries(articles); _i < _a.length; _i++) {
            var entry = _a[_i];
            db["articles"][entry[0]] = entry[1];
        }
        DB_1.default.save(db);
    };
    return Article;
}());
exports.default = Article;
