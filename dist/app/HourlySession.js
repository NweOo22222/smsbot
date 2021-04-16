"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../settings");
var HourlySession = (function () {
    function HourlySession(action) {
        this.total_action = action.total_action || 0;
        this.expired = new Date(action.expired ? action.expired : Date.now() + settings_1.PER_SESSION);
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
        this.expired = new Date(Date.now() + settings_1.PER_SESSION);
        this.total_action = 0;
        this.notified = false;
    };
    HourlySession.prototype.isExpired = function () {
        return new Date() > this.expired;
    };
    HourlySession.prototype.isDenied = function () {
        return this.total_action >= settings_1.MAX_TOTAL_ACTION;
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
