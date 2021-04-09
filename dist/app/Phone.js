"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var Session_1 = __importDefault(require("./Session"));
var Phone = (function () {
    function Phone(number) {
        var _this = this;
        this.number = number;
        guessOperator(this);
        this.id = number;
        var clients = DB_1.default.read()["phone"];
        var i = clients.findIndex(function (_a) {
            var id = _a.id;
            return id == _this.id;
        });
        var phone = i === -1 ? {} : clients[i];
        this.session = new Session_1.default(phone.session || {});
        this.first_date = new Date(phone.first_date || Date.now());
        this.last_date = new Date(phone.last_date || Date.now());
        this.total_count = phone.total_count || 0;
        this.headlines = phone.headlines || [];
        this.articles = phone.articles || [];
    }
    Phone.prototype.toJSON = function () {
        return this;
    };
    Phone.prototype.incr = function (action) {
        this.session.incr(action);
        this.total_count++;
        return this;
    };
    Phone.prototype.markAsSent = function (headlines) {
        var _this = this;
        headlines.forEach(function (headline) {
            _this.headlines.push(headline.id);
        });
        return this;
    };
    Phone.prototype.save = function () {
        var _this = this;
        var _a;
        this.total_count++;
        var db = DB_1.default.read();
        var i = (_a = db["phone"]) === null || _a === void 0 ? void 0 : _a.findIndex(function (_a) {
            var id = _a.id;
            return id == _this.id;
        });
        if (i === -1) {
            db["phone"].push(this.toJSON());
        }
        else {
            db["phone"][i] = this.toJSON();
        }
        DB_1.default.save(db);
    };
    Object.defineProperty(Phone.prototype, "localNumber", {
        get: function () {
            return this.number.replace("+95", "0");
        },
        enumerable: false,
        configurable: true
    });
    return Phone;
}());
exports.default = Phone;
function guessOperator(phone) {
    var matched = phone.number.match(/^(?:\+95|0)?9(\d)(\d)(\d{5,7})/) || [];
    if (!matched)
        return;
    switch (matched[1]) {
        case "2":
        case "3":
        case "4":
        case "5":
        case "8":
            phone.operator = "MPT";
            break;
        case "6":
            phone.operator = "MYTEL";
            break;
        case "7":
            phone.operator = "Telenor";
            break;
        case "9":
            phone.operator = "Ooredoo";
            break;
    }
}
