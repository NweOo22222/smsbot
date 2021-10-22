"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DB_1 = __importDefault(require("./app/DB"));
var Config_1 = __importDefault(require("./app/Config"));
var Phone_1 = __importDefault(require("./app/Phone"));
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
        return new Date(b.last_date || b.first_date).getTime() -
            new Date(a.last_date || a.first_date).getTime();
    });
    res.json(users.slice(0, limit));
});
api.get("/users/:number", function (req, res) {
    try {
        res.json(new Phone_1.default(req.params.number));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
api.get("/version", function (req, res) {
    res.json(require("../package.json")["version"]);
});
api.get("/total", function (req, res) {
    var db = DB_1.default.read();
    var actions = 0;
    var bans = 0;
    var disables = 0;
    db["phone"].map(function (phone) {
        actions += parseInt(phone.total_count) || 0;
        bans += Boolean(phone.session.banned) ? 1 : 0;
        disables += Boolean(phone.session.disabled) ? 1 : 0;
    });
    res.json({
        users: db["phone"].length,
        actions: actions,
        disables: disables,
        bans: bans,
    });
});
api.get("/settings", function (req, res) {
    res.json(Config_1.default.getAll());
});
api.post("/settings", function (req, res) {
    try {
        Object.entries(req.body).map(function (_a) {
            var key = _a[0], value = _a[1];
            return Config_1.default.set(key, value);
        });
    }
    catch (e) {
        return res.status(400).end();
    }
    res.status(201).redirect(req.headers["referer"] || "/settings.html");
});
exports.default = api;
