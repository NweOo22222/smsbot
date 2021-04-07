"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cities = require("../../data/ygn.json");
var Tag = (function () {
    function Tag(content) {
        this.content = content;
    }
    Tag.prototype.findDistrictInYangon = function () {
        var _this = this;
        return cities.filter(function (_a) {
            var name_mm = _a.name_mm;
            return (_this.content || "").includes(name_mm);
        });
    };
    return Tag;
}());
exports.default = Tag;
