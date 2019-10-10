"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Orientation = /** @class */ (function () {
    /** @hidden @internal */
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
    Orientation.prototype.toString = function () {
        return this._name;
    };
    Orientation.HORZ = new Orientation("horz");
    Orientation.VERT = new Orientation("vert");
    return Orientation;
}());
exports.default = Orientation;
//# sourceMappingURL=Orientation.js.map