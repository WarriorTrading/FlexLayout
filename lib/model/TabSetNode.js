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
exports.TabSetNode = void 0;
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var DropInfo_1 = require("../DropInfo");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Types_1 = require("../Types");
var Node_1 = require("./Node");
var RowNode_1 = require("./RowNode");
var TabNode_1 = require("./TabNode");
var Utils_1 = require("./Utils");
var TabSetNode = /** @class */ (function (_super) {
    __extends(TabSetNode, _super);
    /** @internal */
    function TabSetNode(model, json) {
        var _this = _super.call(this, model) || this;
        TabSetNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        _this._calculatedTabBarHeight = 0;
        _this._calculatedHeaderBarHeight = 0;
        return _this;
    }
    /** @internal */
    TabSetNode._fromJson = function (json, model) {
        var newLayoutNode = new TabSetNode(model, json);
        if (json.children != null) {
            for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
                var jsonChild = _a[_i];
                var child = TabNode_1.TabNode._fromJson(jsonChild, model);
                newLayoutNode._addChild(child);
            }
        }
        if (newLayoutNode._children.length === 0) {
            newLayoutNode._setSelected(-1);
        }
        if (json.maximized && json.maximized === true) {
            model._setMaximizedTabset(newLayoutNode);
        }
        if (json.active && json.active === true) {
            model._setActiveTabset(newLayoutNode);
        }
        return newLayoutNode;
    };
    /** @internal */
    TabSetNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.AttributeDefinitions();
        attributeDefinitions.add("type", TabSetNode.TYPE, true).setType(Attribute_1.Attribute.STRING).setFixed();
        attributeDefinitions.add("id", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("weight", 100).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("width", undefined).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("height", undefined).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("selected", 0).setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.add("name", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("config", undefined).setType("any");
        attributeDefinitions.addInherited("enableDeleteWhenEmpty", "tabSetEnableDeleteWhenEmpty");
        attributeDefinitions.addInherited("enableDrop", "tabSetEnableDrop");
        attributeDefinitions.addInherited("enableDrag", "tabSetEnableDrag");
        attributeDefinitions.addInherited("enableDivide", "tabSetEnableDivide");
        attributeDefinitions.addInherited("enableMaximize", "tabSetEnableMaximize");
        attributeDefinitions.addInherited("enableClose", "tabSetEnableClose");
        attributeDefinitions.addInherited("classNameTabStrip", "tabSetClassNameTabStrip");
        attributeDefinitions.addInherited("classNameHeader", "tabSetClassNameHeader");
        attributeDefinitions.addInherited("enableTabStrip", "tabSetEnableTabStrip");
        attributeDefinitions.addInherited("borderInsets", "tabSetBorderInsets");
        attributeDefinitions.addInherited("marginInsets", "tabSetMarginInsets");
        attributeDefinitions.addInherited("minWidth", "tabSetMinWidth");
        attributeDefinitions.addInherited("minHeight", "tabSetMinHeight");
        attributeDefinitions.addInherited("headerHeight", "tabSetHeaderHeight");
        attributeDefinitions.addInherited("tabStripHeight", "tabSetTabStripHeight");
        attributeDefinitions.addInherited("tabLocation", "tabSetTabLocation");
        attributeDefinitions.addInherited("autoSelectTab", "tabSetAutoSelectTab").setType(Attribute_1.Attribute.BOOLEAN);
        return attributeDefinitions;
    };
    TabSetNode.prototype.getName = function () {
        return this._getAttr("name");
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
        return this._getAttr("weight");
    };
    TabSetNode.prototype.getWidth = function () {
        return this._getAttr("width");
    };
    TabSetNode.prototype.getMinWidth = function () {
        return this._getAttr("minWidth");
    };
    TabSetNode.prototype.getHeight = function () {
        return this._getAttr("height");
    };
    TabSetNode.prototype.getMinHeight = function () {
        return this._getAttr("minHeight");
    };
    /** @internal */
    TabSetNode.prototype.getMinSize = function (orientation) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return this.getMinWidth();
        }
        else {
            return this.getMinHeight();
        }
    };
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    TabSetNode.prototype.getConfig = function () {
        return this._attributes.config;
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
    TabSetNode.prototype.isEnableClose = function () {
        return this._getAttr("enableClose");
    };
    TabSetNode.prototype.canMaximize = function () {
        if (this.isEnableMaximize()) {
            // always allow maximize toggle if already maximized
            if (this.getModel().getMaximizedTabset() === this) {
                return true;
            }
            // only one tabset, so disable
            if (this.getParent() === this.getModel().getRoot() && this.getModel().getRoot().getChildren().length === 1) {
                return false;
            }
            return true;
        }
        return false;
    };
    TabSetNode.prototype.isEnableTabStrip = function () {
        return this._getAttr("enableTabStrip");
    };
    TabSetNode.prototype.isAutoSelectTab = function () {
        return this._getAttr("autoSelectTab");
    };
    TabSetNode.prototype.getClassNameTabStrip = function () {
        return this._getAttr("classNameTabStrip");
    };
    TabSetNode.prototype.getClassNameHeader = function () {
        return this._getAttr("classNameHeader");
    };
    /** @internal */
    TabSetNode.prototype.calculateHeaderBarHeight = function (metrics) {
        var headerBarHeight = this._getAttr("headerHeight");
        if (headerBarHeight !== 0) {
            // its defined
            this._calculatedHeaderBarHeight = headerBarHeight;
        }
        else {
            this._calculatedHeaderBarHeight = metrics.headerBarSize;
        }
    };
    /** @internal */
    TabSetNode.prototype.calculateTabBarHeight = function (metrics) {
        var tabBarHeight = this._getAttr("tabStripHeight");
        if (tabBarHeight !== 0) {
            // its defined
            this._calculatedTabBarHeight = tabBarHeight;
        }
        else {
            this._calculatedTabBarHeight = metrics.tabBarSize;
        }
    };
    TabSetNode.prototype.getHeaderHeight = function () {
        return this._calculatedHeaderBarHeight;
    };
    TabSetNode.prototype.getTabStripHeight = function () {
        return this._calculatedTabBarHeight;
    };
    TabSetNode.prototype.getTabLocation = function () {
        return this._getAttr("tabLocation");
    };
    /** @internal */
    TabSetNode.prototype._setWeight = function (weight) {
        this._attributes.weight = weight;
    };
    /** @internal */
    TabSetNode.prototype._setSelected = function (index) {
        this._attributes.selected = index;
    };
    /** @internal */
    TabSetNode.prototype.canDrop = function (dragNode, x, y) {
        var dropInfo;
        if (dragNode === this) {
            var dockLocation = DockLocation_1.DockLocation.CENTER;
            var outlineRect = this._tabHeaderRect;
            dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
        }
        else if (this._contentRect.contains(x, y)) {
            var dockLocation = DockLocation_1.DockLocation.getLocation(this._contentRect, x, y);
            var outlineRect = dockLocation.getDockRect(this._rect);
            dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, -1, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
        }
        else if (this._tabHeaderRect != null && this._tabHeaderRect.contains(x, y)) {
            var r = void 0;
            var yy = void 0;
            var h = void 0;
            if (this._children.length === 0) {
                r = this._tabHeaderRect.clone();
                yy = r.y + 3;
                h = r.height - 4;
                r.width = 2;
            }
            else {
                var child = this._children[0];
                r = child.getTabRect();
                yy = r.y;
                h = r.height;
                var p = this._tabHeaderRect.x;
                var childCenter = 0;
                for (var i = 0; i < this._children.length; i++) {
                    child = this._children[i];
                    r = child.getTabRect();
                    childCenter = r.x + r.width / 2;
                    if (x >= p && x < childCenter) {
                        var dockLocation = DockLocation_1.DockLocation.CENTER;
                        var outlineRect = new Rect_1.Rect(r.x - 2, yy, 3, h);
                        dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, i, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
                        break;
                    }
                    p = childCenter;
                }
            }
            if (dropInfo == null) {
                var dockLocation = DockLocation_1.DockLocation.CENTER;
                var outlineRect = new Rect_1.Rect(r.getRight() - 2, yy, 3, h);
                dropInfo = new DropInfo_1.DropInfo(this, outlineRect, dockLocation, this._children.length, Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
            }
        }
        if (!dragNode._canDockInto(dragNode, dropInfo)) {
            return undefined;
        }
        return dropInfo;
    };
    /** @internal */
    TabSetNode.prototype._layout = function (rect, metrics) {
        this.calculateHeaderBarHeight(metrics);
        this.calculateTabBarHeight(metrics);
        if (this.isMaximized()) {
            rect = this._model.getRoot().getRect();
        }
        rect = rect.removeInsets(this._getAttr("marginInsets"));
        this._rect = rect;
        rect = rect.removeInsets(this._getAttr("borderInsets"));
        var showHeader = this.getName() !== undefined;
        var y = 0;
        var h = 0;
        if (showHeader) {
            y += this._calculatedHeaderBarHeight;
            h += this._calculatedHeaderBarHeight;
        }
        if (this.isEnableTabStrip()) {
            if (this.getTabLocation() === "top") {
                this._tabHeaderRect = new Rect_1.Rect(rect.x, rect.y + y, rect.width, this._calculatedTabBarHeight);
            }
            else {
                this._tabHeaderRect = new Rect_1.Rect(rect.x, rect.y + rect.height - this._calculatedTabBarHeight, rect.width, this._calculatedTabBarHeight);
            }
            h += this._calculatedTabBarHeight;
            if (this.getTabLocation() === "top") {
                y += this._calculatedTabBarHeight;
            }
        }
        this._contentRect = new Rect_1.Rect(rect.x, rect.y + y, rect.width, rect.height - h);
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            child._layout(this._contentRect, metrics);
            child._setVisible(i === this.getSelected());
        }
    };
    /** @internal */
    TabSetNode.prototype._delete = function () {
        this._parent._removeChild(this);
    };
    /** @internal */
    TabSetNode.prototype._remove = function (node) {
        var removedIndex = this._removeChild(node);
        this._model._tidy();
        (0, Utils_1.adjustSelectedIndex)(this, removedIndex);
    };
    /** @internal */
    TabSetNode.prototype.drop = function (dragNode, location, index, select) {
        var dockLocation = location;
        if (this === dragNode) {
            // tabset drop into itself
            return; // dock back to itself
        }
        var dragParent = dragNode.getParent();
        var fromIndex = 0;
        if (dragParent !== undefined) {
            fromIndex = dragParent._removeChild(dragNode);
            (0, Utils_1.adjustSelectedIndex)(dragParent, fromIndex);
        }
        // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
        if (dragNode.getType() === TabNode_1.TabNode.TYPE && dragParent === this && fromIndex < index && index > 0) {
            index--;
        }
        // simple_bundled dock to existing tabset
        if (dockLocation === DockLocation_1.DockLocation.CENTER) {
            var insertPos = index;
            if (insertPos === -1) {
                insertPos = this._children.length;
            }
            if (dragNode.getType() === TabNode_1.TabNode.TYPE) {
                this._addChild(dragNode, insertPos);
                if (select || (select !== false && this.isAutoSelectTab())) {
                    this._setSelected(insertPos);
                }
                // console.log("added child at : " + insertPos);
            }
            else {
                for (var i = 0; i < dragNode.getChildren().length; i++) {
                    var child = dragNode.getChildren()[i];
                    this._addChild(child, insertPos);
                    // console.log("added child at : " + insertPos);
                    insertPos++;
                }
            }
            this._model._setActiveTabset(this);
        }
        else {
            var tabSet = void 0;
            if (dragNode instanceof TabNode_1.TabNode) {
                // create new tabset parent
                // console.log("create a new tabset");
                var callback = this._model._getOnCreateTabSet();
                tabSet = new TabSetNode(this._model, callback ? callback(dragNode) : {});
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
                var newRow = new RowNode_1.RowNode(this._model, {});
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
    TabSetNode.prototype.toJson = function () {
        var json = {};
        TabSetNode._attributeDefinitions.toJson(json, this._attributes);
        json.children = this._children.map(function (child) { return child.toJson(); });
        if (this.isActive()) {
            json.active = true;
        }
        if (this.isMaximized()) {
            json.maximized = true;
        }
        return json;
    };
    /** @internal */
    TabSetNode.prototype._updateAttrs = function (json) {
        TabSetNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @internal */
    TabSetNode.prototype._getAttributeDefinitions = function () {
        return TabSetNode._attributeDefinitions;
    };
    /** @internal */
    TabSetNode.prototype._getPrefSize = function (orientation) {
        var prefSize = this.getWidth();
        if (orientation === Orientation_1.Orientation.VERT) {
            prefSize = this.getHeight();
        }
        return prefSize;
    };
    /** @internal */
    TabSetNode.getAttributeDefinitions = function () {
        return TabSetNode._attributeDefinitions;
    };
    TabSetNode.TYPE = "tabset";
    /** @internal */
    TabSetNode._attributeDefinitions = TabSetNode._createAttributeDefinitions();
    return TabSetNode;
}(Node_1.Node));
exports.TabSetNode = TabSetNode;
//# sourceMappingURL=TabSetNode.js.map