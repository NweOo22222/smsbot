"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Highlight = (function () {
    function Highlight(_a) {
        var id = _a.id, source = _a.source, timestamp = _a.timestamp, title = _a.title;
        this.id = id;
        this.title = title;
        this.source = source;
        this.datetime = new Date(parseInt(timestamp) || Date.now());
    }
    Highlight.find = function (id) {
        return DB_1.default.read()["highlights"].find(function (highlight) { return highlight["id"] == id; });
    };
    Highlight.get = function (limit, date, diff) {
        if (limit === void 0) { limit = 0; }
        var highlights = (DB_1.default.read()["highlights"] || [])
            .map(function (highlight) { return new Highlight(highlight); })
            .sort(function (a, b) { return b.datetime > a.datetime; })
            .filter(function (highlight) { return highlight.datetime.getDate() == date.getDate(); })
            .filter(function (_a) {
            var id = _a.id;
            return !diff.includes(id);
        });
        return limit ? highlights.reverse().slice(0, limit) : highlights;
    };
    return Highlight;
}());
exports.default = Highlight;
