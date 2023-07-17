import { Attribute } from "../Attribute";
import { AttributeDefinitions } from "../AttributeDefinitions";
import { Node } from "./Node";
export class TabNode extends Node {
    /** @internal */
    constructor(model, json, addToModel = true) {
        super(model);
        this._extra = {}; // extra data added to node not saved in json
        TabNode._attributeDefinitions.fromJson(json, this._attributes);
        if (addToModel === true) {
            model._addNode(this);
        }
    }
    /** @internal */
    static _fromJson(json, model, addToModel = true) {
        const newLayoutNode = new TabNode(model, json, addToModel);
        return newLayoutNode;
    }
    /** @internal */
    static _createAttributeDefinitions() {
        const attributeDefinitions = new AttributeDefinitions();
        attributeDefinitions.add("type", TabNode.TYPE, true).setType(Attribute.STRING);
        attributeDefinitions.add("id", undefined).setType(Attribute.STRING);
        attributeDefinitions.add("name", "[Unnamed Tab]").setType(Attribute.STRING);
        attributeDefinitions.add("altName", undefined).setType(Attribute.STRING);
        attributeDefinitions.add("helpText", undefined).setType(Attribute.STRING);
        attributeDefinitions.add("component", undefined).setType(Attribute.STRING);
        attributeDefinitions.add("config", undefined).setType("any");
        attributeDefinitions.add("floating", false).setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableClose", "tabEnableClose").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("closeType", "tabCloseType").setType("ICloseType");
        attributeDefinitions.addInherited("enableDrag", "tabEnableDrag").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableRename", "tabEnableRename").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("className", "tabClassName").setType(Attribute.STRING);
        attributeDefinitions.addInherited("icon", "tabIcon").setType(Attribute.STRING);
        attributeDefinitions.addInherited("enableRenderOnDemand", "tabEnableRenderOnDemand").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableFloat", "tabEnableFloat").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("borderWidth", "tabBorderWidth").setType(Attribute.NUMBER);
        attributeDefinitions.addInherited("borderHeight", "tabBorderHeight").setType(Attribute.NUMBER);
        return attributeDefinitions;
    }
    getWindow() {
        return this._window;
    }
    getTabRect() {
        return this._tabRect;
    }
    /** @internal */
    _setTabRect(rect) {
        this._tabRect = rect;
    }
    /** @internal */
    _setRenderedName(name) {
        this._renderedName = name;
    }
    /** @internal */
    _getNameForOverflowMenu() {
        const altName = this._getAttr("altName");
        if (altName !== undefined) {
            return altName;
        }
        return this._renderedName;
    }
    getName() {
        return this._getAttr("name");
    }
    getHelpText() {
        return this._getAttr("helpText");
    }
    getComponent() {
        return this._getAttr("component");
    }
    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig() {
        return this._attributes.config;
    }
    /**
     * Returns an object that can be used to store transient node specific data that will
     * NOT be saved in the json.
     */
    getExtraData() {
        return this._extra;
    }
    isFloating() {
        return this._getAttr("floating");
    }
    getIcon() {
        return this._getAttr("icon");
    }
    isEnableClose() {
        return this._getAttr("enableClose");
    }
    getCloseType() {
        return this._getAttr("closeType");
    }
    isEnableFloat() {
        return this._getAttr("enableFloat");
    }
    isEnableDrag() {
        return this._getAttr("enableDrag");
    }
    isEnableRename() {
        return this._getAttr("enableRename");
    }
    getClassName() {
        return this._getAttr("className");
    }
    isEnableRenderOnDemand() {
        return this._getAttr("enableRenderOnDemand");
    }
    /** @internal */
    _setName(name) {
        this._attributes.name = name;
        if (this._window && this._window.document) {
            this._window.document.title = name;
        }
    }
    /** @internal */
    _setFloating(float) {
        this._attributes.floating = float;
    }
    /** @internal */
    _layout(rect, metrics) {
        if (!rect.equals(this._rect)) {
            this._fireEvent("resize", { rect });
        }
        this._rect = rect;
    }
    /** @internal */
    _delete() {
        this._parent._remove(this);
        this._fireEvent("close", {});
    }
    toJson() {
        const json = {};
        TabNode._attributeDefinitions.toJson(json, this._attributes);
        return json;
    }
    /** @internal */
    _updateAttrs(json) {
        TabNode._attributeDefinitions.update(json, this._attributes);
    }
    /** @internal */
    _getAttributeDefinitions() {
        return TabNode._attributeDefinitions;
    }
    /** @internal */
    _setWindow(window) {
        this._window = window;
    }
    /** @internal */
    _setBorderWidth(width) {
        this._attributes.borderWidth = width;
    }
    /** @internal */
    _setBorderHeight(height) {
        this._attributes.borderHeight = height;
    }
    /** @internal */
    static getAttributeDefinitions() {
        return TabNode._attributeDefinitions;
    }
}
TabNode.TYPE = "tab";
/** @internal */
TabNode._attributeDefinitions = TabNode._createAttributeDefinitions();
//# sourceMappingURL=TabNode.js.map