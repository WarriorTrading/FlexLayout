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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderNode = void 0;
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var DropInfo_1 = require("../DropInfo");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Types_1 = require("../Types");
var Node_1 = require("./Node");
var SplitterNode_1 = require("./SplitterNode");
var TabNode_1 = require("./TabNode");
var Utils_1 = require("./Utils");
var BorderNode = /** @class */ (function (_super) {
    __extends(BorderNode, _super);
    /** @internal */
    function BorderNode(location, json, model) {
        var _this = _super.call(this, model) || this;
        /** @internal */
        _this._adjustedSize = 0;
        /** @internal */
        _this._calculatedBorderBarSize = 0;
        _this._location = location;
        _this._drawChildren = [];
        _this._attributes.id = "border_".concat(location.getName());
        BorderNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @internal */
    BorderNode._fromJson = function (json, model) {
        var location = DockLocation_1.DockLocation.getByName(json.location);
        var border = new BorderNode(location, json, model);
        if (json.children) {
            border._children = json.children.map(function (jsonChild) {
                var child = TabNode_1.TabNode._fromJson(jsonChild, model);
                child._setParent(border);
                return child;
            });
        }
        return border;
    };
    /** @internal */
    BorderNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.AttributeDefinitions();
        attributeDefinitions.add("type", BorderNode.TYPE, true).setType(Attribute_1.Attribute.STRING).setFixed();
        attributeDefinitions.add("selected", -1).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("show", true).setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.add("config", undefined).setType("any");
        attributeDefinitions.addInherited("barSize", "borderBarSize").setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.addInherited("enableDrop", "borderEnableDrop").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("className", "borderClassName").setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.addInherited("autoSelectTabWhenOpen", "borderAutoSelectTabWhenOpen").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("autoSelectTabWhenClosed", "borderAutoSelectTabWhenClosed").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("size", "borderSize").setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.addInherited("minSize", "borderMinSize").setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.addInherited("enableAutoHide", "borderEnableAutoHide").setType(Attribute_1.Attribute.BOOLEAN);
        return attributeDefinitions;
    };
    BorderNode.prototype.getLocation = function () {
        return this._location;
    };
    BorderNode.prototype.getTabHeaderRect = function () {
        return this._tabHeaderRect;
    };
    BorderNode.prototype.getRect = function () {
        return this._tabHeaderRect;
    };
    BorderNode.prototype.getContentRect = function () {
        return this._contentRect;
    };
    BorderNode.prototype.isEnableDrop = function () {
        return this._getAttr("enableDrop");
    };
    BorderNode.prototype.isAutoSelectTab = function (whenOpen) {
        if (whenOpen == null) {
            whenOpen = this.getSelected() !== -1;
        }
        if (whenOpen) {
            return this._getAttr("autoSelectTabWhenOpen");
        }
        else {
            return this._getAttr("autoSelectTabWhenClosed");
        }
    };
    BorderNode.prototype.getClassName = function () {
        return this._getAttr("className");
    };
    /** @internal */
    BorderNode.prototype.calcBorderBarSize = function (metrics) {
        var barSize = this._getAttr("barSize");
        if (barSize !== 0) {
            // its defined
            this._calculatedBorderBarSize = barSize;
        }
        else {
            this._calculatedBorderBarSize = metrics.borderBarSize;
        }
    };
    BorderNode.prototype.getBorderBarSize = function () {
        return this._calculatedBorderBarSize;
    };
    BorderNode.prototype.getSize = function () {
        var defaultSize = this._getAttr("size");
        var selected = this.getSelected();
        if (selected === -1) {
            return defaultSize;
        }
        else {
            var tabNode = this._children[selected];
            var tabBorderSize = (this._location._orientation === Orientation_1.Orientation.HORZ) ? tabNode._getAttr("borderWidth") : tabNode._getAttr("borderHeight");
            if (tabBorderSize === -1) {
                return defaultSize;
            }
            else {
                return tabBorderSize;
            }
        }
    };
    BorderNode.prototype.getMinSize = function () {
        return this._getAttr("minSize");
    };
    BorderNode.prototype.getSelected = function () {
        return this._attributes.selected;
    };
    BorderNode.prototype.getSelectedNode = function () {
        if (this.getSelected() !== -1) {
            return this._children[this.getSelected()];
        }
        return undefined;
    };
    BorderNode.prototype.getOrientation = function () {
        return this._location.getOrientation();
    };
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    BorderNode.prototype.getConfig = function () {
        return this._attributes.config;
    };
    BorderNode.prototype.isMaximized = function () {
        return false;
    };
    BorderNode.prototype.isShowing = function () {
        var show = this._attributes.show;
        if (show) {
            if (this._model._getShowHiddenBorder() !== this._location && this.isAutoHide() && this._children.length === 0) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    };
    BorderNode.prototype.isAutoHide = function () {
        return this._getAttr("enableAutoHide");
    };
    /** @internal */
    BorderNode.prototype._setSelected = function (index) {
        this._attributes.selected = index;
    };
    /** @internal */
    BorderNode.prototype._setSize = function (pos) {
        var selected = this.getSelected();
        if (selected === -1) {
            this._attributes.size = pos;
        }
        else {
            var tabNode = this._children[selected];
            var tabBorderSize = (this._location._orientation === Orientation_1.Orientation.HORZ) ? tabNode._getAttr("borderWidth") : tabNode._getAttr("borderHeight");
            if (tabBorderSize === -1) {
                this._attributes.size = pos;
            }
            else {
                if (this._location._orientation === Orientation_1.Orientation.HORZ) {
                    tabNode._setBorderWidth(pos);
                }
                else {
                    tabNode._setBorderHeight(pos);
                }
            }
        }
    };
    /** @internal */
    BorderNode.prototype._updateAttrs = function (json) {
        BorderNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @internal */
    BorderNode.prototype._getDrawChildren = function () {
        return this._drawChildren;
    };
    /** @internal */
    BorderNode.prototype._setAdjustedSize = function (size) {
        this._adjustedSize = size;
    };
    /** @internal */
    BorderNode.prototype._getAdjustedSize = function () {
        return this._adjustedSize;
    };
    /** @internal */
    BorderNode.prototype._layoutBorderOuter = function (outer, metrics) {
        this.calcBorderBarSize(metrics);
        var split1 = this._location.split(outer, this.getBorderBarSize()); // split border outer
        this._tabHeaderRect = split1.start;
        return split1.end;
    };
    /** @internal */
    BorderNode.prototype._layoutBorderInner = function (inner, metrics) {
        this._drawChildren = [];
        var location = this._location;
        var split1 = location.split(inner, this._adjustedSize + this._model.getSplitterSize()); // split off tab contents
        var split2 = location.reflect().split(split1.start, this._model.getSplitterSize()); // split contents into content and splitter
        this._contentRect = split2.end;
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            child._layout(this._contentRect, metrics);
            child._setVisible(i === this.getSelected());
            this._drawChildren.push(child);
        }
        if (this.getSelected() === -1) {
            return inner;
        }
        else {
            var newSplitter = new SplitterNode_1.SplitterNode(this._model);
            newSplitter._setParent(this);
            newSplitter._setRect(split2.start);
            this._drawChildren.push(newSplitter);
            return split1.end;
        }
    };
    /** @internal */
    BorderNode.prototype._remove = function (node) {
        var removedIndex = this._removeChild(node);
        if (this.getSelected() !== -1) {
            (0, Utils_1.adjustSelectedIndex)(this, removedIndex);
        }
    };
    /** @internal */
    BorderNode.prototype.canDrop = function (dragNode, x, y) {
        if (dragNode.getType() !== TabNode_1.TabNode.TYPE) {
            return undefined;
        }
        var dropInfo;
        var dockLocation = DockLocation_1.DockLocation.CENTER;
        if (this._tabHeaderRect.contains(x, y)) {
            if (this._location._orientation === Orientation_1.Orientation.VERT) {
                if (this._children.length > 0) {
                    var child = this._children[0];
                    var childRect = child.getTabRect();
                    var childY = childRect.y;
                    var childHeight = childRect.height;
                    var pos = this._tabHeaderRect.x;
                    var childCenter = 0;
                    for (var i = 0; i < this._children.length; i++) {
                        child = this._children[i];
                        childRect = child.getTabRect();
                        childCenter = childRect.x + childRect.width / 2;
                        if (x >= pos && x < childCenter) {
                            var outlineRect = new Rect_1.Rect(childRect.x - 2, childY, 3, childHeight);
                            dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, i, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                            break;
                        }
                        pos = childCenter;
                    }
                    if (dropInfo == null) {
                        var outlineRect = new Rect_1.Rect(childRect.getRight() - 2, childY, 3, childHeight);
                        dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, this._children.length, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                    }
                }
                else {
                    var outlineRect = new Rect_1.Rect(this._tabHeaderRect.x + 1, this._tabHeaderRect.y + 2, 3, 18);
                    dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, 0, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                }
            }
            else {
                if (this._children.length > 0) {
                    var child = this._children[0];
                    var childRect = child.getTabRect();
                    var childX = childRect.x;
                    var childWidth = childRect.width;
                    var pos = this._tabHeaderRect.y;
                    var childCenter = 0;
                    for (var i = 0; i < this._children.length; i++) {
                        child = this._children[i];
                        childRect = child.getTabRect();
                        childCenter = childRect.y + childRect.height / 2;
                        if (y >= pos && y < childCenter) {
                            var outlineRect = new Rect_1.Rect(childX, childRect.y - 2, childWidth, 3);
                            dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, i, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                            break;
                        }
                        pos = childCenter;
                    }
                    if (dropInfo == null) {
                        var outlineRect = new Rect_1.Rect(childX, childRect.getBottom() - 2, childWidth, 3);
                        dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, this._children.length, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                    }
                }
                else {
                    var outlineRect = new Rect_1.Rect(this._tabHeaderRect.x + 2, this._tabHeaderRect.y + 1, 18, 3);
                    dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, 0, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                }
            }
            if (!dragNode._canDockInto(dragNode, dropInfo)) {
                return undefined;
            }
        }
        else if (this.getSelected() !== -1 && this._contentRect.contains(x, y)) {
            var outlineRect = this._contentRect;
            dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
            if (!dragNode._canDockInto(dragNode, dropInfo)) {
                return undefined;
            }
        }
        return dropInfo;
    };
    /** @internal */
    BorderNode.prototype.drop = function (dragNode, location, index, select) {
        var fromIndex = 0;
        var dragParent = dragNode.getParent();
        if (dragParent !== undefined) {
            fromIndex = dragParent._removeChild(dragNode);
            (0, Utils_1.adjustSelectedIndex)(dragParent, fromIndex);
        }
        // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
        if (dragNode.getType() === TabNode_1.TabNode.TYPE && dragParent === this && fromIndex < index && index > 0) {
            index--;
        }
        // simple_bundled dock to existing tabset
        var insertPos = index;
        if (insertPos === -1) {
            insertPos = this._children.length;
        }
        if (dragNode.getType() === TabNode_1.TabNode.TYPE) {
            this._addChild(dragNode, insertPos);
        }
        if (select || (select !== false && this.isAutoSelectTab())) {
            this._setSelected(insertPos);
        }
        this._model._tidy();
    };
    BorderNode.prototype.toJson = function () {
        var json = {};
        BorderNode._attributeDefinitions.toJson(json, this._attributes);
        json.location = this._location.getName();
        json.children = this._children.map(function (child) { return child.toJson(); });
        return json;
    };
    /** @internal */
    BorderNode.prototype._getSplitterBounds = function (splitter, useMinSize) {
        if (useMinSize === void 0) { useMinSize = false; }
        var pBounds = [0, 0];
        var minSize = useMinSize ? this.getMinSize() : 0;
        var outerRect = this._model._getOuterInnerRects().outer;
        var innerRect = this._model._getOuterInnerRects().inner;
        var rootRow = this._model.getRoot();
        if (this._location === DockLocation_1.DockLocation.TOP) {
            pBounds[0] = outerRect.y + minSize;
            pBounds[1] = Math.max(pBounds[0], innerRect.getBottom() - splitter.getHeight() - rootRow.getMinHeight());
        }
        else if (this._location === DockLocation_1.DockLocation.LEFT) {
            pBounds[0] = outerRect.x + minSize;
            pBounds[1] = Math.max(pBounds[0], innerRect.getRight() - splitter.getWidth() - rootRow.getMinWidth());
        }
        else if (this._location === DockLocation_1.DockLocation.BOTTOM) {
            pBounds[1] = outerRect.getBottom() - splitter.getHeight() - minSize;
            pBounds[0] = Math.min(pBounds[1], innerRect.y + rootRow.getMinHeight());
        }
        else if (this._location === DockLocation_1.DockLocation.RIGHT) {
            pBounds[1] = outerRect.getRight() - splitter.getWidth() - minSize;
            pBounds[0] = Math.min(pBounds[1], innerRect.x + rootRow.getMinWidth());
        }
        return pBounds;
    };
    /** @internal */
    BorderNode.prototype._calculateSplit = function (splitter, splitterPos) {
        var pBounds = this._getSplitterBounds(splitter);
        if (this._location === DockLocation_1.DockLocation.BOTTOM || this._location === DockLocation_1.DockLocation.RIGHT) {
            return Math.max(0, pBounds[1] - splitterPos);
        }
        else {
            return Math.max(0, splitterPos - pBounds[0]);
        }
    };
    /** @internal */
    BorderNode.prototype._getAttributeDefinitions = function () {
        return BorderNode._attributeDefinitions;
    };
    /** @internal */
    BorderNode.getAttributeDefinitions = function () {
        return BorderNode._attributeDefinitions;
    };
    BorderNode.TYPE = "border";
    /** @internal */
    BorderNode._attributeDefinitions = BorderNode._createAttributeDefinitions();
    return BorderNode;
}(Node_1.Node));
exports.BorderNode = BorderNode;
//# sourceMappingURL=BorderNode.js.map