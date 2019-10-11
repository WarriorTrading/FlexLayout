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
var React = require("react");
var ReactDOM = require("react-dom");
var DockLocation_1 = require("../DockLocation");
var DragDrop_1 = require("../DragDrop");
var Actions_1 = require("../model/Actions");
var SplitterNode_1 = require("../model/SplitterNode");
var TabNode_1 = require("../model/TabNode");
var TabSetNode_1 = require("../model/TabSetNode");
var Rect_1 = require("../Rect");
var BorderTabSet_1 = require("./BorderTabSet");
var Splitter_1 = require("./Splitter");
var Tab_1 = require("./Tab");
var TabSet_1 = require("./TabSet");
/**
 * A React component that hosts a multi-tabbed layout
 */
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout(props) {
        var _this = _super.call(this, props) || this;
        /** @hidden @internal */
        _this.firstMove = false;
        /** @hidden @internal */
        _this.dragDivText = "";
        /** @hidden @internal */
        _this.onModelChange = function () {
            _this.forceUpdate();
            if (_this.props.onModelChange) {
                _this.props.onModelChange(_this.model);
            }
        };
        /** @hidden @internal */
        _this.updateRect = function () {
            var domRect = _this.selfRef.getBoundingClientRect();
            var rect = new Rect_1.default(0, 0, domRect.width, domRect.height);
            if (!rect.equals(_this.rect)) {
                _this.rect = rect;
                _this.forceUpdate();
            }
        };
        /** @hidden @internal */
        _this.getClassName = function (defaultClassName, node) {
            if (_this.props.classNameMapper === undefined) {
                return defaultClassName;
            }
            else {
                return _this.props.classNameMapper(node, defaultClassName);
            }
        };
        /** @hidden @internal */
        _this.onCancelAdd = function () {
            var rootdiv = ReactDOM.findDOMNode(_this);
            rootdiv.removeChild(_this.dragDiv);
            _this.dragDiv = undefined;
            if (_this.fnNewNodeDropped != null) {
                _this.fnNewNodeDropped();
                _this.fnNewNodeDropped = undefined;
            }
            DragDrop_1.default.instance.hideGlass();
            _this.newTabJson = undefined;
        };
        /** @hidden @internal */
        _this.onCancelDrag = function (wasDragging) {
            if (wasDragging) {
                var rootdiv = ReactDOM.findDOMNode(_this);
                try {
                    rootdiv.removeChild(_this.outlineDiv);
                }
                catch (e) { }
                try {
                    rootdiv.removeChild(_this.dragDiv);
                }
                catch (e) { }
                _this.dragDiv = undefined;
                _this.hideEdges(rootdiv);
                if (_this.fnNewNodeDropped != null) {
                    _this.fnNewNodeDropped();
                    _this.fnNewNodeDropped = undefined;
                }
                DragDrop_1.default.instance.hideGlass();
                _this.newTabJson = undefined;
            }
        };
        /** @hidden @internal */
        _this.onDragDivMouseDown = function (event) {
            event.preventDefault();
            _this.dragStart(event, _this.dragDivText, TabNode_1.default._fromJson(_this.newTabJson, _this.model), true, undefined, undefined);
        };
        /** @hidden @internal */
        _this.dragStart = function (event, dragDivText, node, allowDrag, onClick, onDoubleClick) {
            if (_this.model.getMaximizedTabset() !== undefined || !allowDrag) {
                DragDrop_1.default.instance.startDrag(event, undefined, undefined, undefined, undefined, onClick, onDoubleClick);
            }
            else {
                _this.dragNode = node;
                _this.dragDivText = dragDivText;
                DragDrop_1.default.instance.startDrag(event, _this.onDragStart, _this.onDragMove, _this.onDragEnd, _this.onCancelDrag, onClick, onDoubleClick);
            }
        };
        /** @hidden @internal */
        _this.onDragStart = function () {
            _this.dropInfo = undefined;
            var rootdiv = ReactDOM.findDOMNode(_this);
            _this.outlineDiv = document.createElement("div");
            _this.outlineDiv.className = _this.getClassName("flexlayout__outline_rect", null);
            rootdiv.appendChild(_this.outlineDiv);
            if (_this.dragDiv == null) {
                _this.dragDiv = document.createElement("div");
                _this.dragDiv.className = _this.getClassName("flexlayout__drag_rect", null);
                _this.dragDiv.innerHTML = _this.dragDivText;
                rootdiv.appendChild(_this.dragDiv);
            }
            // add edge indicators
            _this.showEdges(rootdiv);
            if (_this.dragNode !== undefined &&
                _this.dragNode instanceof TabNode_1.default &&
                _this.dragNode.getTabRect() !== undefined) {
                _this.dragNode.getTabRect().positionElement(_this.outlineDiv);
            }
            _this.firstMove = true;
            return true;
        };
        /** @hidden @internal */
        _this.onDragMove = function (event) {
            if (_this.firstMove === false) {
                var speed = _this.model._getAttribute("tabDragSpeed");
                _this.outlineDiv.style.transition = "top " + speed + "s, left " + speed + "s, width " + speed + "s, height " + speed + "s";
            }
            _this.firstMove = false;
            var clientRect = _this.selfRef.getBoundingClientRect();
            var pos = {
                x: event.clientX - clientRect.left,
                y: event.clientY - clientRect.top
            };
            _this.dragDiv.style.left =
                pos.x - _this.dragDiv.getBoundingClientRect().width / 2 + "px";
            _this.dragDiv.style.top = pos.y + 5 + "px";
            var dropInfo = _this.model._findDropTargetNode(_this.dragNode, pos.x, pos.y);
            if (dropInfo) {
                _this.dropInfo = dropInfo;
                _this.outlineDiv.className = _this.getClassName(dropInfo.className, null);
                dropInfo.rect.positionElement(_this.outlineDiv);
            }
        };
        /** @hidden @internal */
        _this.onDragEnd = function () {
            var rootdiv = ReactDOM.findDOMNode(_this);
            rootdiv.removeChild(_this.outlineDiv);
            rootdiv.removeChild(_this.dragDiv);
            _this.dragDiv = undefined;
            _this.hideEdges(rootdiv);
            DragDrop_1.default.instance.hideGlass();
            if (_this.dropInfo) {
                if (_this.newTabJson !== undefined) {
                    _this.doAction(Actions_1.default.addNode(_this.newTabJson, _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
                    if (_this.fnNewNodeDropped != null) {
                        _this.fnNewNodeDropped();
                        _this.fnNewNodeDropped = undefined;
                    }
                    _this.newTabJson = undefined;
                }
                else if (_this.dragNode !== undefined) {
                    _this.doAction(Actions_1.default.moveNode(_this.dragNode.getId(), _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
                }
            }
        };
        _this.model = _this.props.model;
        _this.rect = new Rect_1.default(0, 0, 0, 0);
        _this.model._setChangeListener(_this.onModelChange);
        _this.updateRect = _this.updateRect;
        _this.getClassName = _this.getClassName;
        _this.tabIds = [];
        return _this;
    }
    /** @hidden @internal */
    Layout.prototype.doAction = function (action) {
        if (this.props.onAction !== undefined) {
            var outcome = this.props.onAction(action);
            if (outcome !== undefined) {
                this.model.doAction(outcome);
            }
        }
        else {
            this.model.doAction(action);
        }
    };
    /** @hidden @internal */
    Layout.prototype.componentWillReceiveProps = function (newProps) {
        if (this.model !== newProps.model) {
            if (this.model !== undefined) {
                this.model._setChangeListener(undefined); // stop listening to old model
            }
            this.model = newProps.model;
            this.model._setChangeListener(this.onModelChange);
            this.forceUpdate();
        }
    };
    /** @hidden @internal */
    Layout.prototype.componentDidMount = function () {
        this.updateRect();
        // need to re-render if size changes
        window.addEventListener("resize", this.updateRect);
    };
    /** @hidden @internal */
    Layout.prototype.componentDidUpdate = function () {
        this.updateRect();
        // console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
    };
    /** @hidden @internal */
    Layout.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.updateRect);
    };
    /** @hidden @internal */
    Layout.prototype.render = function () {
        var _this = this;
        // this.start = Date.now();
        var borderComponents = [];
        var tabSetComponents = [];
        var tabComponents = {};
        var splitterComponents = [];
        this.centerRect = this.model._layout(this.rect);
        this.renderBorder(this.model.getBorderSet(), borderComponents, tabComponents, splitterComponents);
        this.renderChildren(this.model.getRoot(), tabSetComponents, tabComponents, splitterComponents);
        var nextTopIds = [];
        var nextTopIdsMap = {};
        // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
        this.tabIds.forEach(function (t) {
            if (tabComponents[t]) {
                nextTopIds.push(t);
                nextTopIdsMap[t] = t;
            }
        });
        this.tabIds = nextTopIds;
        // Add tabs that have been added to the DOM
        Object.keys(tabComponents).forEach(function (t) {
            if (!nextTopIdsMap[t]) {
                _this.tabIds.push(t);
            }
        });
        // this.layoutTime = (Date.now() - this.start);
        return (React.createElement("div", { ref: function (self) { return (_this.selfRef = self === null ? undefined : self); }, className: this.getClassName("flexlayout__layout", null) },
            tabSetComponents,
            this.tabIds.map(function (t) {
                return tabComponents[t];
            }),
            borderComponents,
            splitterComponents));
    };
    /** @hidden @internal */
    Layout.prototype.renderBorder = function (borderSet, borderComponents, tabComponents, splitterComponents) {
        for (var _i = 0, _a = borderSet.getBorders(); _i < _a.length; _i++) {
            var border = _a[_i];
            if (border.isShowing()) {
                borderComponents.push(React.createElement(BorderTabSet_1.BorderTabSet, { key: "border_" + border.getLocation().getName(), border: border, layout: this }));
                var drawChildren = border._getDrawChildren();
                var i = 0;
                for (var _b = 0, drawChildren_1 = drawChildren; _b < drawChildren_1.length; _b++) {
                    var child = drawChildren_1[_b];
                    if (child instanceof SplitterNode_1.default) {
                        splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, node: child }));
                    }
                    else if (child instanceof TabNode_1.default) {
                        tabComponents[child.getId()] = (React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, node: child, selected: i === border.getSelected(), factory: this.props.factory }));
                    }
                    i++;
                }
            }
        }
    };
    /** @hidden @internal */
    Layout.prototype.renderChildren = function (node, tabSetComponents, tabComponents, splitterComponents) {
        var drawChildren = node._getDrawChildren();
        for (var _i = 0, _a = drawChildren; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof SplitterNode_1.default) {
                splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, node: child }));
            }
            else if (child instanceof TabSetNode_1.default) {
                tabSetComponents.push(React.createElement(TabSet_1.TabSet, { key: child.getId(), layout: this, node: child }));
                this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
            }
            else if (child instanceof TabNode_1.default) {
                var selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
                if (selectedTab === undefined) {
                    // this should not happen!
                    // tslint:disable-next-line: no-console
                    console.warn("undefined selectedTab should not happen");
                }
                tabComponents[child.getId()] = (React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, node: child, selected: child === selectedTab, factory: this.props.factory }));
            }
            else {
                // is row
                this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
            }
        }
    };
    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
     */
    Layout.prototype.addTabToTabSet = function (tabsetId, json) {
        var tabsetNode = this.model.getNodeById(tabsetId);
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.default.addNode(json, tabsetId, DockLocation_1.default.CENTER, -1));
        }
    };
    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
    Layout.prototype.addTabToActiveTabSet = function (json) {
        var tabsetNode = this.model.getActiveTabset();
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.default.addNode(json, tabsetNode.getId(), DockLocation_1.default.CENTER, -1));
        }
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
    Layout.prototype.addTabWithDragAndDrop = function (dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        this.dragStart(undefined, dragText, TabNode_1.default._fromJson(json, this.model), true, undefined, undefined);
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
    Layout.prototype.addTabWithDragAndDropIndirect = function (dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        DragDrop_1.default.instance.addGlass(this.onCancelAdd);
        this.dragDivText = dragText;
        this.dragDiv = document.createElement("div");
        this.dragDiv.className = this.getClassName("flexlayout__drag_rect", null);
        this.dragDiv.innerHTML = this.dragDivText;
        this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown);
        this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown);
        var r = new Rect_1.default(10, 10, 150, 50);
        r.centerInRect(this.rect);
        this.dragDiv.style.left = r.x + "px";
        this.dragDiv.style.top = r.y + "px";
        var rootdiv = ReactDOM.findDOMNode(this);
        rootdiv.appendChild(this.dragDiv);
    };
    /** @hidden @internal */
    Layout.prototype.showEdges = function (rootdiv) {
        if (this.model.isEnableEdgeDock()) {
            var domRect = rootdiv.getBoundingClientRect();
            var r = this.centerRect;
            var size = 100;
            var length_1 = size + "px";
            var radius = "50px";
            var width = "10px";
            this.edgeTopDiv = document.createElement("div");
            this.edgeTopDiv.className = this.getClassName("flexlayout__edge_rect", null);
            this.edgeTopDiv.style.top = r.y + "px";
            this.edgeTopDiv.style.left = r.x + (r.width - size) / 2 + "px";
            this.edgeTopDiv.style.width = length_1;
            this.edgeTopDiv.style.height = width;
            this.edgeTopDiv.style.borderBottomLeftRadius = radius;
            this.edgeTopDiv.style.borderBottomRightRadius = radius;
            this.edgeLeftDiv = document.createElement("div");
            this.edgeLeftDiv.className = this.getClassName("flexlayout__edge_rect", null);
            this.edgeLeftDiv.style.top = r.y + (r.height - size) / 2 + "px";
            this.edgeLeftDiv.style.left = r.x + "px";
            this.edgeLeftDiv.style.width = width;
            this.edgeLeftDiv.style.height = length_1;
            this.edgeLeftDiv.style.borderTopRightRadius = radius;
            this.edgeLeftDiv.style.borderBottomRightRadius = radius;
            this.edgeBottomDiv = document.createElement("div");
            this.edgeBottomDiv.className = this.getClassName("flexlayout__edge_rect", null);
            this.edgeBottomDiv.style.bottom = domRect.height - r.getBottom() + "px";
            this.edgeBottomDiv.style.left = r.x + (r.width - size) / 2 + "px";
            this.edgeBottomDiv.style.width = length_1;
            this.edgeBottomDiv.style.height = width;
            this.edgeBottomDiv.style.borderTopLeftRadius = radius;
            this.edgeBottomDiv.style.borderTopRightRadius = radius;
            this.edgeRightDiv = document.createElement("div");
            this.edgeRightDiv.className = this.getClassName("flexlayout__edge_rect", null);
            this.edgeRightDiv.style.top = r.y + (r.height - size) / 2 + "px";
            this.edgeRightDiv.style.right = domRect.width - r.getRight() + "px";
            this.edgeRightDiv.style.width = width;
            this.edgeRightDiv.style.height = length_1;
            this.edgeRightDiv.style.borderTopLeftRadius = radius;
            this.edgeRightDiv.style.borderBottomLeftRadius = radius;
            rootdiv.appendChild(this.edgeTopDiv);
            rootdiv.appendChild(this.edgeLeftDiv);
            rootdiv.appendChild(this.edgeBottomDiv);
            rootdiv.appendChild(this.edgeRightDiv);
        }
    };
    /** @hidden @internal */
    Layout.prototype.hideEdges = function (rootdiv) {
        if (this.model.isEnableEdgeDock()) {
            try {
                rootdiv.removeChild(this.edgeTopDiv);
                rootdiv.removeChild(this.edgeLeftDiv);
                rootdiv.removeChild(this.edgeBottomDiv);
                rootdiv.removeChild(this.edgeRightDiv);
            }
            catch (e) { }
        }
    };
    /** @hidden @internal */
    Layout.prototype.maximize = function (tabsetNode) {
        this.doAction(Actions_1.default.maximizeToggle(tabsetNode.getId()));
    };
    /** @hidden @internal */
    Layout.prototype.customizeTab = function (tabNode, renderValues) {
        if (this.props.onRenderTab) {
            this.props.onRenderTab(tabNode, renderValues);
        }
    };
    /** @hidden @internal */
    Layout.prototype.customizeTabSet = function (tabSetNode, renderValues) {
        if (this.props.onRenderTabSet) {
            this.props.onRenderTabSet(tabSetNode, renderValues);
        }
    };
    Layout.prototype.i18nName = function (id, param) {
        var message;
        if (this.props.i18nMapper) {
            message = this.props.i18nMapper(id, param);
        }
        if (message === undefined) {
            message = id + (param === undefined ? "" : param);
        }
        return message;
    };
    return Layout;
}(React.Component));
exports.Layout = Layout;
exports.default = Layout;
//# sourceMappingURL=Layout.js.map