"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var axios_1 = __importDefault(require("axios"));
var lodash_1 = require("lodash");
var router = express_1.Router();
var response = {};
router.get("/", function (req, res) {
    axios_1.default
        .get('http://localhost:3300/e/v1/_articles.json?orderBy="$key"&limitToLast=20')
        .then(function (_a) {
        var data = _a.data;
        data = lodash_1.toArray(data).reverse();
        res.json(data);
    });
});
exports.default = router;
