"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var routes_1 = __importDefault(require("./routes"));
dotenv_1.config();
var PORT = process.env.PORT || 3000;
var app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_fileupload_1.default());
app.use(routes_1.default);
app.listen(PORT, function () {
    return console.log("server is running on http://localhost:%d", PORT);
});
