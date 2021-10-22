"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function analytic(req, res, next) {
    req["phone"] = req.query["phone"] = String(req.query.phone).replace(/^(\s959|09)/, "+959");
    next();
}
exports.default = analytic;
