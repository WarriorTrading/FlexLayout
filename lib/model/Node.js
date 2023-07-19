import { DockLocation } from "../DockLocation";
import { Orientation } from "../Orientation";
import { Rect } from "../Rect";
import { SHA256 } from "crypto-js";
import { v4 as getUUID } from "uuid";
let id = 0;
/** @internal */
function getGeneratedSeedId() {
    if (window.name != null) {
        window.name = getUUID();
    }
    const newSeedId = SHA256(window.name + id);
    id++;
    return newSeedId;
}
export class Node {
    /** @internal */
    constructor(model) {
        /** @internal */
        this._dirty = false;
        /** @internal */
        this._tempSize = 0;
        this._model = model;
        this._attributes = {};
        this._children = [];
        this._fixed = false;
        this._rect = Rect.empty();
        this._visible = false;
        this._listeners = {};
    }
    getId() {
        let id = this._attributes.id;
        if (id !== undefined) {
            return id;
        }
        id = this._model._nextUniqueId();
        this._setId(id);
        return id;
    }
    getSeedId() {
        let uuid = this._attributes.seedId;
        if (uuid !== undefined) {
            return uuid;
        }
        uuid = getGeneratedSeedId();
        this._setSeedId(uuid);
        return uuid;
    }
    getModel() {
        return this._model;
    }
    getType() {
        return this._attributes.type;
    }
    getParent() {
        return this._parent;
    }
    getChildren() {
        return this._children;
    }
    getRect() {
        return this._rect;
    }
    isVisible() {
        return this._visible;
    }
    getOrientation() {
        if (this._parent === undefined) {
            return this._model.isRootOrientationVertical() ? Orientation.VERT : Orientation.HORZ;
        }
        else {
            return Orientation.flip(this._parent.getOrientation());
        }
    }
    // event can be: resize, visibility, maximize (on tabset), close
    setEventListener(event, callback) {
        this._listeners[event] = callback;
    }
    removeEventListener(event) {
        delete this._listeners[event];
    }
    /** @internal */
    _setId(id) {
        this._attributes.seedId = id;
    }
    /** @internal */
    _setSeedId(uuid) {
        this._attributes.uuid = uuid;
    }
    /** @internal */
    _fireEvent(event, params) {
        // console.log(this._type, " fireEvent " + event + " " + JSON.stringify(params));
        if (this._listeners[event] !== undefined) {
            this._listeners[event](params);
        }
    }
    /** @internal */
    _getAttr(name) {
        let val = this._attributes[name];
        if (val === undefined) {
            const modelName = this._getAttributeDefinitions().getModelName(name);
            if (modelName !== undefined) {
                val = this._model._getAttribute(modelName);
            }
        }
        // console.log(name + "=" + val);
        return val;
    }
    /** @internal */
    _forEachNode(fn, level) {
        fn(this, level);
        level++;
        for (const node of this._children) {
            node._forEachNode(fn, level);
        }
    }
    /** @internal */
    _setVisible(visible) {
        if (visible !== this._visible) {
            this._fireEvent("visibility", { visible });
            this._visible = visible;
        }
    }
    /** @internal */
    _getDrawChildren() {
        return this._children;
    }
    /** @internal */
    _setParent(parent) {
        this._parent = parent;
    }
    /** @internal */
    _setRect(rect) {
        this._rect = rect;
    }
    /** @internal */
    _setWeight(weight) {
        this._attributes.weight = weight;
    }
    /** @internal */
    _setSelected(index) {
        this._attributes.selected = index;
    }
    /** @internal */
    _isFixed() {
        return this._fixed;
    }
    /** @internal */
    _layout(rect, metrics) {
        this._rect = rect;
    }
    /** @internal */
    _findDropTargetNode(dragNode, x, y) {
        let rtn;
        if (this._rect.contains(x, y)) {
            if (this._model.getMaximizedTabset() !== undefined) {
                rtn = this._model.getMaximizedTabset().canDrop(dragNode, x, y);
            }
            else {
                rtn = this.canDrop(dragNode, x, y);
                if (rtn === undefined) {
                    if (this._children.length !== 0) {
                        for (const child of this._children) {
                            rtn = child._findDropTargetNode(dragNode, x, y);
                            if (rtn !== undefined) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return rtn;
    }
    /** @internal */
    canDrop(dragNode, x, y) {
        return undefined;
    }
    /** @internal */
    _canDockInto(dragNode, dropInfo) {
        if (dropInfo != null) {
            if (dropInfo.location === DockLocation.CENTER && dropInfo.node.isEnableDrop() === false) {
                return false;
            }
            // prevent named tabset docking into another tabset, since this would lose the header
            if (dropInfo.location === DockLocation.CENTER && dragNode.getType() === "tabset" && dragNode.getName() !== undefined) {
                return false;
            }
            if (dropInfo.location !== DockLocation.CENTER && dropInfo.node.isEnableDivide() === false) {
                return false;
            }
            // finally check model callback to check if drop allowed
            if (this._model._getOnAllowDrop()) {
                return this._model._getOnAllowDrop()(dragNode, dropInfo);
            }
        }
        return true;
    }
    /** @internal */
    _removeChild(childNode) {
        const pos = this._children.indexOf(childNode);
        if (pos !== -1) {
            this._children.splice(pos, 1);
        }
        this._dirty = true;
        return pos;
    }
    /** @internal */
    _addChild(childNode, pos) {
        if (pos != null) {
            this._children.splice(pos, 0, childNode);
        }
        else {
            this._children.push(childNode);
            pos = this._children.length - 1;
        }
        childNode._parent = this;
        this._dirty = true;
        return pos;
    }
    /** @internal */
    _removeAll() {
        this._children = [];
        this._dirty = true;
    }
    /** @internal */
    _styleWithPosition(style) {
        if (style == null) {
            style = {};
        }
        return this._rect.styleWithPosition(style);
    }
    /** @internal */
    _getTempSize() {
        return this._tempSize;
    }
    /** @internal */
    _setTempSize(value) {
        this._tempSize = value;
    }
    /** @internal */
    isEnableDivide() {
        return true;
    }
    /** @internal */
    _toAttributeString() {
        return JSON.stringify(this._attributes, undefined, "\t");
    }
}
//# sourceMappingURL=Node.js.map