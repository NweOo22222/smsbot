"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var path_1 = require("path");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var middleware_1 = __importDefault(require("./middleware"));
var routes_1 = __importDefault(require("./routes"));
var socket_1 = require("./socket");
var PORT = process.env.PORT || 3001;
var app = express_1.default();
var server = http_1.createServer(app);
socket_1.connect(server);
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(middleware_1.default);
app.use(routes_1.default);
app.use(express_1.default.static(path_1.join(path_1.dirname(__dirname), "static")));
server.listen(PORT, function () {
    return console.log("server is running on http://localhost:%d", PORT);
});
