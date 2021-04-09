"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.connect = void 0;
var socket_io_1 = __importDefault(require("socket.io"));
var io;
function connect(server) {
    io = new socket_io_1.default.Server(server);
    io.on("connection", function (socket) {
        socket.on("", function () {
        });
    });
    return io;
}
exports.connect = connect;
function socket() {
    return io;
}
exports.socket = socket;
