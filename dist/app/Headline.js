"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DB_1 = __importDefault(require("./DB"));
var Headline = (function () {
    function Headline(_a) {
        var id = _a.id, source = _a.source, datetime = _a.datetime, timestamp = _a.timestamp, title = _a.title;
        this.id = id;
        this.title = title;
        this.source = source;
        this.datetime = new Date(datetime || parseInt(timestamp) || Date.now());
    }
    Headline.find = function (id) {
        return DB_1.default.read()["articles"].find(function (article) { return article["id"] == id; });
    };
    Headline.fetch = function () {
        return axios_1.default
            .get("https://api.nweoo.com/news/headlines?limit=30")
            .then(function (_a) {
            var data = _a.data;
            var articles = [];
            for (var _i = 0, _b = Object.entries(data); _i < _b.length; _i++) {
                var entry = _b[_i];
                articles.push(__assign({ id: entry[0] }, Object(entry[1])));
            }
            return articles
                .map(function (article) { return new Headline(article); })
                .sort(function (a, b) { return a.datetime.getTime() - b.datetime.getTime(); });
        });
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
            .sort(function (a, b) { return b.datetime - a.datetime; })
            .filter(function (headline) { return !diff.includes(headline["id"]); });
        if (limit === null) {
            return articles;
        }
        return limit > 0 ? articles.slice(0, limit) : [];
    };
    return Headline;
}());
exports.default = Headline;
