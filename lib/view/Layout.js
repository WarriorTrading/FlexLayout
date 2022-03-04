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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var DockLocation_1 = require("../DockLocation");
var DragDrop_1 = require("../DragDrop");
var Actions_1 = require("../model/Actions");
var BorderNode_1 = require("../model/BorderNode");
var SplitterNode_1 = require("../model/SplitterNode");
var TabNode_1 = require("../model/TabNode");
var TabSetNode_1 = require("../model/TabSetNode");
var Rect_1 = require("../Rect");
var Types_1 = require("../Types");
var BorderTabSet_1 = require("./BorderTabSet");
var Splitter_1 = require("./Splitter");
var Tab_1 = require("./Tab");
var TabSet_1 = require("./TabSet");
var FloatingWindow_1 = require("./FloatingWindow");
var FloatingWindowTab_1 = require("./FloatingWindowTab");
var TabFloating_1 = require("./TabFloating");
var Orientation_1 = require("../Orientation");
var Icons_1 = require("./Icons");
var TabButtonStamp_1 = require("./TabButtonStamp");
var defaultIcons = {
    close: React.createElement(Icons_1.CloseIcon, null),
    closeTabset: React.createElement(Icons_1.CloseIcon, null),
    popout: React.createElement(Icons_1.PopoutIcon, null),
    maximize: React.createElement(Icons_1.MaximizeIcon, null),
    restore: React.createElement(Icons_1.RestoreIcon, null),
    more: React.createElement(Icons_1.OverflowIcon, null),
};
// Popout windows work in latest browsers based on webkit (Chrome, Opera, Safari, latest Edge) and Firefox. They do
// not work on any version if IE or the original Edge browser
// Assume any recent desktop browser not IE or original Edge will work
/** @internal */
// @ts-ignore
var isIEorEdge = typeof window !== "undefined" && (window.document.documentMode || /Edge\//.test(window.navigator.userAgent));
/** @internal */
var isDesktop = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
/** @internal */
var defaultSupportsPopout = isDesktop && !isIEorEdge;
/**
 * A React component that hosts a multi-tabbed layout
 */
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout(props) {
        var _this = _super.call(this, props) || this;
        /** @internal */
        _this.firstMove = false;
        /** @internal */
        _this.dragRectRendered = true;
        /** @internal */
        _this.dragDivText = undefined;
        /** @internal */
        _this.edgeRectLength = 100;
        /** @internal */
        _this.edgeRectWidth = 10;
        /** @internal */
        _this.edgesShown = false;
        /** @internal */
        _this.onModelChange = function () {
            _this.forceUpdate();
            if (_this.props.onModelChange) {
                _this.props.onModelChange(_this.props.model);
            }
        };
        /** @internal */
        _this.updateRect = function (domRect) {
            if (domRect === void 0) { domRect = _this.getDomRect(); }
            var rect = new Rect_1.Rect(0, 0, domRect.width, domRect.height);
            if (!rect.equals(_this.state.rect) && rect.width !== 0 && rect.height !== 0) {
                _this.setState({ rect: rect });
            }
        };
        /** @internal */
        _this.updateLayoutMetrics = function () {
            if (_this.findHeaderBarSizeRef.current) {
                var headerBarSize = _this.findHeaderBarSizeRef.current.getBoundingClientRect().height;
                if (headerBarSize !== _this.state.calculatedHeaderBarSize) {
                    _this.setState({ calculatedHeaderBarSize: headerBarSize });
                }
            }
            if (_this.findTabBarSizeRef.current) {
                var tabBarSize = _this.findTabBarSizeRef.current.getBoundingClientRect().height;
                if (tabBarSize !== _this.state.calculatedTabBarSize) {
                    _this.setState({ calculatedTabBarSize: tabBarSize });
                }
            }
            if (_this.findBorderBarSizeRef.current) {
                var borderBarSize = _this.findBorderBarSizeRef.current.getBoundingClientRect().height;
                if (borderBarSize !== _this.state.calculatedBorderBarSize) {
                    _this.setState({ calculatedBorderBarSize: borderBarSize });
                }
            }
        };
        /** @internal */
        _this.getClassName = function (defaultClassName) {
            if (_this.props.classNameMapper === undefined) {
                return defaultClassName;
            }
            else {
                return _this.props.classNameMapper(defaultClassName);
            }
        };
        /** @internal */
        _this.onCloseWindow = function (id) {
            _this.doAction(Actions_1.Actions.unFloatTab(id));
            try {
                _this.props.model.getNodeById(id)._setWindow(undefined);
            }
            catch (e) {
                // catch incase it was a model change
            }
        };
        /** @internal */
        _this.onSetWindow = function (id, window) {
            _this.props.model.getNodeById(id)._setWindow(window);
        };
        /** @internal */
        _this.onCancelAdd = function () {
            var _a, _b;
            var rootdiv = _this.selfRef.current;
            rootdiv.removeChild(_this.dragDiv);
            _this.dragDiv = undefined;
            _this.hidePortal();
            if (_this.fnNewNodeDropped != null) {
                _this.fnNewNodeDropped();
                _this.fnNewNodeDropped = undefined;
            }
            try {
                (_b = (_a = _this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            catch (e) {
                console.error(e);
            }
            DragDrop_1.DragDrop.instance.hideGlass();
            _this.newTabJson = undefined;
            _this.customDrop = undefined;
        };
        /** @internal */
        _this.onCancelDrag = function (wasDragging) {
            var _a, _b;
            if (wasDragging) {
                var rootdiv = _this.selfRef.current;
                try {
                    rootdiv.removeChild(_this.outlineDiv);
                }
                catch (e) { }
                try {
                    rootdiv.removeChild(_this.dragDiv);
                }
                catch (e) { }
                _this.dragDiv = undefined;
                _this.hidePortal();
                _this.hideEdges(rootdiv);
                if (_this.fnNewNodeDropped != null) {
                    _this.fnNewNodeDropped();
                    _this.fnNewNodeDropped = undefined;
                }
                try {
                    (_b = (_a = _this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                catch (e) {
                    console.error(e);
                }
                DragDrop_1.DragDrop.instance.hideGlass();
                _this.newTabJson = undefined;
                _this.customDrop = undefined;
            }
            _this.setState({ showHiddenBorder: DockLocation_1.DockLocation.CENTER });
        };
        /** @internal */
        _this.onDragDivMouseDown = function (event) {
            event.preventDefault();
            _this.dragStart(event, _this.dragDivText, TabNode_1.TabNode._fromJson(_this.newTabJson, _this.props.model, false), true, undefined, undefined);
        };
        /** @internal */
        _this.dragStart = function (event, dragDivText, node, allowDrag, onClick, onDoubleClick) {
            if (_this.props.model.getMaximizedTabset() !== undefined || !allowDrag) {
                DragDrop_1.DragDrop.instance.startDrag(event, undefined, undefined, undefined, undefined, onClick, onDoubleClick, _this.currentDocument, _this.selfRef.current);
            }
            else {
                _this.dragNode = node;
                _this.dragDivText = dragDivText;
                DragDrop_1.DragDrop.instance.startDrag(event, _this.onDragStart, _this.onDragMove, _this.onDragEnd, _this.onCancelDrag, onClick, onDoubleClick, _this.currentDocument, _this.selfRef.current);
            }
        };
        /** @internal */
        _this.dragRectRender = function (text, node, json, onRendered) {
            var content;
            if (text !== undefined) {
                content = React.createElement("div", { style: { whiteSpace: "pre" } }, text.replace("<br>", "\n"));
            }
            else {
                if (node && node instanceof TabNode_1.TabNode) {
                    content = (React.createElement(TabButtonStamp_1.TabButtonStamp, { node: node, layout: _this, iconFactory: _this.props.iconFactory, titleFactory: _this.props.titleFactory }));
                }
            }
            if (_this.props.onRenderDragRect !== undefined) {
                var customContent = _this.props.onRenderDragRect(content, node, json);
                if (customContent !== undefined) {
                    content = customContent;
                }
            }
            // hide div until the render is complete
            _this.dragDiv.style.visibility = "hidden";
            _this.dragRectRendered = false;
            _this.showPortal(React.createElement(DragRectRenderWrapper
            // wait for it to be rendered
            , { 
                // wait for it to be rendered
                onRendered: function () {
                    _this.dragRectRendered = true;
                    onRendered === null || onRendered === void 0 ? void 0 : onRendered();
                } }, content), _this.dragDiv);
        };
        /** @internal */
        _this.showPortal = function (control, element) {
            var portal = ReactDOM.createPortal(control, element);
            _this.setState({ portal: portal });
        };
        /** @internal */
        _this.hidePortal = function () {
            _this.setState({ portal: undefined });
        };
        /** @internal */
        _this.onDragStart = function () {
            _this.dropInfo = undefined;
            _this.customDrop = undefined;
            var rootdiv = _this.selfRef.current;
            _this.outlineDiv = _this.currentDocument.createElement("div");
            _this.outlineDiv.className = _this.getClassName(Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
            _this.outlineDiv.style.visibility = "hidden";
            rootdiv.appendChild(_this.outlineDiv);
            if (_this.dragDiv == null) {
                _this.dragDiv = _this.currentDocument.createElement("div");
                _this.dragDiv.className = _this.getClassName(Types_1.CLASSES.FLEXLAYOUT__DRAG_RECT);
                _this.dragDiv.setAttribute("data-layout-path", "/drag-rectangle");
                _this.dragRectRender(_this.dragDivText, _this.dragNode, _this.newTabJson);
                rootdiv.appendChild(_this.dragDiv);
            }
            // add edge indicators
            _this.showEdges(rootdiv);
            if (_this.dragNode !== undefined && _this.dragNode instanceof TabNode_1.TabNode && _this.dragNode.getTabRect() !== undefined) {
                _this.dragNode.getTabRect().positionElement(_this.outlineDiv);
            }
            _this.firstMove = true;
            return true;
        };
        /** @internal */
        _this.onDragMove = function (event) {
            if (_this.firstMove === false) {
                var speed = _this.props.model._getAttribute("tabDragSpeed");
                _this.outlineDiv.style.transition = "top ".concat(speed, "s, left ").concat(speed, "s, width ").concat(speed, "s, height ").concat(speed, "s");
            }
            _this.firstMove = false;
            var clientRect = _this.selfRef.current.getBoundingClientRect();
            var pos = {
                x: event.clientX - clientRect.left,
                y: event.clientY - clientRect.top,
            };
            _this.checkForBorderToShow(pos.x, pos.y);
            // keep it between left & right
            var dragRect = _this.dragDiv.getBoundingClientRect();
            var newLeft = pos.x - dragRect.width / 2;
            if (newLeft + dragRect.width > clientRect.width) {
                newLeft = clientRect.width - dragRect.width;
            }
            newLeft = Math.max(0, newLeft);
            _this.dragDiv.style.left = newLeft + "px";
            _this.dragDiv.style.top = pos.y + 5 + "px";
            if (_this.dragRectRendered && _this.dragDiv.style.visibility === "hidden") {
                // make visible once the drag rect has been rendered
                _this.dragDiv.style.visibility = "visible";
            }
            var dropInfo = _this.props.model._findDropTargetNode(_this.dragNode, pos.x, pos.y);
            if (dropInfo) {
                if (_this.props.onTabDrag) {
                    _this.handleCustomTabDrag(dropInfo, pos, event);
                }
                else {
                    _this.dropInfo = dropInfo;
                    _this.outlineDiv.className = _this.getClassName(dropInfo.className);
                    dropInfo.rect.positionElement(_this.outlineDiv);
                    _this.outlineDiv.style.visibility = "visible";
                }
            }
        };
        /** @internal */
        _this.onDragEnd = function (event) {
            var rootdiv = _this.selfRef.current;
            rootdiv.removeChild(_this.outlineDiv);
            rootdiv.removeChild(_this.dragDiv);
            _this.dragDiv = undefined;
            _this.hidePortal();
            _this.hideEdges(rootdiv);
            DragDrop_1.DragDrop.instance.hideGlass();
            if (_this.dropInfo) {
                if (_this.customDrop) {
                    _this.newTabJson = undefined;
                    try {
                        var _a = _this.customDrop, callback = _a.callback, dragging = _a.dragging, over = _a.over, x = _a.x, y = _a.y, location_1 = _a.location;
                        callback(dragging, over, x, y, location_1);
                        if (_this.fnNewNodeDropped != null) {
                            _this.fnNewNodeDropped();
                            _this.fnNewNodeDropped = undefined;
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (_this.newTabJson !== undefined) {
                    var newNode = _this.doAction(Actions_1.Actions.addNode(_this.newTabJson, _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
                    if (_this.fnNewNodeDropped != null) {
                        _this.fnNewNodeDropped(newNode, event);
                        _this.fnNewNodeDropped = undefined;
                    }
                    _this.newTabJson = undefined;
                }
                else if (_this.dragNode !== undefined) {
                    _this.doAction(Actions_1.Actions.moveNode(_this.dragNode.getId(), _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
                }
            }
            _this.setState({ showHiddenBorder: DockLocation_1.DockLocation.CENTER });
        };
        _this.props.model._setChangeListener(_this.onModelChange);
        _this.tabIds = [];
        _this.selfRef = React.createRef();
        _this.findHeaderBarSizeRef = React.createRef();
        _this.findTabBarSizeRef = React.createRef();
        _this.findBorderBarSizeRef = React.createRef();
        _this.supportsPopout = props.supportsPopout !== undefined ? props.supportsPopout : defaultSupportsPopout;
        _this.popoutURL = props.popoutURL ? props.popoutURL : "popout.html";
        _this.icons = __assign(__assign({}, defaultIcons), props.icons);
        _this.firstRender = true;
        _this.state = {
            rect: new Rect_1.Rect(0, 0, 0, 0),
            calculatedHeaderBarSize: 25,
            calculatedTabBarSize: 26,
            calculatedBorderBarSize: 30,
            editingTab: undefined,
            showHiddenBorder: DockLocation_1.DockLocation.CENTER,
        };
        _this.onDragEnter = _this.onDragEnter.bind(_this);
        return _this;
    }
    /** @internal */
    Layout.prototype.styleFont = function (style) {
        if (this.props.font) {
            if (this.selfRef.current) {
                if (this.props.font.size) {
                    this.selfRef.current.style.setProperty("--font-size", this.props.font.size);
                }
                if (this.props.font.family) {
                    this.selfRef.current.style.setProperty("--font-family", this.props.font.family);
                }
            }
            if (this.props.font.style) {
                style.fontStyle = this.props.font.style;
            }
            if (this.props.font.weight) {
                style.fontWeight = this.props.font.weight;
            }
        }
        return style;
    };
    /** @internal */
    Layout.prototype.doAction = function (action) {
        if (this.props.onAction !== undefined) {
            var outcome = this.props.onAction(action);
            if (outcome !== undefined) {
                return this.props.model.doAction(outcome);
            }
            return undefined;
        }
        else {
            return this.props.model.doAction(action);
        }
    };
    /** @internal */
    Layout.prototype.componentDidMount = function () {
        var _this = this;
        this.updateRect();
        this.updateLayoutMetrics();
        // need to re-render if size changes
        this.currentDocument = this.selfRef.current.ownerDocument;
        this.currentWindow = this.currentDocument.defaultView;
        this.resizeObserver = new ResizeObserver(function (entries) {
            _this.updateRect(entries[0].contentRect);
        });
        this.resizeObserver.observe(this.selfRef.current);
    };
    /** @internal */
    Layout.prototype.componentDidUpdate = function () {
        this.updateLayoutMetrics();
        if (this.props.model !== this.previousModel) {
            if (this.previousModel !== undefined) {
                this.previousModel._setChangeListener(undefined); // stop listening to old model
            }
            this.props.model._setChangeListener(this.onModelChange);
            this.previousModel = this.props.model;
        }
        // console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
    };
    /** @internal */
    Layout.prototype.getCurrentDocument = function () {
        return this.currentDocument;
    };
    /** @internal */
    Layout.prototype.getDomRect = function () {
        return this.selfRef.current.getBoundingClientRect();
    };
    /** @internal */
    Layout.prototype.getRootDiv = function () {
        return this.selfRef.current;
    };
    /** @internal */
    Layout.prototype.isSupportsPopout = function () {
        return this.supportsPopout;
    };
    /** @internal */
    Layout.prototype.isRealtimeResize = function () {
        var _a;
        return (_a = this.props.realtimeResize) !== null && _a !== void 0 ? _a : false;
    };
    /** @internal */
    Layout.prototype.onTabDrag = function () {
        var _a, _b;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_b = (_a = this.props).onTabDrag) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([_a], args, false));
    };
    /** @internal */
    Layout.prototype.getPopoutURL = function () {
        return this.popoutURL;
    };
    /** @internal */
    Layout.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.selfRef.current);
    };
    /** @internal */
    Layout.prototype.setEditingTab = function (tabNode) {
        this.setState({ editingTab: tabNode });
    };
    /** @internal */
    Layout.prototype.getEditingTab = function () {
        return this.state.editingTab;
    };
    /** @internal */
    Layout.prototype.render = function () {
        // first render will be used to find the size (via selfRef)
        if (this.firstRender) {
            this.firstRender = false;
            return (React.createElement("div", { ref: this.selfRef, className: this.getClassName(Types_1.CLASSES.FLEXLAYOUT__LAYOUT) }, this.metricsElements()));
        }
        this.props.model._setPointerFine(window && window.matchMedia && window.matchMedia("(pointer: fine)").matches);
        // this.start = Date.now();
        var borderComponents = [];
        var tabSetComponents = [];
        var floatingWindows = [];
        var tabComponents = {};
        var splitterComponents = [];
        var metrics = {
            headerBarSize: this.state.calculatedHeaderBarSize,
            tabBarSize: this.state.calculatedTabBarSize,
            borderBarSize: this.state.calculatedBorderBarSize
        };
        this.props.model._setShowHiddenBorder(this.state.showHiddenBorder);
        this.centerRect = this.props.model._layout(this.state.rect, metrics);
        this.renderBorder(this.props.model.getBorderSet(), borderComponents, tabComponents, floatingWindows, splitterComponents);
        this.renderChildren("", this.props.model.getRoot(), tabSetComponents, tabComponents, floatingWindows, splitterComponents);
        if (this.edgesShown) {
            this.repositionEdges(this.state.rect);
        }
        var nextTopIds = [];
        var nextTopIdsMap = {};
        // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
        for (var _i = 0, _a = this.tabIds; _i < _a.length; _i++) {
            var t = _a[_i];
            if (tabComponents[t]) {
                nextTopIds.push(t);
                nextTopIdsMap[t] = t;
            }
        }
        this.tabIds = nextTopIds;
        // Add tabs that have been added to the DOM
        for (var _b = 0, _c = Object.keys(tabComponents); _b < _c.length; _b++) {
            var t = _c[_b];
            if (!nextTopIdsMap[t]) {
                this.tabIds.push(t);
            }
        }
        // this.layoutTime = (Date.now() - this.start);
        return (React.createElement("div", { ref: this.selfRef, className: this.getClassName(Types_1.CLASSES.FLEXLAYOUT__LAYOUT), onDragEnter: this.props.onExternalDrag ? this.onDragEnter : undefined },
            tabSetComponents,
            this.tabIds.map(function (t) {
                return tabComponents[t];
            }),
            borderComponents,
            splitterComponents,
            floatingWindows,
            this.metricsElements(),
            this.state.portal));
    };
    /** @internal */
    Layout.prototype.metricsElements = function () {
        // used to measure the tab and border tab sizes
        var fontStyle = this.styleFont({ visibility: "hidden" });
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { key: "findHeaderBarSize", ref: this.findHeaderBarSizeRef, style: fontStyle, className: this.getClassName(Types_1.CLASSES.FLEXLAYOUT__TABSET_HEADER_SIZER) }, "FindHeaderBarSize"),
            React.createElement("div", { key: "findTabBarSize", ref: this.findTabBarSizeRef, style: fontStyle, className: this.getClassName(Types_1.CLASSES.FLEXLAYOUT__TABSET_SIZER) }, "FindTabBarSize"),
            React.createElement("div", { key: "findBorderBarSize", ref: this.findBorderBarSizeRef, style: fontStyle, className: this.getClassName(Types_1.CLASSES.FLEXLAYOUT__BORDER_SIZER) }, "FindBorderBarSize")));
    };
    /** @internal */
    Layout.prototype.renderBorder = function (borderSet, borderComponents, tabComponents, floatingWindows, splitterComponents) {
        for (var _i = 0, _a = borderSet.getBorders(); _i < _a.length; _i++) {
            var border = _a[_i];
            var borderPath = "/border/".concat(border.getLocation().getName());
            if (border.isShowing()) {
                borderComponents.push(React.createElement(BorderTabSet_1.BorderTabSet, { key: "border_".concat(border.getLocation().getName()), path: borderPath, border: border, layout: this, iconFactory: this.props.iconFactory, titleFactory: this.props.titleFactory, icons: this.icons }));
                var drawChildren = border._getDrawChildren();
                var i = 0;
                var tabCount = 0;
                for (var _b = 0, drawChildren_1 = drawChildren; _b < drawChildren_1.length; _b++) {
                    var child = drawChildren_1[_b];
                    if (child instanceof SplitterNode_1.SplitterNode) {
                        var path = borderPath + "/s";
                        splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, node: child, path: path }));
                    }
                    else if (child instanceof TabNode_1.TabNode) {
                        var path = borderPath + "/t" + tabCount++;
                        if (this.supportsPopout && child.isFloating()) {
                            var rect = this._getScreenRect(child);
                            floatingWindows.push(React.createElement(FloatingWindow_1.FloatingWindow, { key: child.getId(), url: this.popoutURL, rect: rect, title: child.getName(), id: child.getId(), onSetWindow: this.onSetWindow, onCloseWindow: this.onCloseWindow },
                                React.createElement(FloatingWindowTab_1.FloatingWindowTab, { layout: this, node: child, factory: this.props.factory })));
                            tabComponents[child.getId()] = React.createElement(TabFloating_1.TabFloating, { key: child.getId(), layout: this, path: path, node: child, selected: i === border.getSelected() });
                        }
                        else {
                            tabComponents[child.getId()] = React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, path: path, node: child, selected: i === border.getSelected(), factory: this.props.factory });
                        }
                    }
                    i++;
                }
            }
        }
    };
    /** @internal */
    Layout.prototype.renderChildren = function (path, node, tabSetComponents, tabComponents, floatingWindows, splitterComponents) {
        var drawChildren = node._getDrawChildren();
        var splitterCount = 0;
        var tabCount = 0;
        var rowCount = 0;
        for (var _i = 0, _a = drawChildren; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof SplitterNode_1.SplitterNode) {
                var newPath = path + "/s" + (splitterCount++);
                splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, path: newPath, node: child }));
            }
            else if (child instanceof TabSetNode_1.TabSetNode) {
                var newPath = path + "/ts" + (rowCount++);
                tabSetComponents.push(React.createElement(TabSet_1.TabSet, { key: child.getId(), layout: this, path: newPath, node: child, iconFactory: this.props.iconFactory, titleFactory: this.props.titleFactory, icons: this.icons }));
                this.renderChildren(newPath, child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
            }
            else if (child instanceof TabNode_1.TabNode) {
                var newPath = path + "/t" + (tabCount++);
                var selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
                if (selectedTab === undefined) {
                    // this should not happen!
                    console.warn("undefined selectedTab should not happen");
                }
                if (this.supportsPopout && child.isFloating()) {
                    var rect = this._getScreenRect(child);
                    floatingWindows.push(React.createElement(FloatingWindow_1.FloatingWindow, { key: child.getId(), url: this.popoutURL, rect: rect, title: child.getName(), id: child.getId(), onSetWindow: this.onSetWindow, onCloseWindow: this.onCloseWindow },
                        React.createElement(FloatingWindowTab_1.FloatingWindowTab, { layout: this, node: child, factory: this.props.factory })));
                    tabComponents[child.getId()] = React.createElement(TabFloating_1.TabFloating, { key: child.getId(), layout: this, path: newPath, node: child, selected: child === selectedTab });
                }
                else {
                    tabComponents[child.getId()] = React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, path: newPath, node: child, selected: child === selectedTab, factory: this.props.factory });
                }
            }
            else {
                // is row
                var newPath = path + ((child.getOrientation() === Orientation_1.Orientation.HORZ) ? "/r" : "/c") + (rowCount++);
                this.renderChildren(newPath, child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
            }
        }
    };
    /** @internal */
    Layout.prototype._getScreenRect = function (node) {
        var rect = node.getRect().clone();
        var bodyRect = this.selfRef.current.getBoundingClientRect();
        var navHeight = Math.min(80, this.currentWindow.outerHeight - this.currentWindow.innerHeight);
        var navWidth = Math.min(80, this.currentWindow.outerWidth - this.currentWindow.innerWidth);
        rect.x = rect.x + bodyRect.x + this.currentWindow.screenX + navWidth;
        rect.y = rect.y + bodyRect.y + this.currentWindow.screenY + navHeight;
        return rect;
    };
    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
     */
    Layout.prototype.addTabToTabSet = function (tabsetId, json) {
        var tabsetNode = this.props.model.getNodeById(tabsetId);
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.Actions.addNode(json, tabsetId, DockLocation_1.DockLocation.CENTER, -1));
        }
    };
    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
    Layout.prototype.addTabToActiveTabSet = function (json) {
        var tabsetNode = this.props.model.getActiveTabset();
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.Actions.addNode(json, tabsetNode.getId(), DockLocation_1.DockLocation.CENTER, -1));
        }
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    Layout.prototype.addTabWithDragAndDrop = function (dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        this.dragStart(undefined, dragText, TabNode_1.TabNode._fromJson(json, this.props.model, false), true, undefined, undefined);
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    Layout.prototype.addTabWithDragAndDropIndirect = function (dragText, json, onDrop) {
        var _this = this;
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        DragDrop_1.DragDrop.instance.addGlass(this.onCancelAdd);
        this.dragDivText = dragText;
        this.dragDiv = this.currentDocument.createElement("div");
        this.dragDiv.className = this.getClassName(Types_1.CLASSES.FLEXLAYOUT__DRAG_RECT);
        this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown);
        this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown);
        this.dragRectRender(this.dragDivText, undefined, this.newTabJson, function () {
            if (_this.dragDiv) {
                // now it's been rendered into the dom it can be centered
                _this.dragDiv.style.visibility = "visible";
                var domRect = _this.dragDiv.getBoundingClientRect();
                var r = new Rect_1.Rect(0, 0, domRect === null || domRect === void 0 ? void 0 : domRect.width, domRect === null || domRect === void 0 ? void 0 : domRect.height);
                r.centerInRect(_this.state.rect);
                _this.dragDiv.setAttribute("data-layout-path", "/drag-rectangle");
                _this.dragDiv.style.left = r.x + "px";
                _this.dragDiv.style.top = r.y + "px";
            }
        });
        var rootdiv = this.selfRef.current;
        rootdiv.appendChild(this.dragDiv);
    };
    /** @internal */
    Layout.prototype.handleCustomTabDrag = function (dropInfo, pos, event) {
        var _this = this;
        var _a, _b, _c;
        var invalidated = (_a = this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated;
        var currentCallback = (_b = this.customDrop) === null || _b === void 0 ? void 0 : _b.callback;
        this.customDrop = undefined;
        var dragging = this.newTabJson || (this.dragNode instanceof TabNode_1.TabNode ? this.dragNode : undefined);
        if (dragging && (dropInfo.node instanceof TabSetNode_1.TabSetNode || dropInfo.node instanceof BorderNode_1.BorderNode) && dropInfo.index === -1) {
            var selected = dropInfo.node.getSelectedNode();
            var tabRect = selected === null || selected === void 0 ? void 0 : selected.getRect();
            if (selected && (tabRect === null || tabRect === void 0 ? void 0 : tabRect.contains(pos.x, pos.y))) {
                var customDrop = undefined;
                try {
                    var dest = this.onTabDrag(dragging, selected, pos.x - tabRect.x, pos.y - tabRect.y, dropInfo.location, function () { return _this.onDragMove(event); });
                    if (dest) {
                        customDrop = {
                            rect: new Rect_1.Rect(dest.x + tabRect.x, dest.y + tabRect.y, dest.width, dest.height),
                            callback: dest.callback,
                            invalidated: dest.invalidated,
                            dragging: dragging,
                            over: selected,
                            x: pos.x - tabRect.x,
                            y: pos.y - tabRect.y,
                            location: dropInfo.location,
                            cursor: dest.cursor
                        };
                    }
                }
                catch (e) {
                    console.error(e);
                }
                if ((customDrop === null || customDrop === void 0 ? void 0 : customDrop.callback) === currentCallback) {
                    invalidated = undefined;
                }
                this.customDrop = customDrop;
            }
        }
        this.dropInfo = dropInfo;
        this.outlineDiv.className = this.getClassName(this.customDrop ? Types_1.CLASSES.FLEXLAYOUT__OUTLINE_RECT : dropInfo.className);
        if (this.customDrop) {
            this.customDrop.rect.positionElement(this.outlineDiv);
        }
        else {
            dropInfo.rect.positionElement(this.outlineDiv);
        }
        DragDrop_1.DragDrop.instance.setGlassCursorOverride((_c = this.customDrop) === null || _c === void 0 ? void 0 : _c.cursor);
        this.outlineDiv.style.visibility = "visible";
        try {
            invalidated === null || invalidated === void 0 ? void 0 : invalidated();
        }
        catch (e) {
            console.error(e);
        }
    };
    /** @internal */
    Layout.prototype.onDragEnter = function (event) {
        // DragDrop keeps track of number of dragenters minus the number of
        // dragleaves. Only start a new drag if there isn't one already.
        if (DragDrop_1.DragDrop.instance.isDragging())
            return;
        var drag = this.props.onExternalDrag(event);
        if (drag) {
            // Mimic addTabWithDragAndDrop, but pass in DragEvent
            this.fnNewNodeDropped = drag.onDrop;
            this.newTabJson = drag.json;
            this.dragStart(event, drag.dragText, TabNode_1.TabNode._fromJson(drag.json, this.props.model, false), true, undefined, undefined);
        }
    };
    /** @internal */
    Layout.prototype.checkForBorderToShow = function (x, y) {
        var r = this.props.model._getOuterInnerRects().outer;
        var c = r.getCenter();
        var margin = this.edgeRectWidth;
        var offset = this.edgeRectLength / 2;
        var overEdge = false;
        if (this.props.model.isEnableEdgeDock() && this.state.showHiddenBorder === DockLocation_1.DockLocation.CENTER) {
            if ((y > c.y - offset && y < c.y + offset) ||
                (x > c.x - offset && x < c.x + offset)) {
                overEdge = true;
            }
        }
        var location = DockLocation_1.DockLocation.CENTER;
        if (!overEdge) {
            if (x <= r.x + margin) {
                location = DockLocation_1.DockLocation.LEFT;
            }
            else if (x >= r.getRight() - margin) {
                location = DockLocation_1.DockLocation.RIGHT;
            }
            else if (y <= r.y + margin) {
                location = DockLocation_1.DockLocation.TOP;
            }
            else if (y >= r.getBottom() - margin) {
                location = DockLocation_1.DockLocation.BOTTOM;
            }
        }
        if (location !== this.state.showHiddenBorder) {
            this.setState({ showHiddenBorder: location });
        }
    };
    /** @internal */
    Layout.prototype.showEdges = function (rootdiv) {
        if (this.props.model.isEnableEdgeDock()) {
            var length_1 = this.edgeRectLength + "px";
            var radius = "50px";
            var width = this.edgeRectWidth + "px";
            this.edgeTopDiv = this.currentDocument.createElement("div");
            this.edgeTopDiv.className = this.getClassName(Types_1.CLASSES.FLEXLAYOUT__EDGE_RECT);
            this.edgeTopDiv.style.width = length_1;
            this.edgeTopDiv.style.height = width;
            this.edgeTopDiv.style.borderBottomLeftRadius = radius;
            this.edgeTopDiv.style.borderBottomRightRadius = radius;
            this.edgeLeftDiv = this.currentDocument.createElement("div");
            this.edgeLeftDiv.className = this.getClassName(Types_1.CLASSES.FLEXLAYOUT__EDGE_RECT);
            this.edgeLeftDiv.style.width = width;
            this.edgeLeftDiv.style.height = length_1;
            this.edgeLeftDiv.style.borderTopRightRadius = radius;
            this.edgeLeftDiv.style.borderBottomRightRadius = radius;
            this.edgeBottomDiv = this.currentDocument.createElement("div");
            this.edgeBottomDiv.className = this.getClassName(Types_1.CLASSES.FLEXLAYOUT__EDGE_RECT);
            this.edgeBottomDiv.style.width = length_1;
            this.edgeBottomDiv.style.height = width;
            this.edgeBottomDiv.style.borderTopLeftRadius = radius;
            this.edgeBottomDiv.style.borderTopRightRadius = radius;
            this.edgeRightDiv = this.currentDocument.createElement("div");
            this.edgeRightDiv.className = this.getClassName(Types_1.CLASSES.FLEXLAYOUT__EDGE_RECT);
            this.edgeRightDiv.style.width = width;
            this.edgeRightDiv.style.height = length_1;
            this.edgeRightDiv.style.borderTopLeftRadius = radius;
            this.edgeRightDiv.style.borderBottomLeftRadius = radius;
            this.repositionEdges(this.state.rect);
            rootdiv.appendChild(this.edgeTopDiv);
            rootdiv.appendChild(this.edgeLeftDiv);
            rootdiv.appendChild(this.edgeBottomDiv);
            rootdiv.appendChild(this.edgeRightDiv);
            this.edgesShown = true;
        }
    };
    /** @internal */
    Layout.prototype.repositionEdges = function (domRect) {
        if (this.props.model.isEnableEdgeDock()) {
            var r = this.centerRect;
            this.edgeTopDiv.style.top = r.y + "px";
            this.edgeTopDiv.style.left = r.x + (r.width - this.edgeRectLength) / 2 + "px";
            this.edgeLeftDiv.style.top = r.y + (r.height - this.edgeRectLength) / 2 + "px";
            this.edgeLeftDiv.style.left = r.x + "px";
            this.edgeBottomDiv.style.bottom = domRect.height - r.getBottom() + "px";
            this.edgeBottomDiv.style.left = r.x + (r.width - this.edgeRectLength) / 2 + "px";
            this.edgeRightDiv.style.top = r.y + (r.height - this.edgeRectLength) / 2 + "px";
            this.edgeRightDiv.style.right = domRect.width - r.getRight() + "px";
        }
    };
    /** @internal */
    Layout.prototype.hideEdges = function (rootdiv) {
        if (this.props.model.isEnableEdgeDock()) {
            try {
                rootdiv.removeChild(this.edgeTopDiv);
                rootdiv.removeChild(this.edgeLeftDiv);
                rootdiv.removeChild(this.edgeBottomDiv);
                rootdiv.removeChild(this.edgeRightDiv);
            }
            catch (e) { }
        }
        this.edgesShown = false;
    };
    /** @internal */
    Layout.prototype.maximize = function (tabsetNode) {
        this.doAction(Actions_1.Actions.maximizeToggle(tabsetNode.getId()));
    };
    /** @internal */
    Layout.prototype.customizeTab = function (tabNode, renderValues) {
        if (this.props.onRenderTab) {
            this.props.onRenderTab(tabNode, renderValues);
        }
    };
    /** @internal */
    Layout.prototype.customizeTabSet = function (tabSetNode, renderValues) {
        if (this.props.onRenderTabSet) {
            this.props.onRenderTabSet(tabSetNode, renderValues);
        }
    };
    /** @internal */
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
    /** @internal */
    Layout.prototype.getOnRenderFloatingTabPlaceholder = function () {
        return this.props.onRenderFloatingTabPlaceholder;
    };
    /** @internal */
    Layout.prototype.getShowOverflowMenu = function () {
        return this.props.onShowOverflowMenu;
    };
    /** @internal */
    Layout.prototype.getTabSetPlaceHolderCallback = function () {
        return this.props.onTabSetPlaceHolder;
    };
    /** @internal */
    Layout.prototype.showContextMenu = function (node, event) {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(node, event);
        }
    };
    /** @internal */
    Layout.prototype.auxMouseClick = function (node, event) {
        if (this.props.onAuxMouseClick) {
            this.props.onAuxMouseClick(node, event);
        }
    };
    return Layout;
}(React.Component));
exports.Layout = Layout;
/** @internal */
var DragRectRenderWrapper = function (props) {
    React.useEffect(function () {
        var _a;
        (_a = props.onRendered) === null || _a === void 0 ? void 0 : _a.call(props);
    }, [props]);
    return (React.createElement(React.Fragment, null, props.children));
};
//# sourceMappingURL=Layout.js.map