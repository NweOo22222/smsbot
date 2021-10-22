"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var DATABASE_FILENAME = ".db.json";
var DATABASE_PATH = path_1.resolve(path_1.dirname(path_1.dirname(__dirname)), DATABASE_FILENAME);
var DB = (function () {
    function DB() {
    }
    DB.init = function () {
        fs_1.existsSync(DATABASE_PATH) || this.save({ phone: [], articles: [] });
    };
    DB.read = function () {
        return JSON.parse(fs_1.readFileSync(DATABASE_PATH, "utf-8"));
    };
    DB.save = function (db) {
        fs_1.writeFileSync(DATABASE_PATH, JSON.stringify(db), "utf-8");
    };
    return DB;
}());
exports.default = DB;
