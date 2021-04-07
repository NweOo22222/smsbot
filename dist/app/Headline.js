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
            .get('https://rtdb.nweoo.com/v1/_articles.json?orderBy="timestamp"&limitToLast=30')
            .then(function (_a) {
            var data = _a.data;
            return data;
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
        var db = DB_1.default.read();
        db["headlines"] = headlines;
        DB_1.default.save(db);
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
        var result = [];
        var headlines = DB_1.default.read()["headlines"];
        for (var _i = 0, _a = Object.entries(headlines); _i < _a.length; _i++) {
            var entry = _a[_i];
            var headline = new HeadlineNews(__assign({ id: entry[0] }, Object(entry[1])));
            if (!diff.includes(headline["id"])) {
                result.push(headline);
            }
        }
        return limit ? result.reverse().slice(0, limit) : result.reverse();
    };
    return HeadlineNews;
}());
exports.default = HeadlineNews;
