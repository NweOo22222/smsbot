"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function remainingTime(ms) {
    var min = Math.round(ms / 60);
    var hrs = Math.round(min / 60);
    return hrs < 1 ? min + " မိနစ်" : hrs + " နာရီ";
}
exports.default = remainingTime;
