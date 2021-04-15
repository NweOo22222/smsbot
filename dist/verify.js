"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Config_1 = __importDefault(require("./app/Config"));
function verify(req, res, next) {
    var SIM_SLOT = Config_1.default.get("SIM_SLOT");
    if (SIM_SLOT == -1) {
        return next();
    }
    axios_1.default
        .get("http://192.168.100.99:8080/v1/sms?limit=30")
        .then(function (_a) {
        var messages = _a.data.messages;
        messages = messages.filter(function (_a) {
            var address = _a.address, msg_box = _a.msg_box;
            return msg_box == "inbox" && address == req["phone"];
        });
        if (messages.length) {
            next();
        }
        else {
            res.status(426).end();
        }
    })
        .catch(function (e) {
        console.log(e.message, "cannot verify SIM Slot");
        next();
    });
}
exports.default = verify;
