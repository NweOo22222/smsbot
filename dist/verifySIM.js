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
    setTimeout(function () {
        axios_1.default
            .get("http://localhost:8080/v1/sms")
            .then(function (_a) {
            var messages = _a.data.messages;
            messages = messages.filter(function (_a) {
                var msg_box = _a.msg_box, address = _a.address, sim_slot = _a.sim_slot, _id = _a._id;
                return msg_box === "inbox" &&
                    address === phone &&
                    sim_slot == sim &&
                    !threads.includes(_id);
            });
            threads.unshift.apply(threads, messages.map(function (_a) {
                var _id = _a._id;
                return _id;
            }));
            if (messages.length) {
                threads = threads.slice(0, 20);
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
    }, 5000);
}
exports.default = verifySIM;
