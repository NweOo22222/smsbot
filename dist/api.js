"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DB_1 = __importDefault(require("./app/DB"));
var api = express_1.Router();
api.get("/articles", function (req, res) {
    var per_page = 30;
    var page = Number(req.query.page) || 1;
    res.json(DB_1.default.read()["articles"].slice(page - 1, page * per_page));
});
api.get("/users", function (req, res) {
    var per_page = 20;
    var users = DB_1.default.read()["phone"];
    var page = Number(req.query.page) || 1;
    res.json({
        size: users.length,
        data: users.slice(page - 1, page * per_page),
    });
});
exports.default = api;
