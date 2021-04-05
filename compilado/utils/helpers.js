"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.prototype.loga = function (fg) {
        if (fg === void 0) { fg = true; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (fg)
            console.log.apply(console, args);
    };
    return Helpers;
}());
exports.default = Helpers;
