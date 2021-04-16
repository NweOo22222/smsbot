"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RESET_SENT = [/ပြန်စ/, /^reset/i];
var LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
var ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /ဒါပဲလား/, /count/i];
var USAGE_HELP = [/ကူ(ညီ)?/, /info/i, /help/i];
var SHOW_INFO = [/info/i];
var Keyword = (function () {
    function Keyword(text) {
        this.text = text;
    }
    Object.defineProperty(Keyword.prototype, "meta", {
        get: function () {
            return this.text.substr(0, 64);
        },
        enumerable: false,
        configurable: true
    });
    Keyword.prototype.onAskHelp = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (USAGE_HELP.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
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
    Keyword.prototype.onAskInfo = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (SHOW_INFO.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
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
    return Keyword;
}());
exports.default = Keyword;
