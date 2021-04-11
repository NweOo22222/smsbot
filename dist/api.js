"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DB_1 = __importDefault(require("./app/DB"));
var api = express_1.Router();
api.delete("/articles/:id", function (req, res) {
    var id = req.params.id;
    var db = DB_1.default.read();
    db["articles"] = db["articles"].filter(function (article) { return article.id != id; });
    DB_1.default.save(db);
    res.status(201).end();
});
api.get("/articles", function (req, res) {
    var articles = DB_1.default.read()["articles"].sort(function (a, b) {
        return new Date(a.datetime) > new Date(b.datetime);
    });
    res.json(articles);
});
api.get("/users", function (req, res) {
    var users = DB_1.default.read()["phone"].sort(function (a, b) {
        return new Date(a.datetime) > new Date(b.datetime);
    });
    res.json(users);
});
exports.default = api;
