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
exports.TabNode = void 0;
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var Node_1 = require("./Node");
var TabNode = /** @class */ (function (_super) {
    __extends(TabNode, _super);
    /** @internal */
    function TabNode(model, json, addToModel) {
        if (addToModel === void 0) { addToModel = true; }
        var _this = _super.call(this, model) || this;
        _this._extra = {}; // extra data added to node not saved in json
        TabNode._attributeDefinitions.fromJson(json, _this._attributes);
        if (addToModel === true) {
            model._addNode(_this);
        }
        return _this;
    }
    /** @internal */
    TabNode._fromJson = function (json, model, addToModel) {
        if (addToModel === void 0) { addToModel = true; }
        var newLayoutNode = new TabNode(model, json, addToModel);
        return newLayoutNode;
    };
    /** @internal */
    TabNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.AttributeDefinitions();
        attributeDefinitions.add("type", TabNode.TYPE, true).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("id", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("name", "[Unnamed Tab]").setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("altName", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("helpText", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("component", undefined).setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.add("config", undefined).setType("any");
        attributeDefinitions.add("floating", false).setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableClose", "tabEnableClose").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("closeType", "tabCloseType").setType("ICloseType");
        attributeDefinitions.addInherited("enableDrag", "tabEnableDrag").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableRename", "tabEnableRename").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("className", "tabClassName").setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.addInherited("icon", "tabIcon").setType(Attribute_1.Attribute.STRING);
        attributeDefinitions.addInherited("enableRenderOnDemand", "tabEnableRenderOnDemand").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableFloat", "tabEnableFloat").setType(Attribute_1.Attribute.BOOLEAN);
        attributeDefinitions.addInherited("borderWidth", "tabBorderWidth").setType(Attribute_1.Attribute.NUMBER);
        attributeDefinitions.addInherited("borderHeight", "tabBorderHeight").setType(Attribute_1.Attribute.NUMBER);
        return attributeDefinitions;
    };
    TabNode.prototype.getWindow = function () {
        return this._window;
    };
    TabNode.prototype.getTabRect = function () {
        return this._tabRect;
    };
    /** @internal */
    TabNode.prototype._setTabRect = function (rect) {
        this._tabRect = rect;
    };
    /** @internal */
    TabNode.prototype._setRenderedName = function (name) {
        this._renderedName = name;
    };
    /** @internal */
    TabNode.prototype._getNameForOverflowMenu = function () {
        var altName = this._getAttr("altName");
        if (altName !== undefined) {
            return altName;
        }
        return this._renderedName;
    };
    TabNode.prototype.getName = function () {
        return this._getAttr("name");
    };
    TabNode.prototype.getHelpText = function () {
        return this._getAttr("helpText");
    };
    TabNode.prototype.getComponent = function () {
        return this._getAttr("component");
    };
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    TabNode.prototype.getConfig = function () {
        return this._attributes.config;
    };
    /**
     * Returns an object that can be used to store transient node specific data that will
     * NOT be saved in the json.
     */
    TabNode.prototype.getExtraData = function () {
        return this._extra;
    };
    TabNode.prototype.isFloating = function () {
        return this._getAttr("floating");
    };
    TabNode.prototype.getIcon = function () {
        return this._getAttr("icon");
    };
    TabNode.prototype.isEnableClose = function () {
        return this._getAttr("enableClose");
    };
    TabNode.prototype.getCloseType = function () {
        return this._getAttr("closeType");
    };
    TabNode.prototype.isEnableFloat = function () {
        return this._getAttr("enableFloat");
    };
    TabNode.prototype.isEnableDrag = function () {
        return this._getAttr("enableDrag");
    };
    TabNode.prototype.isEnableRename = function () {
        return this._getAttr("enableRename");
    };
    TabNode.prototype.getClassName = function () {
        return this._getAttr("className");
    };
    TabNode.prototype.isEnableRenderOnDemand = function () {
        return this._getAttr("enableRenderOnDemand");
    };
    /** @internal */
    TabNode.prototype._setName = function (name) {
        this._attributes.name = name;
        if (this._window && this._window.document) {
            this._window.document.title = name;
        }
    };
    /** @internal */
    TabNode.prototype._setFloating = function (float) {
        this._attributes.floating = float;
    };
    /** @internal */
    TabNode.prototype._layout = function (rect, metrics) {
        if (!rect.equals(this._rect)) {
            this._fireEvent("resize", { rect: rect });
        }
        this._rect = rect;
    };
    /** @internal */
    TabNode.prototype._delete = function () {
        this._parent._remove(this);
        this._fireEvent("close", {});
    };
    TabNode.prototype.toJson = function () {
        var json = {};
        TabNode._attributeDefinitions.toJson(json, this._attributes);
        return json;
    };
    /** @internal */
    TabNode.prototype._updateAttrs = function (json) {
        TabNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @internal */
    TabNode.prototype._getAttributeDefinitions = function () {
        return TabNode._attributeDefinitions;
    };
    /** @internal */
    TabNode.prototype._setWindow = function (window) {
        this._window = window;
    };
    /** @internal */
    TabNode.prototype._setBorderWidth = function (width) {
        this._attributes.borderWidth = width;
    };
    /** @internal */
    TabNode.prototype._setBorderHeight = function (height) {
        this._attributes.borderHeight = height;
    };
    /** @internal */
    TabNode.getAttributeDefinitions = function () {
        return TabNode._attributeDefinitions;
    };
    TabNode.TYPE = "tab";
    /** @internal */
    TabNode._attributeDefinitions = TabNode._createAttributeDefinitions();
    return TabNode;
}(Node_1.Node));
exports.TabNode = TabNode;
//# sourceMappingURL=TabNode.js.map