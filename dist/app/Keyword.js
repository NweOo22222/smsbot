"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UPDATE = [/^\.update/];
var RESET_SENT = [/^ပြန်စ/, /^reset/i];
var READ_NEWS = [
    /^(\d+) (?:ကို)?ပို့(?:ပေးပါ)?/,
    /^(\d+) (?:ကို)?ဖတ်(?:ရန်)?/,
    /^read (\d+)/i,
    /^read [<"'#]?(\d+)['">]?/i,
];
var LATEST_NEWS = [/^ဘာထူးလဲ/, /^သတင်း/, /^news/i];
var HELP_INFO = [/^အကူအညီ/, /^ကူ(ညီ)?/, /^help/i, /^info/i];
var ARTICLES_COUNT = [/^(ကျန်|ရှိ)သေးလား/, /^ဒါပဲလား/, /^count/i];
var Keyword = (function () {
    function Keyword(text) {
        this.text = text;
    }
    Keyword.prototype.onAskHelp = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (HELP_INFO.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onAskHeadlines = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (LATEST_NEWS.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onAskRead = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        var index = READ_NEWS.findIndex(function (keyword) { return _this.meta.match(keyword); });
        if (index === -1)
            return;
        var matched = this.meta.match(READ_NEWS[index]);
        this.sent = true;
        callback(matched[1]);
    };
    Keyword.prototype.onAskCount = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (ARTICLES_COUNT.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback(this);
        }
    };
    Keyword.prototype.onAskReset = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (RESET_SENT.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback(this);
        }
    };
    Keyword.prototype.onUpdate = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (UPDATE.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onUnexisted = function (callback) {
        if (this.sent)
            return;
        this.sent = true;
        callback();
    };
    Object.defineProperty(Keyword.prototype, "meta", {
        get: function () {
            return this.text.substr(0, 64);
        },
        enumerable: false,
        configurable: true
    });
    return Keyword;
}());
exports.default = Keyword;
