"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
var DockLocation_1 = require("../DockLocation");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Node = /** @class */ (function () {
    /** @internal */
    function Node(model) {
        /** @internal */
        this._dirty = false;
        /** @internal */
        this._tempSize = 0;
        this._model = model;
        this._attributes = {};
        this._children = [];
        this._fixed = false;
        this._rect = Rect_1.Rect.empty();
        this._visible = false;
        this._listeners = {};
    }
    Node.prototype.getId = function () {
        var id = this._attributes.id;
        if (id !== undefined) {
            return id;
        }
        id = this._model._nextUniqueId();
        this._setId(id);
        return id;
    };
    Node.prototype.getModel = function () {
        return this._model;
    };
    Node.prototype.getType = function () {
        return this._attributes.type;
    };
    Node.prototype.getParent = function () {
        return this._parent;
    };
    Node.prototype.getChildren = function () {
        return this._children;
    };
    Node.prototype.getRect = function () {
        return this._rect;
    };
    Node.prototype.isVisible = function () {
        return this._visible;
    };
    Node.prototype.getOrientation = function () {
        if (this._parent === undefined) {
            return this._model.isRootOrientationVertical() ? Orientation_1.Orientation.VERT : Orientation_1.Orientation.HORZ;
        }
        else {
            return Orientation_1.Orientation.flip(this._parent.getOrientation());
        }
    };
    // event can be: resize, visibility, maximize (on tabset), close
    Node.prototype.setEventListener = function (event, callback) {
        this._listeners[event] = callback;
    };
    Node.prototype.removeEventListener = function (event) {
        delete this._listeners[event];
    };
    /** @internal */
    Node.prototype._setId = function (id) {
        this._attributes.id = id;
    };
    /** @internal */
    Node.prototype._fireEvent = function (event, params) {
        // console.log(this._type, " fireEvent " + event + " " + JSON.stringify(params));
        if (this._listeners[event] !== undefined) {
            this._listeners[event](params);
        }
    };
    /** @internal */
    Node.prototype._getAttr = function (name) {
        var val = this._attributes[name];
        if (val === undefined) {
            var modelName = this._getAttributeDefinitions().getModelName(name);
            if (modelName !== undefined) {
                val = this._model._getAttribute(modelName);
            }
        }
        // console.log(name + "=" + val);
        return val;
    };
    /** @internal */
    Node.prototype._forEachNode = function (fn, level) {
        fn(this, level);
        level++;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var node = _a[_i];
            node._forEachNode(fn, level);
        }
    };
    /** @internal */
    Node.prototype._setVisible = function (visible) {
        if (visible !== this._visible) {
            this._fireEvent("visibility", { visible: visible });
            this._visible = visible;
        }
    };
    /** @internal */
    Node.prototype._getDrawChildren = function () {
        return this._children;
    };
    /** @internal */
    Node.prototype._setParent = function (parent) {
        this._parent = parent;
    };
    /** @internal */
    Node.prototype._setRect = function (rect) {
        this._rect = rect;
    };
    /** @internal */
    Node.prototype._setWeight = function (weight) {
        this._attributes.weight = weight;
    };
    /** @internal */
    Node.prototype._setSelected = function (index) {
        this._attributes.selected = index;
    };
    /** @internal */
    Node.prototype._isFixed = function () {
        return this._fixed;
    };
    /** @internal */
    Node.prototype._layout = function (rect, metrics) {
        this._rect = rect;
    };
    /** @internal */
    Node.prototype._findDropTargetNode = function (dragNode, x, y) {
        var rtn;
        if (this._rect.contains(x, y)) {
            rtn = this.canDrop(dragNode, x, y);
            if (rtn === undefined) {
                if (this._children.length !== 0) {
                    for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        rtn = child._findDropTargetNode(dragNode, x, y);
                        if (rtn !== undefined) {
                            break;
                        }
                    }
                }
            }
        }
        return rtn;
    };
    /** @internal */
    Node.prototype.canDrop = function (dragNode, x, y) {
        return undefined;
    };
    /** @internal */
    Node.prototype._canDockInto = function (dragNode, dropInfo) {
        if (dropInfo != null) {
            if (dropInfo.location === DockLocation_1.DockLocation.CENTER && dropInfo.node.isEnableDrop() === false) {
                return false;
            }
            // prevent named tabset docking into another tabset, since this would lose the header
            if (dropInfo.location === DockLocation_1.DockLocation.CENTER && dragNode.getType() === "tabset" && dragNode.getName() !== undefined) {
                return false;
            }
            if (dropInfo.location !== DockLocation_1.DockLocation.CENTER && dropInfo.node.isEnableDivide() === false) {
                return false;
            }
            // finally check model callback to check if drop allowed
            if (this._model._getOnAllowDrop()) {
                return this._model._getOnAllowDrop()(dragNode, dropInfo);
            }
        }
        return true;
    };
    /** @internal */
    Node.prototype._removeChild = function (childNode) {
        var pos = this._children.indexOf(childNode);
        if (pos !== -1) {
            this._children.splice(pos, 1);
        }
        this._dirty = true;
        return pos;
    };
    /** @internal */
    Node.prototype._addChild = function (childNode, pos) {
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
    };
    /** @internal */
    Node.prototype._removeAll = function () {
        this._children = [];
        this._dirty = true;
    };
    /** @internal */
    Node.prototype._styleWithPosition = function (style) {
        if (style == null) {
            style = {};
        }
        return this._rect.styleWithPosition(style);
    };
    /** @internal */
    Node.prototype._getTempSize = function () {
        return this._tempSize;
    };
    /** @internal */
    Node.prototype._setTempSize = function (value) {
        this._tempSize = value;
    };
    /** @internal */
    Node.prototype.isEnableDivide = function () {
        return true;
    };
    /** @internal */
    Node.prototype._toAttributeString = function () {
        return JSON.stringify(this._attributes, undefined, "\t");
    };
    return Node;
}());
exports.Node = Node;
//# sourceMappingURL=Node.js.map