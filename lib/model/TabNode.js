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
var Node_1 = require("./Node");
var TabNode = /** @class */ (function (_super) {
    __extends(TabNode, _super);
    /** @hidden @internal */
    function TabNode(model, json) {
        var _this = _super.call(this, model) || this;
        _this._extra = {}; // extra data added to node not saved in json
        TabNode._attributeDefinitions.fromJson(json, _this._attributes);
        model._addNode(_this);
        return _this;
    }
    /** @hidden @internal */
    TabNode._fromJson = function (json, model) {
        var newLayoutNode = new TabNode(model, json);
        return newLayoutNode;
    };
    /** @hidden @internal */
    TabNode._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.default();
        attributeDefinitions.add("type", TabNode.TYPE, true);
        attributeDefinitions.add("id", undefined).setType(Attribute_1.default.ID);
        attributeDefinitions.add("name", "[Unnamed Tab]").setType(Attribute_1.default.STRING);
        attributeDefinitions.add("component", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.add("config", undefined).setType(Attribute_1.default.JSON);
        attributeDefinitions.addInherited("enableClose", "tabEnableClose").setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.addInherited("enableDrag", "tabEnableDrag").setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.addInherited("enableRename", "tabEnableRename").setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.addInherited("className", "tabClassName").setType(Attribute_1.default.STRING);
        attributeDefinitions.addInherited("icon", "tabIcon").setType(Attribute_1.default.STRING);
        attributeDefinitions.addInherited("enableRenderOnDemand", "tabEnableRenderOnDemand").setType(Attribute_1.default.BOOLEAN);
        return attributeDefinitions;
    };
    TabNode.prototype.getTabRect = function () {
        return this._tabRect;
    };
    /** @hidden @internal */
    TabNode.prototype._setTabRect = function (rect) {
        this._tabRect = rect;
    };
    TabNode.prototype.getName = function () {
        return this._getAttr("name");
    };
    TabNode.prototype.getComponent = function () {
        return this._getAttributeAsStringOrUndefined("component");
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
    TabNode.prototype.getIcon = function () {
        return this._getAttributeAsStringOrUndefined("icon");
    };
    TabNode.prototype.isEnableClose = function () {
        return this._getAttr("enableClose");
    };
    TabNode.prototype.isEnableDrag = function () {
        return this._getAttr("enableDrag");
    };
    TabNode.prototype.isEnableRename = function () {
        return this._getAttr("enableRename");
    };
    TabNode.prototype.getClassName = function () {
        return this._getAttributeAsStringOrUndefined("className");
    };
    TabNode.prototype.isEnableRenderOnDemand = function () {
        return this._getAttr("enableRenderOnDemand");
    };
    /** @hidden @internal */
    TabNode.prototype._setName = function (name) {
        this._attributes.name = name;
    };
    /** @hidden @internal */
    TabNode.prototype._layout = function (rect) {
        if (!rect.equals(this._rect)) {
            this._fireEvent("resize", { rect: rect });
        }
        this._rect = rect;
    };
    /** @hidden @internal */
    TabNode.prototype._delete = function () {
        this._parent._remove(this);
        this._fireEvent("close", {});
    };
    /** @hidden @internal */
    TabNode.prototype._toJson = function () {
        var json = {};
        TabNode._attributeDefinitions.toJson(json, this._attributes);
        return json;
    };
    /** @hidden @internal */
    TabNode.prototype._updateAttrs = function (json) {
        TabNode._attributeDefinitions.update(json, this._attributes);
    };
    /** @hidden @internal */
    TabNode.prototype._getAttributeDefinitions = function () {
        return TabNode._attributeDefinitions;
    };
    TabNode.TYPE = "tab";
    /** @hidden @internal */
    TabNode._attributeDefinitions = TabNode._createAttributeDefinitions();
    return TabNode;
}(Node_1.default));
exports.default = TabNode;
//# sourceMappingURL=TabNode.js.map