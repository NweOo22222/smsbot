"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PER_SESSION = 7200000;
var MAX_TOTAL_ACTION = 5;
var HourlySession = (function () {
    function HourlySession(action) {
        this.total_action = action.total_action || 0;
        this.expired = new Date(action.expired ? action.expired : Date.now() + PER_SESSION);
        this.notified = Boolean(action.notified);
    }
    HourlySession.prototype.extend = function () {
        this.isExpired() && this.reset();
        return this;
    };
    HourlySession.prototype.incr = function (action) {
        this.total_action += action.total_action;
        return this;
    };
    HourlySession.prototype.reset = function () {
        this.expired = new Date(Date.now() + PER_SESSION);
        this.total_action = 0;
        this.notified = false;
    };
    HourlySession.prototype.isExpired = function () {
        return Date.now() > this.expired.getTime();
    };
    HourlySession.prototype.isDenied = function () {
        return this.total_action >= MAX_TOTAL_ACTION;
    };
    Object.defineProperty(HourlySession.prototype, "remaining", {
        get: function () {
            return Math.round((this.expired.getTime() - Date.now()) / 1000);
        },
        enumerable: false,
        configurable: true
    });
    return HourlySession;
}());
exports.default = HourlySession;
