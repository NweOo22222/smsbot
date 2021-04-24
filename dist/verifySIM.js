"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Config_1 = __importDefault(require("./app/Config"));
var threads = [];
function verifySIM(req, res, next) {
    var phone = req.query["phone"];
    var sim = Number(Config_1.default.get("USE_SIMSLOT"));
    if ("test" in req.query || sim == -1) {
        return next();
    }
    axios_1.default
        .get("http://localhost:8080/v1/sms")
        .then(function (_a) {
        var messages = _a.data.messages;
        messages = messages.filter(function (message) {
            return message.msg_box === "inbox" &&
                message.address === phone &&
                message.sim_slot == sim &&
                !threads.includes(message._id);
        });
        if (messages.length) {
            threads.push.apply(threads, messages.map(function (_a) {
                var _id = _a._id;
                return _id;
            }));
            var s = threads.length - 20;
            threads = s > 0 ? threads.slice(s, 20) : threads;
            req["id"] = messages[0]["_id"];
            next();
        }
        else {
            console.log("ignored to response %s, SIM Slot not matched", phone);
            res.status(401).end();
        }
    })
        .catch(function (e) {
        console.log(e.message, "Could not verify SIM Slot %s", sim);
        next();
    });
}
exports.default = verifySIM;
