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
var HeadlineNews = (function () {
    function HeadlineNews(_a) {
        var source = _a.source, id = _a.id, timestamp = _a.timestamp, title = _a.title;
        this.id = id;
        this.title = title;
        this.source = source;
        this.datetime = new Date(timestamp);
    }
    HeadlineNews.fetch = function () {
        return axios_1.default
            .get('https://rtdb.nweoo.com/v1/_articles.json?orderBy="timestamp"&limitToLast=20')
            .then(function (_a) {
            var data = _a.data;
            var result = [];
            Object.entries(data).forEach(function (_a) {
                var id = _a[0], value = _a[1];
                return result.push(new HeadlineNews(__assign({ id: id }, Object(value))));
            });
            return result;
        });
    };
    HeadlineNews.filter = function (headlines) {
        return headlines.filter(function (_a) {
            var id = _a.id;
            return DB_1.default.read()["headlines"].findIndex(function (_a) {
                var _id = _a.id;
                return id !== _id;
            }) === -1;
        });
    };
    HeadlineNews.store = function (headlines) {
        var _a;
        (_a = DB_1.default.read()["headlines"]).push.apply(_a, headlines);
        DB_1.default.save();
    };
    HeadlineNews.exclude = function (headlines, sent) {
        if (sent === void 0) { sent = []; }
        return headlines.filter(function (_a) {
            var id = _a.id;
            return sent.findIndex(function (_id) { return _id == id; }) == -1;
        });
    };
    HeadlineNews.getLatest = function (limit, diff) {
        if (limit === void 0) { limit = 0; }
        if (diff === void 0) { diff = []; }
        var latest = DB_1.default.read()["headlines"].sort(function (a, b) { return Date.parse(b["datetime"]) - Date.parse(a["datetime"]); })
            .map(function (headline) { return new HeadlineNews(headline); });
        latest = diff.length ? this.exclude(latest, diff) : latest;
        return limit ? latest.slice(0, limit) : latest;
    };
    HeadlineNews.getToday = function () {
        return DB_1.default.read()["headlines"].sort(function (a, b) { return b["datetime"] - a["datetime"]; })
            .filter(function (_a) {
            var datetime = _a.datetime;
            return new Date(datetime).toLocaleString() == new Date().toLocaleString();
        });
    };
    HeadlineNews.getWithin24Hours = function () {
        var within24Hours = Date.now() - 24 * 3600000;
        return DB_1.default.read()["headlines"].sort(function (a, b) { return b["datetime"] - a["datetime"]; })
            .filter(function (_a) {
            var datetime = _a.datetime;
            return new Date(datetime).getTime() > within24Hours;
        });
    };
    return HeadlineNews;
}());
exports.default = HeadlineNews;
