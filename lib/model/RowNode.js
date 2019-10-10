"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var DropInfo_1 = require("../DropInfo");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var BorderNode_1 = require("./BorderNode");
var Node_1 = require("./Node");
var SplitterNode_1 = require("./SplitterNode");
var TabSetNode_1 = require("./TabSetNode");
var RowNode = /** @class */ (function (_super) {
    __extends(RowNode, _super);
    /** @hidden @internal */
    function RowNode(model, json) {
        var _this = _super.call(this, model) || this;
        _this._dirty = true;
        _this._drawChildren = [];
        RowNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @hidden @internal */
    RowNode._fromJson = function (json, model) {
        var newLayoutNode = new RowNode(model, json);
        if (json.children != null) {
            for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
                var jsonChild = _a[_i];
                if (jsonChild.type === TabSetNode_1.default.TYPE) {
                    var child = TabSetNode_1.default._fromJson(jsonChild, model);
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
    /** @hidden @internal */
    RowNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.default();
        attributeDefinitions.add("type", RowNode.TYPE, true);
        attributeDefinitions.add("id", undefined);
        attributeDefinitions.add("weight", 100);
        attributeDefinitions.add("width", undefined);
        attributeDefinitions.add("height", undefined);
        return attributeDefinitions;
    };
    RowNode.prototype.getWeight = function () {
        return this._attributes.weight;
    };
    RowNode.prototype.getWidth = function () {
        return this._getAttributeAsNumberOrUndefined("width");
    };
    RowNode.prototype.getHeight = function () {
        return this._getAttributeAsNumberOrUndefined("height");
    };
    /** @hidden @internal */
    RowNode.prototype._setWeight = function (weight) {
        this._attributes.weight = weight;
    };
    /** @hidden @internal */
    RowNode.prototype._layout = function (rect) {
        _super.prototype._layout.call(this, rect);
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
                        child._setTempSize(Math.floor(availablePixels * (child.getWeight() / totalWeight)));
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
                    var prefSize = child._getPrefSize(this.getOrientation());
                    if (!child._isFixed() && (prefSize === undefined || resizePreferred) && totalSizeGiven < pixelSize) {
                        child._setTempSize(child._getTempSize() + 1);
                        totalSizeGiven++;
                    }
                }
            }
        }
        // layout children
        var p = 0;
        for (var _c = 0, drawChildren_4 = drawChildren; _c < drawChildren_4.length; _c++) {
            var child = drawChildren_4[_c];
            if (this.getOrientation() === Orientation_1.default.HORZ) {
                child._layout(new Rect_1.default(this._rect.x + p, this._rect.y, child._getTempSize(), this._rect.height));
            }
            else {
                child._layout(new Rect_1.default(this._rect.x, this._rect.y + p, this._rect.width, child._getTempSize()));
            }
            p += child._getTempSize();
        }
        return true;
    };
    /** @hidden @internal */
    RowNode.prototype._getSplitterBounds = function (splitterNode) {
        var pBounds = [0, 0];
        var drawChildren = this._getDrawChildren();
        var p = drawChildren.indexOf(splitterNode);
        if (this.getOrientation() === Orientation_1.default.HORZ) {
            pBounds[0] = drawChildren[p - 1].getRect().x;
            pBounds[1] = drawChildren[p + 1].getRect().getRight() - splitterNode.getWidth();
        }
        else {
            pBounds[0] = drawChildren[p - 1].getRect().y;
            pBounds[1] = drawChildren[p + 1].getRect().getBottom() - splitterNode.getHeight();
        }
        return pBounds;
    };
    /** @hidden @internal */
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
                node1Id: drawChildren[p - 1].getId(), weight1: weight1, pixelWidth1: pixelWidth1,
                node2Id: drawChildren[p + 1].getId(), weight2: weight2, pixelWidth2: pixelWidth2
            };
        }
        return rtn;
    };
    /** @hidden @internal */
    RowNode.prototype._getDrawChildren = function () {
        if (this._dirty) {
            this._drawChildren = [];
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (i !== 0) {
                    var newSplitter = new SplitterNode_1.default(this._model);
                    newSplitter._setParent(this);
                    this._drawChildren.push(newSplitter);
                }
                this._drawChildren.push(child);
            }
            this._dirty = false;
        }
        return this._drawChildren;
    };
    /** @hidden @internal */
    RowNode.prototype._tidy = function () {
        // console.log("a", this._model.toString());
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
                            subsubChild._setWeight(child.getWeight() * subsubChild.getWeight() / subChildrenTotal);
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
            else if (child instanceof TabSetNode_1.default && child.getChildren().length === 0) {
                if (child.isEnableDeleteWhenEmpty()) {
                    this._removeChild(child);
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
            var child = new TabSetNode_1.default(this._model, { type: "tabset" });
            this._addChild(child);
        }
        // console.log("b", this._model.toString());
    };
    /** @hidden @internal */
    RowNode.prototype.canDrop = function (dragNode, x, y) {
        var yy = y - this._rect.y;
        var xx = x - this._rect.x;
        var w = this._rect.width;
        var h = this._rect.height;
        var margin = 10; // height of edge rect
        var half = 50; // half width of edge rect
        var dropInfo;
        if (this._model.isEnableEdgeDock() && this._parent === undefined) { // _root row
            if (x < this._rect.x + margin && (yy > h / 2 - half && yy < h / 2 + half)) {
                var dockLocation = DockLocation_1.default.LEFT;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.width = outlineRect.width / 2;
                dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect_edge");
            }
            else if (x > this._rect.getRight() - margin && (yy > h / 2 - half && yy < h / 2 + half)) {
                var dockLocation = DockLocation_1.default.RIGHT;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.width = outlineRect.width / 2;
                outlineRect.x += outlineRect.width;
                dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect_edge");
            }
            else if (y < this._rect.y + margin && (xx > w / 2 - half && xx < w / 2 + half)) {
                var dockLocation = DockLocation_1.default.TOP;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.height = outlineRect.height / 2;
                dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect_edge");
            }
            else if (y > this._rect.getBottom() - margin && (xx > w / 2 - half && xx < w / 2 + half)) {
                var dockLocation = DockLocation_1.default.BOTTOM;
                var outlineRect = dockLocation.getDockRect(this._rect);
                outlineRect.height = outlineRect.height / 2;
                outlineRect.y += outlineRect.height;
                dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect_edge");
            }
            if (dropInfo !== undefined) {
                if (!dragNode._canDockInto(dragNode, dropInfo)) {
                    return undefined;
                }
            }
        }
        return dropInfo;
    };
    /** @hidden @internal */
    RowNode.prototype.drop = function (dragNode, location, index) {
        var dockLocation = location;
        var parent = dragNode.getParent();
        if (parent) {
            parent._removeChild(dragNode);
        }
        if (parent !== undefined && parent.getType() === TabSetNode_1.default.TYPE) {
            parent._setSelected(0);
        }
        if (parent !== undefined && parent.getType() === BorderNode_1.default.TYPE) {
            parent._setSelected(-1);
        }
        var tabSet;
        if (dragNode instanceof TabSetNode_1.default) {
            tabSet = dragNode;
        }
        else {
            tabSet = new TabSetNode_1.default(this._model, {});
            tabSet._addChild(dragNode);
        }
        var size = this._children.reduce(function (sum, child) {
            return sum + child.getWeight();
        }, 0);
        if (size === 0) {
            size = 100;
        }
        tabSet._setWeight(size / 3);
        if (dockLocation === DockLocation_1.default.LEFT) {
            this._addChild(tabSet, 0);
        }
        else if (dockLocation === DockLocation_1.default.RIGHT) {
            this._addChild(tabSet);
        }
        else if (dockLocation === DockLocation_1.default.TOP) {
            var vrow = new RowNode(this._model, {});
            var hrow_1 = new RowNode(this._model, {});
            hrow_1._setWeight(75);
            tabSet._setWeight(25);
            this._children.forEach(function (child) {
                hrow_1._addChild(child);
            });
            this._removeAll();
            vrow._addChild(tabSet);
            vrow._addChild(hrow_1);
            this._addChild(vrow);
        }
        else if (dockLocation === DockLocation_1.default.BOTTOM) {
            var vrow = new RowNode(this._model, {});
            var hrow_2 = new RowNode(this._model, {});
            hrow_2._setWeight(75);
            tabSet._setWeight(25);
            this._children.forEach(function (child) {
                hrow_2._addChild(child);
            });
            this._removeAll();
            vrow._addChild(hrow_2);
            vrow._addChild(tabSet);
            this._addChild(vrow);
        }
        this._model._setActiveTabset(tabSet);
        this._model._tidy();
    };
    /** @hidden @internal */
    RowNode.prototype._toJson = function () {
        var json = {};
        RowNode._attributeDefinitions.toJson(json, this._attributes);
        json.children = [];
        this._children.forEach(function (child) {
            json.children.push(child._toJson());
        });
        return json;
    };
    RowNode.prototype.isEnableDrop = function () {
        return true;
    };
    /** @hidden @internal */
    RowNode.prototype._getPrefSize = function (orientation) {
        var prefSize = this.getWidth();
        if (orientation === Orientation_1.default.VERT) {
            prefSize = this.getHeight();
        }
        return prefSize;
    };
    /** @hidden @internal */
    RowNode.prototype._getAttributeDefinitions = function () {
        return RowNode._attributeDefinitions;
    };
    /** @hidden @internal */
    RowNode.prototype._updateAttrs = function (json) {
        RowNode._attributeDefinitions.update(json, this._attributes);
    };
    RowNode.TYPE = "row";
    /** @hidden @internal */
    RowNode._attributeDefinitions = RowNode._createAttributeDefinitions();
    return RowNode;
}(Node_1.default));
exports.default = RowNode;
//# sourceMappingURL=RowNode.js.map