"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var socket_1 = require("./socket");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var routes_1 = __importDefault(require("./routes"));
var api_1 = __importDefault(require("./api"));
var DB_1 = __importDefault(require("./app/DB"));
var Config_1 = __importDefault(require("./app/Config"));
var PORT = process.env.PORT || 3001;
var app = express_1.default();
dotenv_1.config();
DB_1.default.init();
Config_1.default.init();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    req["phone"] = String(req.query.phone).replace(/^\s/, "+");
    next();
});
app.use("/api", api_1.default);
app.use(routes_1.default);
app.use(express_1.default.static(path_1.join(path_1.dirname(__dirname), "static")));
socket_1.connect(app).listen(PORT, function () {
    return console.log("server is running on http://localhost:%d", PORT);
});