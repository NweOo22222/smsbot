"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RESET_SENT = [/ပြန်စ/, /^reset/i];
var LATEST_NEWS = [/ဘာထူးလဲ/, /သတင်း/, /news/i];
var ARTICLES_COUNT = [/(ကျန်|ရှိ)သေးလား/, /ဒါပဲလား/, /count/i];
var USAGE_HELP = [/ကူ(ညီ)?/, /info/i, /help/i];
var SHOW_INFO = [/info/i];
var ASK_REPORTER = [/သတင်း(တွေ)?(ပေး|ပို့)/];
var ANSWER_THANKS = [/th(?:ank|z|x)/i, /ကျေးဇူး/];
var ANSWER_OKAY = [/သတင်း(တွေ)?(ပေး|ပို့)/];
var SEARCH_CONTENT = [/^(?:find|search) ["'](.+)['"]/i, /^["'](.+)['"]$/];
var IGNORE_KEYWORDS = [/nweoo\.com/, /(0|\+95)9758035929/];
var COMMON_MISTAKES = [];
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
    Keyword.prototype.onIgnore = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (IGNORE_KEYWORDS.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onReplyThanks = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (ANSWER_THANKS.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onReplyOkay = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (ANSWER_OKAY.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onCommonMistake = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (COMMON_MISTAKES.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
    Keyword.prototype.onUnmatched = function (callback) {
        if (this.sent)
            return;
        this.sent = true;
        callback();
    };
    Keyword.prototype.onSearchContent = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        var matched = SEARCH_CONTENT.filter(function (keyword) {
            return _this.text.match(keyword);
        });
        matched = matched.pop();
        if (matched) {
            matched = this.text.match(matched);
            this.sent = true;
            callback(matched[1]);
        }
    };
    Keyword.prototype.onAskReporter = function (callback) {
        var _this = this;
        if (this.sent)
            return;
        if (ASK_REPORTER.filter(function (keyword) { return _this.meta.match(keyword); }).length) {
            this.sent = true;
            callback();
        }
    };
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
    return Keyword;
}());
exports.default = Keyword;
