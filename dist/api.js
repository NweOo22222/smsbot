"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DB_1 = __importDefault(require("./app/DB"));
var Config_1 = __importDefault(require("./app/Config"));
var api = express_1.Router();
api.delete("/articles/:id", function (req, res) {
    var id = req.params.id;
    var db = DB_1.default.read();
    db["articles"] = db["articles"].filter(function (article) { return article.id != id; });
    DB_1.default.save(db);
    res.status(201).end();
});
api.get("/highlights", function (req, res) {
    res.json(DB_1.default.read()["highlights"]);
});
api.delete("/highlights/:id", function (req, res) {
    var db = DB_1.default.read();
    db["highlights"] = db["highlights"].filter(function (_a) {
        var id = _a.id;
        return id != req.params.id;
    });
    DB_1.default.save(db);
    res.status(201).end();
});
api.get("/articles", function (req, res) {
    res.json(DB_1.default.read()["articles"]);
});
api.get("/users", function (req, res) {
    var limit = req.query["limit"] || 15;
    var users = DB_1.default.read()["phone"].sort(function (a, b) {
        return (new Date(a.session["expired"]).getTime() -
            new Date(b.session["expired"]).getTime());
    });
    res.json(users.reverse().slice(0, limit));
});
api.get("/version", function (req, res) {
    res.json(require("../package.json")["version"]);
});
api.get("/settings", function (req, res) {
    res.json(Config_1.default.getAll());
});
api.get("/online", function (req, res) {
    res.send(Boolean(Config_1.default.get("USE_ONLINE")));
});
api.post("/settings", function (req, res) {
    var db = Config_1.default.read();
    Object.entries(req.body).forEach(function (_a) {
        var id = _a[0], value = _a[1];
        db[id] = value;
    });
    Config_1.default.save(db);
    res.status(201).redirect(req.headers["referer"] || "/settings.html");
});
exports.default = api;
