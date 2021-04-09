"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var middleware_1 = __importDefault(require("./middleware"));
var routes_1 = __importDefault(require("./routes"));
var PORT = process.env.PORT || 3000;
var app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(middleware_1.default);
app.use(routes_1.default);
app.listen(PORT, function () {
    return console.log("server is running on http://localhost:%d", PORT);
});
