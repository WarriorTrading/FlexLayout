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
var BorderNode_1 = require("./BorderNode");
var Node_1 = require("./Node");
var RowNode_1 = require("./RowNode");
var TabNode_1 = require("./TabNode");
var TabSetNode = /** @class */ (function (_super) {
    __extends(TabSetNode, _super);
    /** @hidden @internal */
    function TabSetNode(model, json) {
        var _this = _super.call(this, model) || this;
        TabSetNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @hidden @internal */
    TabSetNode._fromJson = function (json, model) {
        var newLayoutNode = new TabSetNode(model, json);
        if (json.children != null) {
            json.children.forEach(function (jsonChild) {
                var child = TabNode_1.default._fromJson(jsonChild, model);
                newLayoutNode._addChild(child);
            });
        }
        if (json.maximized && json.maximized === true) {
            model._setMaximizedTabset(newLayoutNode);
        }
        if (json.active && json.active === true) {
            model._setActiveTabset(newLayoutNode);
        }
        return newLayoutNode;
    };
    /** @hidden @internal */
    TabSetNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.default();
        attributeDefinitions.add("type", TabSetNode.TYPE, true);
        attributeDefinitions.add("id", undefined).setType(Attribute_1.default.ID);
        attributeDefinitions.add("weight", 100);
        attributeDefinitions.add("width", undefined);
        attributeDefinitions.add("height", undefined);
        attributeDefinitions.add("selected", 0);
        attributeDefinitions.add("name", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.addInherited("enableDeleteWhenEmpty", "tabSetEnableDeleteWhenEmpty");
        attributeDefinitions.addInherited("enableDrop", "tabSetEnableDrop");
        attributeDefinitions.addInherited("enableDrag", "tabSetEnableDrag");
        attributeDefinitions.addInherited("enableDivide", "tabSetEnableDivide");
        attributeDefinitions.addInherited("enableMaximize", "tabSetEnableMaximize");
        attributeDefinitions.addInherited("classNameTabStrip", "tabSetClassNameTabStrip");
        attributeDefinitions.addInherited("classNameHeader", "tabSetClassNameHeader");
        attributeDefinitions.addInherited("enableTabStrip", "tabSetEnableTabStrip");
        attributeDefinitions.addInherited("borderInsets", "tabSetBorderInsets");
        attributeDefinitions.addInherited("marginInsets", "tabSetMarginInsets");
        attributeDefinitions.addInherited("headerHeight", "tabSetHeaderHeight");
        attributeDefinitions.addInherited("tabStripHeight", "tabSetTabStripHeight");
        return attributeDefinitions;
    };
    TabSetNode.prototype.getName = function () {
        return this._getAttributeAsStringOrUndefined("name");
    };
    TabSetNode.prototype.getSelected = function () {
        var selected = this._attributes.selected;
        if (selected !== undefined) {
            return selected;
        }
        return -1;
    };
    TabSetNode.prototype.getSelectedNode = function () {
        var selected = this.getSelected();
        if (selected !== -1) {
            return this._children[selected];
        }
        return undefined;
    };
    TabSetNode.prototype.getWeight = function () {
        return this._attributes.weight;
    };
    TabSetNode.prototype.getWidth = function () {
        return this._getAttributeAsNumberOrUndefined("width");
    };
    TabSetNode.prototype.getHeight = function () {
        return this._getAttributeAsNumberOrUndefined("height");
    };
    TabSetNode.prototype.isMaximized = function () {
        return this._model.getMaximizedTabset() === this;
    };
    TabSetNode.prototype.isActive = function () {
        return this._model.getActiveTabset() === this;
    };
    TabSetNode.prototype.isEnableDeleteWhenEmpty = function () {
        return this._getAttr("enableDeleteWhenEmpty");
    };
    TabSetNode.prototype.isEnableDrop = function () {
        return this._getAttr("enableDrop");
    };
    TabSetNode.prototype.isEnableDrag = function () {
        return this._getAttr("enableDrag");
    };
    TabSetNode.prototype.isEnableDivide = function () {
        return this._getAttr("enableDivide");
    };
    TabSetNode.prototype.isEnableMaximize = function () {
        return this._getAttr("enableMaximize");
    };
    TabSetNode.prototype.isEnableTabStrip = function () {
        return this._getAttr("enableTabStrip");
    };
    TabSetNode.prototype.getClassNameTabStrip = function () {
        return this._getAttributeAsStringOrUndefined("classNameTabStrip");
    };
    TabSetNode.prototype.getClassNameHeader = function () {
        return this._getAttributeAsStringOrUndefined("classNameHeader");
    };
    TabSetNode.prototype.getHeaderHeight = function () {
        return this._getAttr("headerHeight");
    };
    TabSetNode.prototype.getTabStripHeight = function () {
        return this._getAttr("tabStripHeight");
    };
    /** @hidden @internal */
    TabSetNode.prototype._setWeight = function (weight) {
        this._attributes.weight = weight;
    };
    /** @hidden @internal */
    TabSetNode.prototype._setSelected = function (index) {
        this._attributes.selected = index;
    };
    /** @hidden @internal */
    TabSetNode.prototype.canDrop = function (dragNode, x, y) {
        var dropInfo;
        if (dragNode === this) {
            var dockLocation = DockLocation_1.default.CENTER;
            var outlineRect = this._tabHeaderRect;
            dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect");
        }
        else if (this._contentRect.contains(x, y)) {
            var dockLocation = DockLocation_1.default.getLocation(this._contentRect, x, y);
            var outlineRect = dockLocation.getDockRect(this._rect);
            dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, -1, "flexlayout__outline_rect");
        }
        else if (this._children.length > 0 && this._tabHeaderRect != null && this._tabHeaderRect.contains(x, y)) {
            var child = this._children[0];
            var r = child.getTabRect();
            var yy = r.y;
            var h = r.height;
            var p = this._tabHeaderRect.x;
            var childCenter = 0;
            for (var i = 0; i < this._children.length; i++) {
                child = this._children[i];
                r = child.getTabRect();
                childCenter = r.x + r.width / 2;
                if (x >= p && x < childCenter) {
                    var dockLocation = DockLocation_1.default.CENTER;
                    var outlineRect = new Rect_1.default(r.x - 2, yy, 3, h);
                    dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, i, "flexlayout__outline_rect");
                    break;
                }
                p = childCenter;
            }
            if (dropInfo == null) {
                var dockLocation = DockLocation_1.default.CENTER;
                var outlineRect = new Rect_1.default(r.getRight() - 2, yy, 3, h);
                dropInfo = new DropInfo_1.default(this, outlineRect, dockLocation, this._children.length, "flexlayout__outline_rect");
            }
        }
        if (!dragNode._canDockInto(dragNode, dropInfo)) {
            return undefined;
        }
        return dropInfo;
    };
    /** @hidden @internal */
    TabSetNode.prototype._layout = function (rect) {
        var _this = this;
        if (this.isMaximized()) {
            rect = this._model.getRoot().getRect();
        }
        rect = rect.removeInsets(this._getAttr("marginInsets"));
        this._rect = rect;
        rect = rect.removeInsets(this._getAttr("borderInsets"));
        var showHeader = (this.getName() !== undefined);
        var y = 0;
        if (showHeader) {
            y += this.getHeaderHeight();
        }
        if (this.isEnableTabStrip()) {
            this._tabHeaderRect = new Rect_1.default(rect.x, rect.y + y, rect.width, this.getTabStripHeight());
            y += this.getTabStripHeight();
        }
        this._contentRect = new Rect_1.default(rect.x, rect.y + y, rect.width, rect.height - y);
        this._children.forEach(function (child, i) {
            child._layout(_this._contentRect);
            child._setVisible(i === _this.getSelected());
        });
    };
    /** @hidden @internal */
    TabSetNode.prototype._remove = function (node) {
        this._removeChild(node);
        this._model._tidy();
        this._setSelected(Math.max(0, this.getSelected() - 1));
    };
    /** @hidden @internal */
    TabSetNode.prototype.drop = function (dragNode, location, index) {
        var _this = this;
        var dockLocation = location;
        if (this === dragNode) { // tabset drop into itself
            return; // dock back to itself
        }
        var dragParent = dragNode.getParent();
        var fromIndex = 0;
        if (dragParent !== undefined) {
            fromIndex = dragParent._removeChild(dragNode);
        }
        // console.log("removed child: " + fromIndex);
        // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
        if (dragNode.getType() === TabNode_1.default.TYPE && dragParent === this && fromIndex < index && index > 0) {
            index--;
        }
        // for the tabset/border being removed from set the selected index
        if (dragParent !== undefined) {
            if (dragParent.getType() === TabSetNode.TYPE) {
                dragParent._setSelected(0);
            }
            else if (dragParent.getType() === BorderNode_1.default.TYPE) {
                if (dragParent.getSelected() !== -1) {
                    if (fromIndex === dragParent.getSelected() && dragParent.getChildren().length > 0) {
                        dragParent._setSelected(0);
                    }
                    else if (fromIndex < dragParent.getSelected()) {
                        dragParent._setSelected(dragParent.getSelected() - 1);
                    }
                    else if (fromIndex > dragParent.getSelected()) {
                        // leave selected index as is
                    }
                    else {
                        dragParent._setSelected(-1);
                    }
                }
            }
        }
        // simple_bundled dock to existing tabset
        if (dockLocation === DockLocation_1.default.CENTER) {
            var insertPos_1 = index;
            if (insertPos_1 === -1) {
                insertPos_1 = this._children.length;
            }
            if (dragNode.getType() === TabNode_1.default.TYPE) {
                this._addChild(dragNode, insertPos_1);
                this._setSelected(insertPos_1);
                // console.log("added child at : " + insertPos);
            }
            else {
                dragNode.getChildren().forEach(function (child, i) {
                    _this._addChild(child, insertPos_1);
                    // console.log("added child at : " + insertPos);
                    insertPos_1++;
                });
            }
            this._model._setActiveTabset(this);
        }
        else {
            var tabSet = void 0;
            if (dragNode instanceof TabNode_1.default) {
                // create new tabset parent
                // console.log("create a new tabset");
                tabSet = new TabSetNode(this._model, {});
                tabSet._addChild(dragNode);
                // console.log("added child at end");
                dragParent = tabSet;
            }
            else {
                tabSet = dragNode;
            }
            var parentRow = this._parent;
            var pos = parentRow.getChildren().indexOf(this);
            if (parentRow.getOrientation() === dockLocation._orientation) {
                tabSet._setWeight(this.getWeight() / 2);
                this._setWeight(this.getWeight() / 2);
                // console.log("added child 50% size at: " +  pos + dockLocation.indexPlus);
                parentRow._addChild(tabSet, pos + dockLocation._indexPlus);
            }
            else {
                // create a new row to host the new tabset (it will go in the opposite direction)
                // console.log("create a new row");
                var newRow = new RowNode_1.default(this._model, {});
                newRow._setWeight(this.getWeight());
                newRow._addChild(this);
                this._setWeight(50);
                tabSet._setWeight(50);
                // console.log("added child 50% size at: " +  dockLocation.indexPlus);
                newRow._addChild(tabSet, dockLocation._indexPlus);
                parentRow._removeChild(this);
                parentRow._addChild(newRow, pos);
            }
            this._model._setActiveTabset(tabSet);
        }
        this._model._tidy();
    };
    /** @hidden @internal */
    TabSetNode.prototype._toJson = function () {
        var json = {};
        TabSetNode._attributeDefinitions.toJson(json, this._attributes);
        json.children = this._children.map(function (child) { return child._toJson(); });
        if (this.isActive()) {
            json.active = true;
        }
        if (this.isMaximized()) {
            json.maximized = true;
        }
        return json;
    };
    /** @hidden @internal */
    TabSetNode.prototype._updateAttrs = function (json) {
        TabSetNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @hidden @internal */
    TabSetNode.prototype._getAttributeDefinitions = function () {
        return TabSetNode._attributeDefinitions;
    };
    /** @hidden @internal */
    TabSetNode.prototype._getPrefSize = function (orientation) {
        var prefSize = this.getWidth();
        if (orientation === Orientation_1.default.VERT) {
            prefSize = this.getHeight();
        }
        return prefSize;
    };
    TabSetNode.TYPE = "tabset";
    /** @hidden @internal */
    TabSetNode._attributeDefinitions = TabSetNode._createAttributeDefinitions();
    return TabSetNode;
}(Node_1.default));
exports.default = TabSetNode;
//# sourceMappingURL=TabSetNode.js.map