"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Analytic = (function () {
    function Analytic(_a) {
        var timestamp = _a.timestamp;
        this.timestamp = timestamp || Date.now();
    }
    Analytic.prototype.save = function () {
        var analytic = Analytic.all();
        analytic.push(this);
        Analytic.store(analytic);
    };
    Analytic.init = function () {
        var db = DB_1.default.read();
        if (!("analytic" in db)) {
            db["analytic"] = [];
            DB_1.default.save(db);
        }
    };
    Analytic.all = function () {
        return DB_1.default.read()["analytic"].map(function (analytic) { return new Analytic(analytic); });
    };
    Analytic.today = function () {
        return this.all().filter(function (analytic) {
            return new Date(analytic.timestamp).getDate() == new Date().getDate();
        });
    };
    Analytic.store = function (analytic) {
        var db = DB_1.default.read();
        db["analytic"] = analytic;
        DB_1.default.save(db);
    };
    return Analytic;
}());
exports.default = Analytic;
