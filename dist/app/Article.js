"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Article = (function () {
    function Article(_a) {
        var id = _a.id, content = _a.content, image = _a.image, title = _a.title, source = _a.source, link = _a.link;
        this.id = id;
        this.content = content;
        this.image = image;
        this.title = title;
        this.source = source;
        this.link = link;
    }
    Article.update = function () {
        return axios_1.default
            .get("https://api.nweoo.com/articles?limit=30")
            .then(function (_a) {
            var data = _a.data;
            return (data || []).map(function (article) { return new Article(article); });
        });
    };
    Article.store = function () {
    };
    return Article;
}());
exports.default = Article;
