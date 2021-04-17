"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DAILY_SESSION = 12 * 3600 * 1000;
var MAX_DAILY_ACTION = 12;
var DailySession = (function () {
    function DailySession(action) {
        this.expired = new Date(action.expired || Date.now() + DAILY_SESSION);
        this.total_action = action.total_action || 0;
        this.notified = Boolean(action.notified);
    }
    DailySession.prototype.extend = function () {
        this.isExpired() && this.reset();
        return this;
    };
    DailySession.prototype.incr = function (action) {
        this.total_action += action.total_action;
        return this;
    };
    DailySession.prototype.reset = function () {
        this.expired = new Date(Date.now() + DAILY_SESSION);
        this.total_action = 0;
        this.notified = false;
    };
    DailySession.prototype.isExpired = function () {
        return Date.now() > this.expired.getTime();
    };
    DailySession.prototype.isDenied = function () {
        return this.total_action >= MAX_DAILY_ACTION;
    };
    Object.defineProperty(DailySession.prototype, "remaining", {
        get: function () {
            return Math.round((this.expired.getTime() - Date.now()) / 1000);
        },
        enumerable: false,
        configurable: true
    });
    return DailySession;
}());
exports.default = DailySession;
