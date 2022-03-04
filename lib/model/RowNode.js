"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowNode = void 0;
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var DropInfo_1 = require("../DropInfo");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Types_1 = require("../Types");
var BorderNode_1 = require("./BorderNode");
var Node_1 = require("./Node");
var SplitterNode_1 = require("./SplitterNode");
var TabSetNode_1 = require("./TabSetNode");
var RowNode = /** @class */ (function (_super) {
    __extends(RowNode, _super);
    /** @internal */
    function RowNode(model, json) {
        var _this = _super.call(this, model) || this;
        _this._dirty = true;
        _this._drawChildren = [];
        _this._minHeight = 0;
        _this._minWidth = 0;
        RowNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @internal */
    RowNode._fromJson = function (json, model) {
        var newLayoutNode = new RowNode(model, json);
        if (json.children != null) {
            for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
                var jsonChild = _a[_i];
                if (jsonChild.type === TabSetNode_1.TabSetNode.TYPE) {
                    var child = TabSetNode_1.TabSetNode._fromJson(jsonChild, model);
                    newLayoutNode._addChild(child);
                }
                else {
                    var child = RowNode._fromJson(jsonChild, model);
                    newLayoutNode._addChild(child);
                }
            }
        }
        return newLayoutNode;
    };
    /** @internal */
    RowNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.AttributeDefinitions();
        attributeDefinitions.add("type", RowNode.TYPE, true).setType(Attribute_1.Attribute.STRING).setFixed();
        attributeDefinitions.add("id", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("weight", 100).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("width", undefined).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("height", undefined).setType(Attribute_1.Attribute.NUMBER);
        return attributeDefinitions;
    };
    RowNode.prototype.getWeight = function () {
        return this._attributes.weight;
    };
    RowNode.prototype.getWidth = function () {
        return this._getAttr("width");
    };
    RowNode.prototype.getHeight = function () {
        return this._getAttr("height");
    };
    /** @internal */
    RowNode.prototype._setWeight = function (weight) {
        this._attributes.weight = weight;
    };
    /** @internal */
    RowNode.prototype._layout = function (rect, metrics) {
        _super.prototype._layout.call(this, rect, metrics);
        var pixelSize = this._rect._getSize(this.getOrientation());
        var totalWeight = 0;
        var fixedPixels = 0;
        var prefPixels = 0;
        var totalPrefWeight = 0;
        var drawChildren = this._getDrawChildren();
        for (var _i = 0, drawChildren_1 = drawChildren; _i < drawChildren_1.length; _i++) {
            var child = drawChildren_1[_i];
            var prefSize = child._getPrefSize(this.getOrientation());
            if (child._isFixed()) {
                if (prefSize !== undefined) {
                    fixedPixels += prefSize;
                }
            }
            else {
                if (prefSize === undefined) {
                    totalWeight += child.getWeight();
                }
                else {
                    prefPixels += prefSize;
                    totalPrefWeight += child.getWeight();
                }
            }
        }
        var resizePreferred = false;
        var availablePixels = pixelSize - fixedPixels - prefPixels;
        if (availablePixels < 0) {
            availablePixels = pixelSize - fixedPixels;
            resizePreferred = true;
            totalWeight += totalPrefWeight;
        }
        // assign actual pixel sizes
        var totalSizeGiven = 0;
        var variableSize = 0;
        for (var _a = 0, drawChildren_2 = drawChildren; _a < drawChildren_2.length; _a++) {
            var child = drawChildren_2[_a];
            var prefSize = child._getPrefSize(this.getOrientation());
            if (child._isFixed()) {
                if (prefSize !== undefined) {
                    child._setTempSize(prefSize);
                }
            }
            else {
                if (prefSize == null || resizePreferred) {
                    if (totalWeight === 0) {
                        child._setTempSize(0);
                    }
                    else {
                        var minSize = child.getMinSize(this.getOrientation());
                        var size = Math.floor(availablePixels * (child.getWeight() / totalWeight));
                        child._setTempSize(Math.max(minSize, size));
                    }
                    variableSize += child._getTempSize();
                }
                else {
                    child._setTempSize(prefSize);
                }
            }
            totalSizeGiven += child._getTempSize();
        }
        // adjust sizes to exactly fit
        if (variableSize > 0) {
            while (totalSizeGiven < pixelSize) {
                for (var _b = 0, drawChildren_3 = drawChildren; _b < drawChildren_3.length; _b++) {
                    var child = drawChildren_3[_b];
                    if (!(child instanceof SplitterNode_1.SplitterNode)) {
                        var prefSize = child._getPrefSize(this.getOrientation());
                        if (!child._isFixed() && (prefSize === undefined || resizePreferred) && totalSizeGiven < pixelSize) {
                            child._setTempSize(child._getTempSize() + 1);
                            totalSizeGiven++;
                        }
                    }
                }
            }
            // decrease size using nodes not at there minimum
            while (totalSizeGiven > pixelSize) {
                var changed = false;
                for (var _c = 0, drawChildren_4 = drawChildren; _c < drawChildren_4.length; _c++) {
                    var child = drawChildren_4[_c];
                    if (!(child instanceof SplitterNode_1.SplitterNode)) {
                        var minSize = child.getMinSize(this.getOrientation());
                        var size = child._getTempSize();
                        if (size > minSize && totalSizeGiven > pixelSize) {
                            child._setTempSize(child._getTempSize() - 1);
                            totalSizeGiven--;
                            changed = true;
                        }
                    }
                }
                if (!changed) {
                    // all children are at min values
                    break;
                }
            }
            // if still too big then simply reduce all nodes until fits
            while (totalSizeGiven > pixelSize) {
                var changed = false;
                for (var _d = 0, drawChildren_5 = drawChildren; _d < drawChildren_5.length; _d++) {
                    var child = drawChildren_5[_d];
                    if (!(child instanceof SplitterNode_1.SplitterNode)) {
                        var size = child._getTempSize();
                        if (size > 0 && totalSizeGiven > pixelSize) {
                            child._setTempSize(child._getTempSize() - 1);
                            totalSizeGiven--;
                            changed = true;
                        }
                    }
                }
                if (!changed) {
                    // all children are at 0 values
                    break;
                }
            }
        }
        // layout children
        var p = 0;
        for (var _e = 0, drawChildren_6 = drawChildren; _e < drawChildren_6.length; _e++) {
            var child = drawChildren_6[_e];
            if (this.getOrientation() === Orientation_1.Orientation.HORZ) {
                child._layout(new Rect_1.Rect(this._rect.x + p, this._rect.y, child._getTempSize(), this._rect.height), metrics);
            }
            else {
                child._layout(new Rect_1.Rect(this._rect.x, this._rect.y + p, this._rect.width, child._getTempSize()), metrics);
            }
            p += child._getTempSize();
        }
        return true;
    };
    /** @internal */
    RowNode.prototype._getSplitterBounds = function (splitterNode, useMinSize) {
        if (useMinSize === void 0) { useMinSize = false; }
        var pBounds = [0, 0];
        var drawChildren = this._getDrawChildren();
        var p = drawChildren.indexOf(splitterNode);
        var node1 = drawChildren[p - 1];
        var node2 = drawChildren[p + 1];
        if (this.getOrientation() === Orientation_1.Orientation.HORZ) {
            var minSize1 = useMinSize ? node1.getMinWidth() : 0;
            var minSize2 = useMinSize ? node2.getMinWidth() : 0;
            pBounds[0] = node1.getRect().x + minSize1;
            pBounds[1] = node2.getRect().getRight() - splitterNode.getWidth() - minSize2;
        }
        else {
            var minSize1 = useMinSize ? node1.getMinHeight() : 0;
            var minSize2 = useMinSize ? node2.getMinHeight() : 0;
            pBounds[0] = node1.getRect().y + minSize1;
            pBounds[1] = node2.getRect().getBottom() - splitterNode.getHeight() - minSize2;
        }
        return pBounds;
    };
    /** @internal */
    RowNode.prototype._calculateSplit = function (splitter, splitterPos) {
        var rtn;
        var drawChildren = this._getDrawChildren();
        var p = drawChildren.indexOf(splitter);
        var pBounds = this._getSplitterBounds(splitter);
        var weightedLength = drawChildren[p - 1].getWeight() + drawChildren[p + 1].getWeight();
        var pixelWidth1 = Math.max(0, splitterPos - pBounds[0]);
        var pixelWidth2 = Math.max(0, pBounds[1] - splitterPos);
        if (pixelWidth1 + pixelWidth2 > 0) {
            var weight1 = (pixelWidth1 * weightedLength) / (pixelWidth1 + pixelWidth2);
            var weight2 = (pixelWidth2 * weightedLength) / (pixelWidth1 + pixelWidth2);
            rtn = {
                node1Id: drawChildren[p - 1].getId(),
                weight1: weight1,
                pixelWidth1: pixelWidth1,
                node2Id: drawChildren[p + 1].getId(),
                weight2: weight2,
                pixelWidth2: pixelWidth2,
            };
        }
        return rtn;
    };
    /** @internal */
    RowNode.prototype._getDrawChildren = function () {
        if (this._dirty) {
            this._drawChildren = [];
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (i !== 0) {
                    var newSplitter = new SplitterNode_1.SplitterNode(this._model);
                    newSplitter._setParent(this);
                    this._drawChildren.push(newSplitter);
                }
                this._drawChildren.push(child);
            }
            this._dirty = false;
        }
        return this._drawChildren;
    };
    /** @internal */
    RowNode.prototype.getMinSize = function (orientation) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return this.getMinWidth();
        }
        else {
            return this.getMinHeight();
        }
    };
    /** @internal */
    RowNode.prototype.getMinWidth = function () {
        return this._minWidth;
    };
    /** @internal */
    RowNode.prototype.getMinHeight = function () {
        return this._minHeight;
    };
    /** @internal */
    RowNode.prototype.calcMinSize = function () {
        this._minHeight = 0;
        this._minWidth = 0;
        var first = true;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            var c = child;
            if (c instanceof RowNode) {
                c.calcMinSize();
            }
            if (this.getOrientation() === Orientation_1.Orientation.VERT) {
                this._minHeight += c.getMinHeight();
                if (!first) {
                    this._minHeight += this._model.getSplitterSize();
                }
                this._minWidth = Math.max(this._minWidth, c.getMinWidth());
            }
            else {
                this._minWidth += c.getMinWidth();
                if (!first) {
                    this._minWidth += this._model.getSplitterSize();
                }
                this._minHeight = Math.max(this._minHeight, c.getMinHeight());
            }
            first = false;
        }
    };
    /** @internal */
    RowNode.prototype._tidy = function () {
        var i = 0;
        while (i < this._children.length) {
            var child = this._children[i];
            if (child instanceof RowNode) {
                child._tidy();
                var childChildren = child.getChildren();
                if (childChildren.length === 0) {
                    this._removeChild(child);
                }
                else if (childChildren.length === 1) {
                    // hoist child/children up to this level
                    var subchild = childChildren[0];
                    this._removeChild(child);
                    if (subchild instanceof RowNode) {
                        var subChildrenTotal = 0;
                        var subChildChildren = subchild.getChildren();
                        for (var _i = 0, subChildChildren_1 = subChildChildren; _i < subChildChildren_1.length; _i++) {
                            var ssc = subChildChildren_1[_i];
                            var subsubChild = ssc;
                            subChildrenTotal += subsubChild.getWeight();
                        }
                        for (var j = 0; j < subChildChildren.length; j++) {
                            var subsubChild = subChildChildren[j];
                            subsubChild._setWeight((child.getWeight() * subsubChild.getWeight()) / subChildrenTotal);
                            this._addChild(subsubChild, i + j);
                        }
                    }
                    else {
                        subchild._setWeight(child.getWeight());
                        this._addChild(subchild, i);
                    }
                }
                else {
                    i++;
                }
            }
            else if (child instanceof TabSetNode_1.TabSetNode && child.getChildren().length === 0) {
                if (child.isEnableDeleteWhenEmpty()) {
                    this._removeChild(child);
                    if (child === this._model.getMaximizedTabset()) {
                        this._model._setMaximizedTabset(undefined);
                    }
                }
                else {
                    i++;
                }
            }
            else {
                i++;
            }
        }
        // add tabset into empty root
        if (this === this._model.getRoot() && this._children.length === 0) {
            var callback = this._model._getOnCreateTabSet();
            var attrs = callback ? callback() : {};
            attrs = __assign(__assign({}, attrs), { selected: -1 });
            var child = new TabSetNode_1.TabSetNode(this._model, attrs);
            this._model._setActiveTabset(child);
            this._addChild(child);
        }
    };
    /** @internal */
    RowNode.prototype.canDrop = function (dragNode, x, y) {
        var yy = y - this._rect.y;
        var xx = x - this._rect.x;
        var w = this._rect.width;
        var h = this._rect.height;
        var margin = 10; // height of edge rect
        var half = 50; // half width of edge rect
        var dropInfo;
        if (this._model.isEnableEdgeDock() && this._parent === undefined) {
            // _root row
            if (x < this._rect.x + margin && yy > h / 2 - half && yy < h / 2 + half) {
                var dockLocation = DockLocation_1.DockLocation.LEFT;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.width = outlineRect.width / 2;
                dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT_EDGE);
            }
            else if (x > this._rect.getRight() - margin && yy > h / 2 - half && yy < h / 2 + half) {
                var dockLocation = DockLocation_1.DockLocation.RIGHT;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.width = outlineRect.width / 2;
                outlineRect.x += outlineRect.width;
                dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT_EDGE);
            }
            else if (y < this._rect.y + margin && xx > w / 2 - half && xx < w / 2 + half) {
                var dockLocation = DockLocation_1.DockLocation.TOP;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.height = outlineRect.height / 2;
                dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT_EDGE);
            }
            else if (y > this._rect.getBottom() - margin && xx > w / 2 - half && xx < w / 2 + half) {
                var dockLocation = DockLocation_1.DockLocation.BOTTOM;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.height = outlineRect.height / 2;
                outlineRect.y += outlineRect.height;
                dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT_EDGE);
            }
            if (dropInfo !== undefined) {
                if (!dragNode._canDockInto(dragNode, dropInfo)) {
                    return undefined;
                }
            }
        }
        return dropInfo;
    };
    /** @internal */
    RowNode.prototype.drop = function (dragNode, location, index) {
        var dockLocation = location;
        var parent = dragNode.getParent();
        if (parent) {
            parent._removeChild(dragNode);
        }
        if (parent !== undefined && parent.getType() === TabSetNode_1.TabSetNode.TYPE) {
            parent._setSelected(0);
        }
        if (parent !== undefined && parent.getType() === BorderNode_1.BorderNode.TYPE) {
            parent._setSelected(-1);
        }
        var tabSet;
        if (dragNode instanceof TabSetNode_1.TabSetNode) {
            tabSet = dragNode;
        }
        else {
            var callback = this._model._getOnCreateTabSet();
            tabSet = new TabSetNode_1.TabSetNode(this._model, callback ? callback(dragNode) : {});
            tabSet._addChild(dragNode);
        }
        var size = this._children.reduce(function (sum, child) {
            return sum + child.getWeight();
        }, 0);
        if (size === 0) {
            size = 100;
        }
        tabSet._setWeight(size / 3);
        var horz = !this._model.isRootOrientationVertical();
        if (horz && dockLocation === DockLocation_1.DockLocation.LEFT || !horz && dockLocation === DockLocation_1.DockLocation.TOP) {
            this._addChild(tabSet, 0);
        }
        else if (horz && dockLocation === DockLocation_1.DockLocation.RIGHT || !horz && dockLocation === DockLocation_1.DockLocation.BOTTOM) {
            this._addChild(tabSet);
        }
        else if (horz && dockLocation === DockLocation_1.DockLocation.TOP || !horz && dockLocation === DockLocation_1.DockLocation.LEFT) {
            var vrow = new RowNode(this._model, {});
            var hrow = new RowNode(this._model, {});
            hrow._setWeight(75);
            tabSet._setWeight(25);
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                hrow._addChild(child);
            }
            this._removeAll();
            vrow._addChild(tabSet);
            vrow._addChild(hrow);
            this._addChild(vrow);
        }
        else if (horz && dockLocation === DockLocation_1.DockLocation.BOTTOM || !horz && dockLocation === DockLocation_1.DockLocation.RIGHT) {
            var vrow = new RowNode(this._model, {});
            var hrow = new RowNode(this._model, {});
            hrow._setWeight(75);
            tabSet._setWeight(25);
            for (var _b = 0, _c = this._children; _b < _c.length; _b++) {
                var child = _c[_b];
                hrow._addChild(child);
            }
            this._removeAll();
            vrow._addChild(hrow);
            vrow._addChild(tabSet);
            this._addChild(vrow);
        }
        this._model._setActiveTabset(tabSet);
        this._model._tidy();
    };
    RowNode.prototype.toJson = function () {
        var json = {};
        RowNode._attributeDefinitions.toJson(json, this._attributes);
        json.children = [];
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            json.children.push(child.toJson());
        }
        return json;
    };
    RowNode.prototype.isEnableDrop = function () {
        return true;
    };
    /** @internal */
    RowNode.prototype._getPrefSize = function (orientation) {
        var prefSize = this.getWidth();
        if (orientation === Orientation_1.Orientation.VERT) {
            prefSize = this.getHeight();
        }
        return prefSize;
    };
    /** @internal */
    RowNode.prototype._getAttributeDefinitions = function () {
        return RowNode._attributeDefinitions;
    };
    /** @internal */
    RowNode.prototype._updateAttrs = function (json) {
        RowNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @internal */
    RowNode.getAttributeDefinitions = function () {
        return RowNode._attributeDefinitions;
    };
    RowNode.TYPE = "row";
    /** @internal */
    RowNode._attributeDefinitions = RowNode._createAttributeDefinitions();
    return RowNode;
}(Node_1.Node));
exports.RowNode = RowNode;
//# sourceMappingURL=RowNode.js.map