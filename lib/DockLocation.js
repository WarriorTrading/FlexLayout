"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockLocation = void 0;
var Orientation_1 = require("./Orientation");
var Rect_1 = require("./Rect");
var DockLocation = /** @class */ (function () {
    /** @internal */
    function DockLocation(name, orientation, indexPlus) {
        this._name = name;
        this._orientation = orientation;
        this._indexPlus = indexPlus;
        DockLocation.values[this._name] = this;
    }
    /** @internal */
    DockLocation.getByName = function (name) {
        return DockLocation.values[name];
    };
    /** @internal */
    DockLocation.getLocation = function (rect, x, y) {
        x = (x - rect.x) / rect.width;
        y = (y - rect.y) / rect.height;
        if (x >= 0.25 && x < 0.75 && y >= 0.25 && y < 0.75) {
            return DockLocation.CENTER;
        }
        // Whether or not the point is in the bottom-left half of the rect
        // +-----+
        // |\    |
        // |x\   |
        // |xx\  |
        // |xxx\ |
        // |xxxx\|
        // +-----+
        var bl = y >= x;
        // Whether or not the point is in the bottom-right half of the rect
        // +-----+
        // |    /|
        // |   /x|
        // |  /xx|
        // | /xxx|
        // |/xxxx|
        // +-----+
        var br = y >= 1 - x;
        if (bl) {
            return br ? DockLocation.BOTTOM : DockLocation.LEFT;
        }
        else {
            return br ? DockLocation.RIGHT : DockLocation.TOP;
        }
    };
    DockLocation.prototype.getName = function () {
        return this._name;
    };
    DockLocation.prototype.getOrientation = function () {
        return this._orientation;
    };
    /** @internal */
    DockLocation.prototype.getDockRect = function (r) {
        if (this === DockLocation.TOP) {
            return new Rect_1.Rect(r.x, r.y, r.width, r.height / 2);
        }
        else if (this === DockLocation.BOTTOM) {
            return new Rect_1.Rect(r.x, r.getBottom() - r.height / 2, r.width, r.height / 2);
        }
        if (this === DockLocation.LEFT) {
            return new Rect_1.Rect(r.x, r.y, r.width / 2, r.height);
        }
        else if (this === DockLocation.RIGHT) {
            return new Rect_1.Rect(r.getRight() - r.width / 2, r.y, r.width / 2, r.height);
        }
        else {
            return r.clone();
        }
    };
    /** @internal */
    DockLocation.prototype.split = function (rect, size) {
        if (this === DockLocation.TOP) {
            var r1 = new Rect_1.Rect(rect.x, rect.y, rect.width, size);
            var r2 = new Rect_1.Rect(rect.x, rect.y + size, rect.width, rect.height - size);
            return { start: r1, end: r2 };
        }
        else if (this === DockLocation.LEFT) {
            var r1 = new Rect_1.Rect(rect.x, rect.y, size, rect.height);
            var r2 = new Rect_1.Rect(rect.x + size, rect.y, rect.width - size, rect.height);
            return { start: r1, end: r2 };
        }
        if (this === DockLocation.RIGHT) {
            var r1 = new Rect_1.Rect(rect.getRight() - size, rect.y, size, rect.height);
            var r2 = new Rect_1.Rect(rect.x, rect.y, rect.width - size, rect.height);
            return { start: r1, end: r2 };
        }
        else {
            // if (this === DockLocation.BOTTOM) {
            var r1 = new Rect_1.Rect(rect.x, rect.getBottom() - size, rect.width, size);
            var r2 = new Rect_1.Rect(rect.x, rect.y, rect.width, rect.height - size);
            return { start: r1, end: r2 };
        }
    };
    /** @internal */
    DockLocation.prototype.reflect = function () {
        if (this === DockLocation.TOP) {
            return DockLocation.BOTTOM;
        }
        else if (this === DockLocation.LEFT) {
            return DockLocation.RIGHT;
        }
        if (this === DockLocation.RIGHT) {
            return DockLocation.LEFT;
        }
        else {
            // if (this === DockLocation.BOTTOM) {
            return DockLocation.TOP;
        }
    };
    DockLocation.prototype.toString = function () {
        return "(DockLocation: name=" + this._name + ", orientation=" + this._orientation + ")";
    };
    DockLocation.values = {};
    DockLocation.TOP = new DockLocation("top", Orientation_1.Orientation.VERT, 0);
    DockLocation.BOTTOM = new DockLocation("bottom", Orientation_1.Orientation.VERT, 1);
    DockLocation.LEFT = new DockLocation("left", Orientation_1.Orientation.HORZ, 0);
    DockLocation.RIGHT = new DockLocation("right", Orientation_1.Orientation.HORZ, 1);
    DockLocation.CENTER = new DockLocation("center", Orientation_1.Orientation.VERT, 0);
    return DockLocation;
}());
exports.DockLocation = DockLocation;
//# sourceMappingURL=DockLocation.js.map