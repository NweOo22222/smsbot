"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DAILY_SESSION = 12 * 3600 * 1000;
var MAX_TOTAL_ACTION = 12;
var MAX_CHARACTER_COUNT = 8000;
var DailySession = (function () {
    function DailySession(action) {
        this.expired = new Date(action.expired || Date.now() + DAILY_SESSION);
        this.total_action = action.total_action || 0;
        this.notified = Boolean(action.notified);
        this.character_count = action.character_count || 0;
    }
    DailySession.prototype.extend = function () {
        this.isExpired() && this.reset();
        return this;
    };
    DailySession.prototype.incr = function (action) {
        this.total_action += action.total_action || 0;
        this.character_count += action.character_count || 0;
        return this;
    };
    DailySession.prototype.reset = function () {
        this.expired = new Date(Date.now() + DAILY_SESSION);
        this.total_action = 0;
        this.notified = false;
        this.character_count = 0;
    };
    DailySession.prototype.isExpired = function () {
        return Date.now() > this.expired.getTime();
    };
    DailySession.prototype.isDenied = function () {
        return (this.total_action >= MAX_TOTAL_ACTION ||
            this.character_count >= MAX_CHARACTER_COUNT);
    };
    Object.defineProperty(DailySession.prototype, "remaining", {
        get: function () {
            return Math.round((this.expired.getTime() - Date.now()) / 1000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DailySession.prototype, "characters", {
        get: function () {
            return MAX_CHARACTER_COUNT - this.character_count;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DailySession.prototype, "actions", {
        get: function () {
            return Math.floor(MAX_TOTAL_ACTION - this.total_action);
        },
        enumerable: false,
        configurable: true
    });
    return DailySession;
}());
exports.default = DailySession;
