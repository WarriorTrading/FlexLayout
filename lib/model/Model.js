"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Attribute_1 = require("../Attribute");
var AttributeDefinitions_1 = require("../AttributeDefinitions");
var DockLocation_1 = require("../DockLocation");
var Orientation_1 = require("../Orientation");
var Rect_1 = require("../Rect");
var Actions_1 = require("./Actions");
var BorderNode_1 = require("./BorderNode");
var BorderSet_1 = require("./BorderSet");
var RowNode_1 = require("./RowNode");
var TabNode_1 = require("./TabNode");
var TabSetNode_1 = require("./TabSetNode");
/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
var Model = /** @class */ (function () {
    /**
     * 'private' constructor. Use the static method Model.fromJson(json) to create a model
     *  @hidden @internal
     */
    function Model() {
        /** @hidden @internal */
        this._borderRects = { inner: Rect_1.default.empty(), outer: Rect_1.default.empty() };
        this._attributes = {};
        this._idMap = {};
        this._nextId = 0;
        this._borders = new BorderSet_1.default(this);
    }
    /**
     * Loads the model from the given json object
     * @param json the json model to load
     * @returns {Model} a new Model object
     */
    Model.fromJson = function (json) {
        var model = new Model();
        Model._attributeDefinitions.fromJson(json.global, model._attributes);
        if (json.borders) {
            model._borders = BorderSet_1.default._fromJson(json.borders, model);
        }
        model._root = RowNode_1.default._fromJson(json.layout, model);
        model._tidy(); // initial tidy of node tree
        return model;
    };
    /** @hidden @internal */
    Model._createAttributeDefinitions = function () {
        var attributeDefinitions = new AttributeDefinitions_1.default();
        // splitter
        attributeDefinitions.add("splitterSize", 8).setType(Attribute_1.default.INT).setFrom(1);
        attributeDefinitions.add("enableEdgeDock", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("marginInsets", { top: 0, right: 0, bottom: 0, left: 0 }).setType(Attribute_1.default.JSON);
        // tab
        attributeDefinitions.add("tabEnableClose", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabEnableDrag", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabEnableRename", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabClassName", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.add("tabIcon", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.add("tabEnableRenderOnDemand", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabDragSpeed", 0.3).setType(Attribute_1.default.NUMBER);
        // tabset
        attributeDefinitions.add("tabSetEnableDeleteWhenEmpty", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetEnableDrop", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetEnableDrag", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetEnableDivide", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetEnableMaximize", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetClassNameTabStrip", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.add("tabSetClassNameHeader", undefined).setType(Attribute_1.default.STRING);
        attributeDefinitions.add("tabSetEnableTabStrip", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("tabSetHeaderHeight", 20).setType(Attribute_1.default.INT).setFrom(0);
        attributeDefinitions.add("tabSetTabStripHeight", 20).setType(Attribute_1.default.INT).setFrom(0);
        attributeDefinitions.add("tabSetMarginInsets", { top: 0, right: 0, bottom: 0, left: 0 }).setType(Attribute_1.default.JSON);
        attributeDefinitions.add("tabSetBorderInsets", { top: 0, right: 0, bottom: 0, left: 0 }).setType(Attribute_1.default.JSON);
        attributeDefinitions.add("borderBarSize", 25);
        attributeDefinitions.add("borderEnableDrop", true).setType(Attribute_1.default.BOOLEAN);
        attributeDefinitions.add("borderClassName", undefined).setType(Attribute_1.default.STRING);
        return attributeDefinitions;
    };
    /** @hidden @internal */
    Model.prototype._setChangeListener = function (listener) {
        this._changeListener = listener;
    };
    /**
     * Get the currently active tabset node
     */
    Model.prototype.getActiveTabset = function () {
        return this._activeTabSet;
    };
    /** @hidden @internal */
    Model.prototype._setActiveTabset = function (tabsetNode) {
        this._activeTabSet = tabsetNode;
    };
    /**
     * Get the currently maximized tabset node
     */
    Model.prototype.getMaximizedTabset = function () {
        return this._maximizedTabSet;
    };
    /** @hidden @internal */
    Model.prototype._setMaximizedTabset = function (tabsetNode) {
        this._maximizedTabSet = tabsetNode;
    };
    /**
     * Gets the root RowNode of the model
     * @returns {RowNode}
     */
    Model.prototype.getRoot = function () {
        return this._root;
    };
    /**
     * Gets the
     * @returns {BorderSet|*}
     */
    Model.prototype.getBorderSet = function () {
        return this._borders;
    };
    /** @hidden @internal */
    Model.prototype._getOuterInnerRects = function () {
        return this._borderRects;
    };
    /**
     * Visits all the nodes in the model and calls the given function for each
     * @param fn a function that takes visited node and a integer level as parameters
     */
    Model.prototype.visitNodes = function (fn) {
        this._borders._forEachNode(fn);
        this._root._forEachNode(fn, 0);
    };
    /**
     * Gets a node by its id
     * @param id the id to find
     */
    Model.prototype.getNodeById = function (id) {
        return this._idMap[id];
    };
    /**
     * Update the node tree by performing the given action,
     * Actions should be generated via static methods on the Actions class
     * @param action the action to perform
     */
    Model.prototype.doAction = function (action) {
        // console.log(action);
        switch (action.type) {
            case Actions_1.default.ADD_NODE:
                {
                    var newNode = new TabNode_1.default(this, action.data.json);
                    var toNode = this._idMap[action.data.toNode];
                    if (toNode instanceof TabSetNode_1.default || toNode instanceof BorderNode_1.default || toNode instanceof RowNode_1.default) {
                        toNode.drop(newNode, DockLocation_1.default.getByName(action.data.location), action.data.index);
                    }
                    break;
                }
            case Actions_1.default.MOVE_NODE:
                {
                    var fromNode = this._idMap[action.data.fromNode];
                    if (fromNode instanceof TabNode_1.default || fromNode instanceof TabSetNode_1.default) {
                        var toNode = this._idMap[action.data.toNode];
                        if (toNode instanceof TabSetNode_1.default || toNode instanceof BorderNode_1.default || toNode instanceof RowNode_1.default) {
                            toNode.drop(fromNode, DockLocation_1.default.getByName(action.data.location), action.data.index);
                        }
                    }
                    break;
                }
            case Actions_1.default.DELETE_TAB:
                {
                    var node = this._idMap[action.data.node];
                    if (node instanceof TabNode_1.default) {
                        delete this._idMap[action.data.node];
                        node._delete();
                    }
                    break;
                }
            case Actions_1.default.RENAME_TAB:
                {
                    var node = this._idMap[action.data.node];
                    if (node instanceof TabNode_1.default) {
                        node._setName(action.data.text);
                    }
                    break;
                }
            case Actions_1.default.SELECT_TAB:
                {
                    var tabNode = this._idMap[action.data.tabNode];
                    if (tabNode instanceof TabNode_1.default) {
                        var parent_1 = tabNode.getParent();
                        var pos = parent_1.getChildren().indexOf(tabNode);
                        if (parent_1 instanceof BorderNode_1.default) {
                            if (parent_1.getSelected() === pos) {
                                parent_1._setSelected(-1);
                            }
                            else {
                                parent_1._setSelected(pos);
                            }
                        }
                        else if (parent_1 instanceof TabSetNode_1.default) {
                            if (parent_1.getSelected() !== pos) {
                                parent_1._setSelected(pos);
                            }
                            this._activeTabSet = parent_1;
                        }
                    }
                    break;
                }
            case Actions_1.default.SET_ACTIVE_TABSET:
                {
                    var tabsetNode = this._idMap[action.data.tabsetNode];
                    if (tabsetNode instanceof TabSetNode_1.default) {
                        this._activeTabSet = tabsetNode;
                    }
                    break;
                }
            case Actions_1.default.ADJUST_SPLIT:
                {
                    var node1 = this._idMap[action.data.node1];
                    var node2 = this._idMap[action.data.node2];
                    if ((node1 instanceof TabSetNode_1.default || node1 instanceof RowNode_1.default) &&
                        (node2 instanceof TabSetNode_1.default || node2 instanceof RowNode_1.default)) {
                        this._adjustSplitSide(node1, action.data.weight1, action.data.pixelWidth1);
                        this._adjustSplitSide(node2, action.data.weight2, action.data.pixelWidth2);
                    }
                    break;
                }
            case Actions_1.default.ADJUST_BORDER_SPLIT:
                {
                    var node = this._idMap[action.data.node];
                    if (node instanceof BorderNode_1.default) {
                        node._setSize(action.data.pos);
                    }
                    break;
                }
            case Actions_1.default.MAXIMIZE_TOGGLE:
                {
                    var node = this._idMap[action.data.node];
                    if (node instanceof TabSetNode_1.default) {
                        if (node === this._maximizedTabSet) {
                            this._maximizedTabSet = undefined;
                        }
                        else {
                            this._maximizedTabSet = node;
                            this._activeTabSet = node;
                        }
                    }
                    break;
                }
            case Actions_1.default.UPDATE_MODEL_ATTRIBUTES:
                {
                    this._updateAttrs(action.data.json);
                    break;
                }
            case Actions_1.default.UPDATE_NODE_ATTRIBUTES:
                {
                    var node = this._idMap[action.data.node];
                    node._updateAttrs(action.data.json);
                    break;
                }
            default:
                break;
        }
        this._updateIdMap();
        if (this._changeListener !== undefined) {
            this._changeListener();
        }
    };
    /** @hidden @internal */
    Model.prototype._updateIdMap = function () {
        var _this = this;
        // regenerate idMap to stop it building up
        this._idMap = {};
        this.visitNodes(function (node) { return _this._idMap[node.getId()] = node; });
        // console.log(JSON.stringify(Object.keys(this._idMap)));
    };
    /** @hidden @internal */
    Model.prototype._adjustSplitSide = function (node, weight, pixels) {
        node._setWeight(weight);
        if (node.getWidth() != null && node.getOrientation() === Orientation_1.default.VERT) {
            node._updateAttrs({ width: pixels });
        }
        else if (node.getHeight() != null && node.getOrientation() === Orientation_1.default.HORZ) {
            node._updateAttrs({ height: pixels });
        }
    };
    /**
     * Converts the model to a json object
     * @returns {*} json object that represents this model
     */
    Model.prototype.toJson = function () {
        var json = { global: {}, layout: {} };
        Model._attributeDefinitions.toJson(json.global, this._attributes);
        // save state of nodes
        this.visitNodes(function (node) {
            node._fireEvent("save", undefined);
        });
        json.borders = this._borders._toJson();
        json.layout = this._root._toJson();
        return json;
    };
    Model.prototype.getSplitterSize = function () {
        return this._attributes.splitterSize;
    };
    Model.prototype.isEnableEdgeDock = function () {
        return this._attributes.enableEdgeDock;
    };
    /** @hidden @internal */
    Model.prototype._addNode = function (node) {
        var id = node.getId();
        if (this._idMap[id] !== undefined) {
            throw new Error("Error: each node must have a unique id, duplicate id:" + node.getId());
        }
        if (node.getType() !== "splitter") {
            this._idMap[id] = node;
        }
    };
    /** @hidden @internal */
    Model.prototype._layout = function (rect) {
        // let start = Date.now();
        this._borderRects = this._borders._layoutBorder({ outer: rect, inner: rect });
        rect = this._borderRects.inner.removeInsets(this._getAttribute("marginInsets"));
        this._root._layout(rect);
        return rect;
        // console.log("layout time: " + (Date.now() - start));
    };
    /** @hidden @internal */
    Model.prototype._findDropTargetNode = function (dragNode, x, y) {
        var node = this._root._findDropTargetNode(dragNode, x, y);
        if (node === undefined) {
            node = this._borders._findDropTargetNode(dragNode, x, y);
        }
        return node;
    };
    /** @hidden @internal */
    Model.prototype._tidy = function () {
        // console.log("before _tidy", this.toString());
        this._root._tidy();
        // console.log("after _tidy", this.toString());
    };
    /** @hidden @internal */
    Model.prototype._updateAttrs = function (json) {
        Model._attributeDefinitions.update(json, this._attributes);
    };
    /** @hidden @internal */
    Model.prototype._nextUniqueId = function () {
        this._nextId++;
        while (this._idMap["#" + this._nextId] !== undefined) {
            this._nextId++;
        }
        return "#" + this._nextId;
    };
    /** @hidden @internal */
    Model.prototype._getAttribute = function (name) {
        return this._attributes[name];
    };
    /**
     * Sets a function to allow/deny dropping a node
     * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
     */
    Model.prototype.setOnAllowDrop = function (onAllowDrop) {
        this._onAllowDrop = onAllowDrop;
    };
    /** @hidden @internal */
    Model.prototype._getOnAllowDrop = function () {
        return this._onAllowDrop;
    };
    Model.prototype.toString = function () {
        return JSON.stringify(this.toJson());
    };
    /** @hidden @internal */
    Model._attributeDefinitions = Model._createAttributeDefinitions();
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=Model.js.map