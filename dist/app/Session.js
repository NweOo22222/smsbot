"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../settings");
var Session = (function () {
    function Session(_a) {
        var expired = _a.expired, total_action = _a.total_action;
        this.expired = new Date(expired ? expired : Date.now() + settings_1.PER_SESSION);
        this.total_action = total_action || 0;
    }
    Session.prototype.incr = function (action) {
        this.total_action += action.total_action;
        return this;
    };
    Session.prototype.restart = function () {
        this.expired = new Date(Date.now() + settings_1.PER_SESSION);
        this.total_action = 0;
    };
    Session.prototype.isExpired = function () {
        return new Date() > this.expired;
    };
    Session.prototype.isDenied = function () {
        return this.exceedTotalAction;
    };
    Session.prototype.isReachedLimit = function () {
        return this.total_action == settings_1.MAX_TOTAL_ACTION;
    };
    Object.defineProperty(Session.prototype, "exceedTotalAction", {
        get: function () {
            return this.total_action > settings_1.MAX_TOTAL_ACTION;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Session.prototype, "remaining", {
        get: function () {
            return Math.round((this.expired.getTime() - Date.now()) / 1000);
        },
        enumerable: false,
        configurable: true
    });
    return Session;
}());
exports.default = Session;
