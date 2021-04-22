"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var settings_1 = require("../settings");
var DATABASE_FILENAME = ".config.json";
var DATABASE_PATH = path_1.resolve(path_1.dirname(path_1.dirname(__dirname)), DATABASE_FILENAME);
var Config = (function () {
    function Config() {
    }
    Config.init = function () {
        fs_1.existsSync(DATABASE_PATH) || this.save({});
    };
    Config.read = function () {
        return JSON.parse(fs_1.readFileSync(DATABASE_PATH, "utf-8"));
    };
    Config.save = function (config) {
        fs_1.writeFileSync(DATABASE_PATH, JSON.stringify(config, null, 2), "utf-8");
    };
    Config.set = function (keyName, value) {
        if (!(keyName in settings_1.config)) {
            throw new Error("Unexisted key [" + keyName + "]");
        }
        var userConfig = this.read();
        userConfig[keyName] = value;
        this.save(userConfig);
    };
    Config.get = function (keyName) {
        return this.getAll()[keyName] || undefined;
    };
    Config.getAll = function () {
        var userConfig = this.read();
        return {
            MOBILE_NUMBER: userConfig["MOBILE_NUMBER"] || settings_1.config.MOBILE_NUMBER,
            USE_SIMSLOT: userConfig["USE_SIMSLOT"] || settings_1.config.USE_SIMSLOT,
            SPAM_PROTECTION_TIME: userConfig["SPAM_PROTECTION_TIME"] || settings_1.config.SPAM_PROTECTION_TIME,
            MAX_CHARACTER_LIMIT: userConfig["MAX_CHARACTER_LIMIT"] || settings_1.config.MAX_CHARACTER_LIMIT,
            MAX_HOURLY_LIMIT: userConfig["MAX_HOURLY_LIMIT"] || settings_1.config.MAX_HOURLY_LIMIT,
            MAX_DAILY_LIMIT: userConfig["MAX_DAILY_LIMIT"] || settings_1.config.MAX_DAILY_LIMIT,
            PER_DAILY_SESSION: userConfig["PER_DAILY_SESSION"] || settings_1.config.PER_DAILY_SESSION,
            PER_HOURLY_SESSION: userConfig["PER_HOURLY_SESSION"] || settings_1.config.PER_HOURLY_SESSION,
            NEWS_PER_SMS: userConfig["NEWS_PER_SMS"] || settings_1.config.NEWS_PER_SMS,
        };
    };
    return Config;
}());
exports.default = Config;
