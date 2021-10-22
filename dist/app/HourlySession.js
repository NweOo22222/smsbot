"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = __importDefault(require("./Config"));
var MAX_CHARACTER_COUNT = 3000;
var HourlySession = (function () {
    function HourlySession(action) {
        this.total_action = action.total_action || 0;
        this.character_count = action.character_count || 0;
        this.expired = new Date(action.expired
            ? action.expired
            : Date.now() + Number(Config_1.default.get("PER_HOURLY_SESSION")));
        this.notified = Boolean(action.notified);
    }
    HourlySession.prototype.extend = function () {
        this.isExpired() && this.reset();
        return this;
    };
    HourlySession.prototype.incr = function (action) {
        this.total_action += action.total_action || 0;
        this.character_count += action.character_count || 0;
        return this;
    };
    HourlySession.prototype.reset = function () {
        this.expired = new Date(Date.now() + Number(Config_1.default.get("PER_HOURLY_SESSION")));
        this.total_action = 0;
        this.character_count = 0;
        this.notified = false;
    };
    HourlySession.prototype.isExpired = function () {
        return Date.now() > this.expired.getTime() - 300000;
    };
    HourlySession.prototype.isDenied = function () {
        return (this.total_action >= Number(Config_1.default.get("MAX_HOURLY_LIMIT")) ||
            this.character_count >= MAX_CHARACTER_COUNT);
    };
    Object.defineProperty(HourlySession.prototype, "remaining", {
        get: function () {
            return Math.round((this.expired.getTime() - Date.now()) / 1000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HourlySession.prototype, "characters", {
        get: function () {
            return MAX_CHARACTER_COUNT - this.character_count;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HourlySession.prototype, "actions", {
        get: function () {
            return Number(Config_1.default.get("MAX_HOURLY_LIMIT")) - this.total_action;
        },
        enumerable: false,
        configurable: true
    });
    return HourlySession;
}());
exports.default = HourlySession;
