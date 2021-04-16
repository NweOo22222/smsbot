"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DailySession_1 = __importDefault(require("./DailySession"));
var HourlySession_1 = __importDefault(require("./HourlySession"));
var Session = (function () {
    function Session(session) {
        this.daily = new DailySession_1.default(session.daily || {});
        this.hourly = new HourlySession_1.default(session.hourly || {});
        this.banned = Boolean(session.banned);
        this.disabled = Boolean(session.disabled);
    }
    Session.prototype.extend = function () {
        this.daily.extend();
        this.hourly.extend();
    };
    Session.prototype.reset = function () {
        this.daily.reset();
        this.hourly.reset();
    };
    Session.prototype.incr = function (action) {
        this.daily.incr(action);
        this.hourly.incr(action);
        return this;
    };
    return Session;
}());
exports.default = Session;
