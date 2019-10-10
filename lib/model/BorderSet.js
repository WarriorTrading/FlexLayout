"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Orientation_1 = require("../Orientation");
var BorderNode_1 = require("./BorderNode");
var BorderSet = /** @class */ (function () {
    /** @hidden @internal */
    function BorderSet(model) {
        this._model = model;
        this._borders = [];
    }
    /** @hidden @internal */
    BorderSet._fromJson = function (json, model) {
        var borderSet = new BorderSet(model);
        borderSet._borders = json.map(function (borderJson) { return BorderNode_1.default._fromJson(borderJson, model); });
        return borderSet;
    };
    BorderSet.prototype.getBorders = function () {
        return this._borders;
    };
    /** @hidden @internal */
    BorderSet.prototype._forEachNode = function (fn) {
        this._borders.forEach(function (borderNode) {
            fn(borderNode, 0);
            borderNode.getChildren().forEach(function (node) {
                node._forEachNode(fn, 1);
            });
        });
    };
    /** @hidden @internal */
    BorderSet.prototype._toJson = function () {
        return this._borders.map(function (borderNode) { return borderNode._toJson(); });
    };
    /** @hidden @internal */
    BorderSet.prototype._layoutBorder = function (outerInnerRects) {
        var rect = outerInnerRects.outer;
        var height = rect.height;
        var width = rect.width;
        var sumHeight = 0;
        var sumWidth = 0;
        var adjustableHeight = 0;
        var adjustableWidth = 0;
        var showingBorders = this._borders.filter(function (border) { return border.isShowing(); });
        // sum size of borders to see they will fit
        for (var _i = 0, showingBorders_1 = showingBorders; _i < showingBorders_1.length; _i++) {
            var border = showingBorders_1[_i];
            if (border.isShowing()) {
                border._setAdjustedSize(border.getSize());
                var visible = border.getSelected() !== -1;
                if (border.getLocation().getOrientation() === Orientation_1.default.HORZ) {
                    sumWidth += border.getBorderBarSize() + this._model.getSplitterSize();
                    if (visible) {
                        sumWidth += border.getSize();
                        adjustableWidth += border.getSize();
                    }
                }
                else {
                    sumHeight += border.getBorderBarSize() + this._model.getSplitterSize();
                    if (visible) {
                        sumHeight += border.getSize();
                        adjustableHeight += border.getSize();
                    }
                }
            }
        }
        // adjust border sizes if too large
        var j = 0;
        while ((sumWidth > width && adjustableWidth > 0)
            || (sumHeight > height && adjustableHeight > 0)) {
            var border = showingBorders[j];
            if (border.getSelected() !== -1) { // visible
                var size = border._getAdjustedSize();
                if (sumWidth > width && adjustableWidth > 0
                    && border.getLocation().getOrientation() === Orientation_1.default.HORZ
                    && size > 0) {
                    border._setAdjustedSize(size - 1);
                    sumWidth--;
                    adjustableWidth--;
                }
                else if (sumHeight > height && adjustableHeight > 0
                    && border.getLocation().getOrientation() === Orientation_1.default.VERT
                    && size > 0) {
                    border._setAdjustedSize(size - 1);
                    sumHeight--;
                    adjustableHeight--;
                }
            }
            j = (j + 1) % showingBorders.length;
        }
        showingBorders.forEach(function (border) {
            outerInnerRects.outer = border._layoutBorderOuter(outerInnerRects.outer);
        });
        outerInnerRects.inner = outerInnerRects.outer;
        showingBorders.forEach(function (border) {
            outerInnerRects.inner = border._layoutBorderInner(outerInnerRects.inner);
        });
        return outerInnerRects;
    };
    /** @hidden @internal */
    BorderSet.prototype._findDropTargetNode = function (dragNode, x, y) {
        for (var _i = 0, _a = this._borders; _i < _a.length; _i++) {
            var border = _a[_i];
            if (border.isShowing()) {
                var dropInfo = border.canDrop(dragNode, x, y);
                if (dropInfo !== undefined) {
                    return dropInfo;
                }
            }
        }
        return undefined;
    };
    return BorderSet;
}());
exports.default = BorderSet;
//# sourceMappingURL=BorderSet.js.map