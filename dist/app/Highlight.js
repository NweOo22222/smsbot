"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Highlight = (function () {
    function Highlight(highlight) {
        this.id = highlight.id.toString();
        this.title = highlight.title;
        this.source = highlight.source;
        this.timestamp = highlight.timestamp;
        this.createdAt = new Date(highlight.timestamp);
    }
    Highlight.find = function (id) {
        return DB_1.default.read()["highlights"].find(function (highlight) { return highlight["id"] == id; });
    };
    Highlight.get = function (limit, date, diff) {
        if (limit === void 0) { limit = 0; }
        var highlights = (DB_1.default.read()["highlights"] || [])
            .map(function (highlight) { return new Highlight(highlight); })
            .sort(function (a, b) { return b.timestamp > a.timestamp; })
            .filter(function (highlight) { return highlight.createdAt.getDate() == date.getDate(); })
            .filter(function (_a) {
            var id = _a.id;
            return !diff.includes(id);
        });
        return limit ? highlights.reverse().slice(0, limit) : highlights;
    };
    return Highlight;
}());
exports.default = Highlight;
