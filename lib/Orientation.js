"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orientation = void 0;
var Orientation = /** @class */ (function () {
    /** @internal */
    function Orientation(name) {
        this._name = name;
    }
    Orientation.flip = function (from) {
        if (from === Orientation.HORZ) {
            return Orientation.VERT;
        }
        else {
            return Orientation.HORZ;
        }
    };
    Orientation.prototype.getName = function () {
        return this._name;
    };
    Orientation.prototype.toString = function () {
        return this._name;
    };
    Orientation.HORZ = new Orientation("horz");
    Orientation.VERT = new Orientation("vert");
    return Orientation;
}());
exports.Orientation = Orientation;
//# sourceMappingURL=Orientation.js.map