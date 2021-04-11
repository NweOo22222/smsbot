"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.connect = void 0;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var socket;
function connect(app) {
    var server = http_1.createServer(app);
    socket = new socket_io_1.Server(server);
    return server;
}
exports.connect = connect;
function io() {
    return socket;
}
exports.io = io;
