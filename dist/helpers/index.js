"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = void 0;
function toArray(obj) {
    var result = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var entry = _a[_i];
        result.push(__assign({ id: entry[0] }, entry[1]));
    }
    return result;
}
exports.toArray = toArray;
