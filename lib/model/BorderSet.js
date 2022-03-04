"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderSet = void 0;
var Orientation_1 = require("../Orientation");
var BorderNode_1 = require("./BorderNode");
var BorderSet = /** @class */ (function () {
    /** @internal */
    function BorderSet(model) {
        this._model = model;
        this._borders = [];
    }
    /** @internal */
    BorderSet._fromJson = function (json, model) {
        var borderSet = new BorderSet(model);
        borderSet._borders = json.map(function (borderJson) { return BorderNode_1.BorderNode._fromJson(borderJson, model); });
        return borderSet;
    };
    BorderSet.prototype.getBorders = function () {
        return this._borders;
    };
    /** @internal */
    BorderSet.prototype._forEachNode = function (fn) {
        for (var _i = 0, _a = this._borders; _i < _a.length; _i++) {
            var borderNode = _a[_i];
            fn(borderNode, 0);
            for (var _b = 0, _c = borderNode.getChildren(); _b < _c.length; _b++) {
                var node = _c[_b];
                node._forEachNode(fn, 1);
            }
        }
    };
    /** @internal */
    BorderSet.prototype._toJson = function () {
        return this._borders.map(function (borderNode) { return borderNode.toJson(); });
    };
    /** @internal */
    BorderSet.prototype._layoutBorder = function (outerInnerRects, metrics) {
        var rect = outerInnerRects.outer;
        var rootRow = this._model.getRoot();
        var height = Math.max(0, rect.height - rootRow.getMinHeight());
        var width = Math.max(0, rect.width - rootRow.getMinWidth());
        var sumHeight = 0;
        var sumWidth = 0;
        var adjustableHeight = 0;
        var adjustableWidth = 0;
        var showingBorders = this._borders.filter(function (border) { return border.isShowing(); });
        // sum size of borders to see they will fit
        for (var _i = 0, showingBorders_1 = showingBorders; _i < showingBorders_1.length; _i++) {
            var border = showingBorders_1[_i];
            border._setAdjustedSize(border.getSize());
            var visible = border.getSelected() !== -1;
            if (border.getLocation().getOrientation() === Orientation_1.Orientation.HORZ) {
                sumWidth += border.getBorderBarSize();
                if (visible) {
                    width -= this._model.getSplitterSize();
                    sumWidth += border.getSize();
                    adjustableWidth += border.getSize();
                }
            }
            else {
                sumHeight += border.getBorderBarSize();
                if (visible) {
                    height -= this._model.getSplitterSize();
                    sumHeight += border.getSize();
                    adjustableHeight += border.getSize();
                }
            }
        }
        // adjust border sizes if too large
        var j = 0;
        var adjusted = false;
        while ((sumWidth > width && adjustableWidth > 0) || (sumHeight > height && adjustableHeight > 0)) {
            var border = showingBorders[j];
            if (border.getSelected() !== -1) {
                // visible
                var size = border._getAdjustedSize();
                if (sumWidth > width && adjustableWidth > 0 && border.getLocation().getOrientation() === Orientation_1.Orientation.HORZ && size > 0
                    && size > border.getMinSize()) {
                    border._setAdjustedSize(size - 1);
                    sumWidth--;
                    adjustableWidth--;
                    adjusted = true;
                }
                else if (sumHeight > height && adjustableHeight > 0 && border.getLocation().getOrientation() === Orientation_1.Orientation.VERT && size > 0
                    && size > border.getMinSize()) {
                    border._setAdjustedSize(size - 1);
                    sumHeight--;
                    adjustableHeight--;
                    adjusted = true;
                }
            }
            j = (j + 1) % showingBorders.length;
            if (j === 0) {
                if (adjusted) {
                    adjusted = false;
                }
                else {
                    break;
                }
            }
        }
        for (var _a = 0, showingBorders_2 = showingBorders; _a < showingBorders_2.length; _a++) {
            var border = showingBorders_2[_a];
            outerInnerRects.outer = border._layoutBorderOuter(outerInnerRects.outer, metrics);
        }
        outerInnerRects.inner = outerInnerRects.outer;
        for (var _b = 0, showingBorders_3 = showingBorders; _b < showingBorders_3.length; _b++) {
            var border = showingBorders_3[_b];
            outerInnerRects.inner = border._layoutBorderInner(outerInnerRects.inner, metrics);
        }
        return outerInnerRects;
    };
    /** @internal */
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
exports.BorderSet = BorderSet;
//# sourceMappingURL=BorderSet.js.map