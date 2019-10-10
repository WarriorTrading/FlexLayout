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
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var DropInfo_1 = require("../DropInfo");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Node_1 = require("./Node");
var SplitterNode_1 = require("./SplitterNode");
var TabNode_1 = require("./TabNode");
var TabSetNode_1 = require("./TabSetNode");
var BorderNode = /** @class */ (function (_super) {
    __extends(BorderNode, _super);
    /** @hidden @internal */
    function BorderNode(location, json, model) {
        var _this = _super.call(this, model) || this;
        /** @hidden @internal */
        _this._adjustedSize = 0;
        _this._location = location;
        _this._drawChildren = [];
        _this._attributes.id = "border_" + location.getName();
        BorderNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @hidden @internal */
    BorderNode._fromJson = function (json, model) {
        var location = DockLocation_1.default.getByName(json.location);
        var border = new BorderNode(location, json, model);
        if (json.children) {
            border._children = json.children.map(function (jsonChild) {
                var child = TabNode_1.default._fromJson(jsonChild, model);
                child._setParent(border);
                return child;
            });
        }
        return border;
    };
    /** @hidden @internal */
    BorderNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.default();
        attributeDefinitions.add("type", BorderNode.TYPE, true);
        attributeDefinitions.add("size", 200);
        attributeDefinitions.add("selected", -1);
        attributeDefinitions.add("show", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.addInherited("barSize", "borderBarSize").setType(Attribute_1.default.INT).setFrom(0);
        attributeDefinitions.addInherited("enableDrop", "borderEnableDrop").setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.addInherited("className", "borderClassName").setType(Attribute_1.default.STRING);
        return attributeDefinitions;
    };
    BorderNode.prototype.getLocation = function () {
        return this._location;
    };
    BorderNode.prototype.getTabHeaderRect = function () {
        return this._tabHeaderRect;
    };
    BorderNode.prototype.getContentRect = function () {
        return this._contentRect;
    };
    BorderNode.prototype.isEnableDrop = function () {
        return this._getAttr("enableDrop");
    };
    BorderNode.prototype.getClassName = function () {
        return this._getAttributeAsStringOrUndefined("className");
    };
    BorderNode.prototype.getBorderBarSize = function () {
        return this._getAttr("barSize");
    };
    BorderNode.prototype.getSize = function () {
        return this._attributes.size;
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
    BorderNode.prototype.isMaximized = function () {
        return false;
    };
    BorderNode.prototype.isShowing = function () {
        return this._attributes.show;
    };
    /** @hidden @internal */
    BorderNode.prototype._setSelected = function (index) {
        this._attributes.selected = index;
    };
    /** @hidden @internal */
    BorderNode.prototype._setSize = function (pos) {
        this._attributes.size = pos;
    };
    /** @hidden @internal */
    BorderNode.prototype._updateAttrs = function (json) {
        BorderNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @hidden @internal */
    BorderNode.prototype._getDrawChildren = function () {
        return this._drawChildren;
    };
    /** @hidden @internal */
    BorderNode.prototype._setAdjustedSize = function (size) {
        this._adjustedSize = size;
    };
    /** @hidden @internal */
    BorderNode.prototype._getAdjustedSize = function () {
        return this._adjustedSize;
    };
    /** @hidden @internal */
    BorderNode.prototype._layoutBorderOuter = function (outer) {
        var split1 = this._location.split(outer, this.getBorderBarSize()); // split border outer
        this._tabHeaderRect = split1.start;
        return split1.end;
    };
    /** @hidden @internal */
    BorderNode.prototype._layoutBorderInner = function (inner) {
        var _this = this;
        this._drawChildren = [];
        var location = this._location;
        var split1 = location.split(inner, this._adjustedSize + this._model.getSplitterSize()); // split off tab contents
        var split2 = location.reflect().split(split1.start, this._model.getSplitterSize()); // split contents into content and splitter
        this._contentRect = split2.end;
        this._children.forEach(function (child, i) {
            child._layout(_this._contentRect);
            child._setVisible(i === _this.getSelected());
            _this._drawChildren.push(child);
        });
        if (this.getSelected() === -1) {
            return inner;
        }
        else {
            var newSplitter = new SplitterNode_1.default(this._model);
            newSplitter._setParent(this);
            newSplitter._setRect(split2.start);
            this._drawChildren.push(newSplitter);
            return split1.end;
        }
    };
    /** @hidden @internal */
    BorderNode.prototype._remove = function (node) {
        if (this.getSelected() !== -1) {
            var selectedNode = this._children[this.getSelected()];
            if (node === selectedNode) {
                this._setSelected(-1);
                this._removeChild(node);
            }
            else {
                this._removeChild(node);
                for (var i = 0; i < this._children.length; i++) {
                    if (this._children[i] === selectedNode) {
                        this._setSelected(i);
                        break;
                    }
                }
            }
        }
        else {
            this._removeChild(node);
        }
    };
    /** @hidden @internal */
    BorderNode.prototype.canDrop = function (dragNode, x, y) {
        if (dragNode.getType() !== TabNode_1.default.TYPE) {
            return undefined;
        }
        var dropInfo;
        var dockLocation = DockLocation_1.default.CENTER;
        if (this._tabHeaderRect.contains(x, y)) {
            if (this._location._orientation === Orientation_1.default.VERT) {
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
                            var outlineRect = new Rect_1.default(childRect.x - 2, childY, 3, childHeight);
                            dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, i, "flexlayout__outline_rect");
                            break;
                        }
                        pos = childCenter;
                    }
                    if (dropInfo == null) {
                        var outlineRect = new Rect_1.default(childRect.getRight() - 2, childY, 3, childHeight);
                        dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, this._children.length, "flexlayout__outline_rect");
                    }
                }
                else {
                    var outlineRect = new Rect_1.default(this._tabHeaderRect.x + 1, this._tabHeaderRect.y + 2, 3, 18);
                    dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, 0, "flexlayout__outline_rect");
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
                            var outlineRect = new Rect_1.default(childX, childRect.y - 2, childWidth, 3);
                            dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, i, "flexlayout__outline_rect");
                            break;
                        }
                        pos = childCenter;
                    }
                    if (dropInfo == null) {
                        var outlineRect = new Rect_1.default(childX, childRect.getBottom() - 2, childWidth, 3);
                        dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, this._children.length, "flexlayout__outline_rect");
                    }
                }
                else {
                    var outlineRect = new Rect_1.default(this._tabHeaderRect.x + 2, this._tabHeaderRect.y + 1, 18, 3);
                    dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, 0, "flexlayout__outline_rect");
                }
            }
            if (!dragNode._canDockInto(dragNode, dropInfo)) {
                return undefined;
            }
        }
        else if (this.getSelected() !== -1 && this._contentRect.contains(x, y)) {
            var outlineRect = this._contentRect;
            dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect");
            if (!dragNode._canDockInto(dragNode, dropInfo)) {
                return undefined;
            }
        }
        return dropInfo;
    };
    /** @hidden @internal */
    BorderNode.prototype.drop = function (dragNode, location, index) {
        var fromIndex = 0;
        var parent = dragNode.getParent();
        if (parent !== undefined) {
            fromIndex = parent._removeChild(dragNode);
        }
        // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
        if (dragNode.getType() === TabNode_1.default.TYPE && parent === this && fromIndex < index && index > 0) {
            index--;
        }
        // for the tabset/border being removed from set the selected index
        if (parent !== undefined) {
            if (parent instanceof TabSetNode_1.default) {
                parent._setSelected(0);
            }
            else if (parent instanceof BorderNode) {
                if (parent.getSelected() !== -1) {
                    if (fromIndex === parent.getSelected() && parent._children.length > 0) {
                        parent._setSelected(0);
                    }
                    else if (fromIndex < parent.getSelected()) {
                        parent._setSelected(parent.getSelected() - 1);
                    }
                    else if (fromIndex > parent.getSelected()) {
                        // leave selected index as is
                    }
                    else {
                        parent._setSelected(-1);
                    }
                }
            }
        }
        // simple_bundled dock to existing tabset
        var insertPos = index;
        if (insertPos === -1) {
            insertPos = this._children.length;
        }
        if (dragNode.getType() === TabNode_1.default.TYPE) {
            this._addChild(dragNode, insertPos);
        }
        if (this.getSelected() !== -1) { // already open
            this._setSelected(insertPos);
        }
        this._model._tidy();
    };
    /** @hidden @internal */
    BorderNode.prototype._toJson = function () {
        var json = {};
        BorderNode._attributeDefinitions.toJson(json, this._attributes);
        json.location = this._location.getName();
        json.children = this._children.map(function (child) { return child._toJson(); });
        return json;
    };
    /** @hidden @internal */
    BorderNode.prototype._getSplitterBounds = function (splitter) {
        var pBounds = [0, 0];
        var outerRect = this._model._getOuterInnerRects().outer;
        var innerRect = this._model._getOuterInnerRects().inner;
        if (this._location === DockLocation_1.default.TOP) {
            pBounds[0] = outerRect.y;
            pBounds[1] = innerRect.getBottom() - splitter.getHeight();
        }
        else if (this._location === DockLocation_1.default.LEFT) {
            pBounds[0] = outerRect.x;
            pBounds[1] = innerRect.getRight() - splitter.getWidth();
        }
        else if (this._location === DockLocation_1.default.BOTTOM) {
            pBounds[0] = innerRect.y;
            pBounds[1] = outerRect.getBottom() - splitter.getHeight();
        }
        else if (this._location === DockLocation_1.default.RIGHT) {
            pBounds[0] = innerRect.x;
            pBounds[1] = outerRect.getRight() - splitter.getWidth();
        }
        return pBounds;
    };
    /** @hidden @internal */
    BorderNode.prototype._calculateSplit = function (splitter, splitterPos) {
        var pBounds = this._getSplitterBounds(splitter);
        if (this._location === DockLocation_1.default.BOTTOM || this._location === DockLocation_1.default.RIGHT) {
            return Math.max(0, pBounds[1] - splitterPos);
        }
        else {
            return Math.max(0, splitterPos - pBounds[0]);
        }
    };
    /** @hidden @internal */
    BorderNode.prototype._getAttributeDefinitions = function () {
        return BorderNode._attributeDefinitions;
    };
    BorderNode.TYPE = "border";
    /** @hidden @internal */
    BorderNode._attributeDefinitions = BorderNode._createAttributeDefinitions();
    return BorderNode;
}(Node_1.default));
exports.default = BorderNode;
//# sourceMappingURL=BorderNode.js.map