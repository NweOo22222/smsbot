"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Phone_1 = __importDefault(require("./Phone"));
var Message = (function () {
    function Message(_a) {
        var sim_slot = _a.sim_slot, msg_box = _a.msg_box, address = _a.address, timestamps = _a.timestamps, body = _a.body, _id = _a._id;
        this.id = _id;
        this.slot = sim_slot;
        this.incoming = msg_box === "inbox";
        this.body = body;
        this.phone = new Phone_1.default(address);
        this.datetime = new Date(parseInt(timestamps["delivery"] || timestamps["sent"]));
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
    Message.inbox = function (messages) {
        return messages.filter(function (message) { return !!message.incoming; });
    };
    Message.outbox = function (messages) {
        return messages.filter(function (message) { return !message.incoming; });
    };
    return Message;
}());
exports.default = Message;
