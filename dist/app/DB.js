"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var DATABASE_FILENAME = ".db.json";
var DATABASE_PATH = path_1.resolve(process.cwd(), DATABASE_FILENAME);
var data = { headlines: {}, articles: [], phone: {} };
var DB = (function () {
    function DB() {
    }
    DB.read = function () {
        data = JSON.parse(fs_1.readFileSync(DATABASE_PATH, "utf-8"));
        return data;
    };
    DB.save = function (db) {
        if (db === void 0) { db = null; }
        fs_1.writeFileSync(DATABASE_PATH, JSON.stringify(db || data), "utf-8");
    };
    return DB;
}());
exports.default = DB;
fs_1.existsSync(DATABASE_PATH) || DB.save();
