"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../settings");
var Credit = (function () {
    function Credit(_a) {
        var point = _a.point;
        this.point = parseInt(point) || settings_1.DEFAULT_CREDIT_POINT;
    }
    Credit.prototype.incr = function (value) {
        this.point += value;
        return this;
    };
    Object.defineProperty(Credit.prototype, "percent", {
        get: function () {
            return ((this.point / settings_1.DEFAULT_CREDIT_POINT) * 100).toFixed(2);
        },
        enumerable: false,
        configurable: true
    });
    return Credit;
}());
exports.default = Credit;
