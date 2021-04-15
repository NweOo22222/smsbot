"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Phone_1 = __importDefault(require("./Phone"));
var Message = (function () {
    function Message(_a) {
        var address = _a.address, body = _a.body;
        this.body = body;
        this.phone = new Phone_1.default(address);
    }
    Message.prototype.via = function (operator) {
        return this.phone.operator === operator;
    };
    Message.fetch = function () {
        return axios_1.default
            .get(process.env.SMS_GATEWAY_URL + "/v1/sms")
            .then(function (_a) {
            var data = _a.data;
            return data["messages"];
        })
            .then(function (messages) { return messages.map(function (message) { return new Message(message); }); });
    };
    return Message;
}());
exports.default = Message;
