"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var SMS = (function () {
    function SMS() {
    }
    SMS.send = function (phone, message, sim_slot) {
        var uri = new URL(process.env.SMS_GATEWAY_URL);
        uri.pathname = "/v1/sms/send";
        uri.search = "?phone=" + phone;
        uri.searchParams.append("sim_slot", sim_slot);
        uri.searchParams.append("message", message);
        console.log({ phone: phone, message: message, url: uri.toString() });
        return axios_1.default({
            method: "GET",
            url: uri.toString(),
        }).then(function (_a) {
            var data = _a.data;
            return data;
        });
    };
    return SMS;
}());
exports.default = SMS;
