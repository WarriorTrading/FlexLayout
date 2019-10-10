"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Orientation_1 = require("./Orientation");
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rect.empty = function () {
        return new Rect(0, 0, 0, 0);
    };
    Rect.prototype.clone = function () {
        return new Rect(this.x, this.y, this.width, this.height);
    };
    Rect.prototype.equals = function (rect) {
        if (this.x === rect.x
            && this.y === rect.y
            && this.width === rect.width
            && this.height === rect.height) {
            return true;
        }
        else {
            return false;
        }
    };
    Rect.prototype.getBottom = function () {
        return this.y + this.height;
    };
    Rect.prototype.getRight = function () {
        return this.x + this.width;
    };
    Rect.prototype.positionElement = function (element) {
        this.styleWithPosition(element.style);
    };
    Rect.prototype.styleWithPosition = function (style) {
        style.left = this.x + "px";
        style.top = this.y + "px";
        style.width = Math.max(0, this.width) + "px"; // need Math.max to prevent -ve, cause error in IE
        style.height = Math.max(0, this.height) + "px";
        style.position = "absolute";
        return style;
    };
    Rect.prototype.contains = function (x, y) {
        if (this.x <= x && x <= this.getRight()
            && this.y <= y && y <= this.getBottom()) {
            return true;
        }
        else {
            return false;
        }
    };
    Rect.prototype.removeInsets = function (insets) {
        return new Rect(this.x + insets.left, this.y + insets.top, Math.max(0, this.width - insets.left - insets.right), Math.max(0, this.height - insets.top - insets.bottom));
    };
    Rect.prototype.centerInRect = function (outerRect) {
        this.x = (outerRect.width - this.width) / 2;
        this.y = (outerRect.height - this.height) / 2;
    };
    /** @hidden @internal */
    Rect.prototype._getSize = function (orientation) {
        var prefSize = this.width;
        if (orientation === Orientation_1.default.VERT) {
            prefSize = this.height;
        }
        return prefSize;
    };
    Rect.prototype.toString = function () {
        return "(Rect: x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
    };
    return Rect;
}());
exports.default = Rect;
//# sourceMappingURL=Rect.js.map