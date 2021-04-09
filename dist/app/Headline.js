"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Headline = (function () {
    function Headline(_a) {
        var source = _a.source, id = _a.id, datetime = _a.datetime, title = _a.title;
        this.id = id;
        this.title = title;
        this.source = source;
        this.datetime = new Date(datetime);
    }
    Headline.filter = function (headlines) {
        var articles = DB_1.default.read()["articles"];
        return headlines.filter(function (_a) {
            var id = _a.id;
            return articles.findIndex(function (_a) {
                var _id = _a.id;
                return id !== _id;
            }) === -1;
        });
    };
    Headline.exclude = function (headlines, sent) {
        if (sent === void 0) { sent = []; }
        return headlines.filter(function (_a) {
            var id = _a.id;
            return !sent.find(function (_id) { return _id == id; });
        });
    };
    Headline.latest = function (limit, diff) {
        if (limit === void 0) { limit = 0; }
        if (diff === void 0) { diff = []; }
        var articles = DB_1.default.read()["articles"].map(function (article) { return new Headline(article); })
            .sort(function (a, b) { return b.datetime > a.datetime; })
            .filter(function (headline) { return !diff.includes(headline["id"]); });
        return limit ? articles.reverse().slice(0, limit) : articles.reverse();
    };
    return Headline;
}());
exports.default = Headline;
