"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var config = __importStar(require("../settings"));
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
    Config.get = function (keyName) {
        return this.read()[keyName] || config[keyName] || undefined;
    };
    Config.getAll = function () {
        var result = [];
        var userConfig = this.read();
        Object.entries(config).forEach(function (_a) {
            var keyName = _a[0], defaultValue = _a[1];
            return (result[keyName] = userConfig[keyName] || defaultValue);
        });
        return result;
    };
    return Config;
}());
exports.default = Config;
