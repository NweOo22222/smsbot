"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../settings");
var Session = (function () {
    function Session(_a) {
        var expired = _a.expired, read_count = _a.read_count, total_action = _a.total_action, character_count = _a.character_count;
        this.expired = new Date(expired ? expired : Date.now() + settings_1.PER_SESSION);
        this.read_count = read_count || 0;
        this.character_count = character_count || 0;
        this.total_action = total_action || 0;
    }
    Session.prototype.incr = function (action) {
        this.total_action += action.total_action;
        this.read_count += action.read_count;
        this.character_count += action.character_count * 2;
        return this;
    };
    Session.prototype.restart = function () {
        this.expired = new Date(Date.now() + settings_1.PER_SESSION);
        this.total_action = 0;
        this.read_count = 0;
        this.character_count = 0;
    };
    Session.prototype.isExpired = function () {
        return Date.now() > this.expired.getTime();
    };
    Session.prototype.canReadArticle = function () {
        return this.read_count < settings_1.MAX_READ_COUNT;
    };
    Session.prototype.isDenied = function () {
        return this.exceedCharacterCount || this.exceedTotalAction;
    };
    Object.defineProperty(Session.prototype, "exceedTotalAction", {
        get: function () {
            return this.total_action > settings_1.MAX_TOTAL_ACTION;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Session.prototype, "exceedCharacterCount", {
        get: function () {
            return this.character_count > settings_1.MAX_CHARACTER_COUNT;
        },
        enumerable: false,
        configurable: true
    });
    return Session;
}());
exports.default = Session;
