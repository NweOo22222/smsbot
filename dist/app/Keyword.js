"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RESET_SENT = [/^ပြန်စ/, /^reset/i];
var READ_NEWS = [/^(\d+) ပို့ပေးပါ/, /^read (\d+)/i];
var HELP_INFO = [/^အကူအညီ/, /^ကူ(ညီ)?/, /^help/i];
var LATEST_NEWS = [/^ဘာထူးလဲ/, /^သတင်း/, /^news/i];
var ARTICLES_COUNT = [/^(ကျန်|ရှိ)သေးလား/, /^ဒါပဲလား/, /^count/i];
var Keyword = (function () {
    function Keyword(text) {
        this.text = text;
    }
    Keyword.prototype.onAskHelp = function (callback) {
        var _this = this;
        if (HELP_INFO.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            callback();
            this.sent = true;
        }
    };
    Keyword.prototype.onAskHeadlines = function (callback) {
        var _this = this;
        if (LATEST_NEWS.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            callback();
            this.sent = true;
        }
    };
    Keyword.prototype.onAskRead = function (callback) {
        var _this = this;
        var index = READ_NEWS.findIndex(function (keyword) { return _this.meta.match(keyword); });
        if (index === -1)
            return;
        var matched = this.meta.match(READ_NEWS[index]);
        callback(matched[1]);
        this.sent = true;
    };
    Keyword.prototype.onAskCount = function (callback) {
        var _this = this;
        if (ARTICLES_COUNT.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            callback(this);
            this.sent = true;
        }
    };
    Keyword.prototype.onAskReset = function (callback) {
        var _this = this;
        if (RESET_SENT.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            callback(this);
            this.sent = true;
        }
    };
    Keyword.prototype.onUnexisted = function (callback) {
        this.sent || callback();
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
