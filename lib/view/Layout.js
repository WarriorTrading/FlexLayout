import * as React from "react";
import { createPortal } from "react-dom";
import { DockLocation } from "../DockLocation";
import { DragDrop } from "../DragDrop";
import { Actions } from "../model/Actions";
import { BorderNode } from "../model/BorderNode";
import { SplitterNode } from "../model/SplitterNode";
import { TabNode } from "../model/TabNode";
import { TabSetNode } from "../model/TabSetNode";
import { Rect } from "../Rect";
import { CLASSES } from "../Types";
import { BorderTabSet } from "./BorderTabSet";
import { Splitter } from "./Splitter";
import { Tab } from "./Tab";
import { TabSet } from "./TabSet";
import { FloatingWindow } from "./FloatingWindow";
import { FloatingWindowTab } from "./FloatingWindowTab";
import { TabFloating } from "./TabFloating";
import { Orientation } from "../Orientation";
import { CloseIcon, MaximizeIcon, OverflowIcon, PopoutIcon, RestoreIcon } from "./Icons";
import { TabButtonStamp } from "./TabButtonStamp";
const defaultIcons = {
    close: React.createElement(CloseIcon, null),
    closeTabset: React.createElement(CloseIcon, null),
    popout: React.createElement(PopoutIcon, null),
    maximize: React.createElement(MaximizeIcon, null),
    restore: React.createElement(RestoreIcon, null),
    more: React.createElement(OverflowIcon, null),
};
// Popout windows work in latest browsers based on webkit (Chrome, Opera, Safari, latest Edge) and Firefox. They do
// not work on any version if IE or the original Edge browser
// Assume any recent desktop browser not IE or original Edge will work
/** @internal */
// @ts-ignore
const isIEorEdge = typeof window !== "undefined" && (window.document.documentMode || /Edge\//.test(window.navigator.userAgent));
/** @internal */
const isDesktop = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
/** @internal */
const defaultSupportsPopout = isDesktop && !isIEorEdge;
/**
 * A React component that hosts a multi-tabbed layout
 */
export class Layout extends React.Component {
    constructor(props) {
        super(props);
        /** @internal */
        this.firstMove = false;
        /** @internal */
        this.dragRectRendered = true;
        /** @internal */
        this.dragDivText = undefined;
        /** @internal */
        this.edgeRectLength = 100;
        /** @internal */
        this.edgeRectWidth = 10;
        /** @internal */
        this.onModelChange = () => {
            this.forceUpdate();
            if (this.props.onModelChange) {
                this.props.onModelChange(this.props.model);
            }
        };
        /** @internal */
        this.updateRect = (domRect = this.getDomRect()) => {
            const rect = new Rect(0, 0, domRect.width, domRect.height);
            if (!rect.equals(this.state.rect) && rect.width !== 0 && rect.height !== 0) {
                this.setState({ rect });
            }
        };
        /** @internal */
        this.updateLayoutMetrics = () => {
            if (this.findHeaderBarSizeRef.current) {
                const headerBarSize = this.findHeaderBarSizeRef.current.getBoundingClientRect().height;
                if (headerBarSize !== this.state.calculatedHeaderBarSize) {
                    this.setState({ calculatedHeaderBarSize: headerBarSize });
                }
            }
            if (this.findTabBarSizeRef.current) {
                const tabBarSize = this.findTabBarSizeRef.current.getBoundingClientRect().height;
                if (tabBarSize !== this.state.calculatedTabBarSize) {
                    this.setState({ calculatedTabBarSize: tabBarSize });
                }
            }
            if (this.findBorderBarSizeRef.current) {
                const borderBarSize = this.findBorderBarSizeRef.current.getBoundingClientRect().height;
                if (borderBarSize !== this.state.calculatedBorderBarSize) {
                    this.setState({ calculatedBorderBarSize: borderBarSize });
                }
            }
        };
        /** @internal */
        this.getClassName = (defaultClassName) => {
            if (this.props.classNameMapper === undefined) {
                return defaultClassName;
            }
            else {
                return this.props.classNameMapper(defaultClassName);
            }
        };
        /** @internal */
        this.onCloseWindow = (id) => {
            this.doAction(Actions.unFloatTab(id));
            try {
                this.props.model.getNodeById(id)._setWindow(undefined);
            }
            catch (e) {
                // catch incase it was a model change
            }
        };
        /** @internal */
        this.onSetWindow = (id, window) => {
            this.props.model.getNodeById(id)._setWindow(window);
        };
        /** @internal */
        this.onCancelAdd = () => {
            var _a, _b;
            const rootdiv = this.selfRef.current;
            rootdiv.removeChild(this.dragDiv);
            this.dragDiv = undefined;
            this.hidePortal();
            if (this.fnNewNodeDropped != null) {
                this.fnNewNodeDropped();
                this.fnNewNodeDropped = undefined;
            }
            try {
                (_b = (_a = this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            catch (e) {
                console.error(e);
            }
            DragDrop.instance.hideGlass();
            this.newTabJson = undefined;
            this.customDrop = undefined;
        };
        /** @internal */
        this.onCancelDrag = (wasDragging) => {
            var _a, _b;
            if (wasDragging) {
                const rootdiv = this.selfRef.current;
                try {
                    rootdiv.removeChild(this.outlineDiv);
                }
                catch (e) { }
                try {
                    rootdiv.removeChild(this.dragDiv);
                }
                catch (e) { }
                this.dragDiv = undefined;
                this.hidePortal();
                this.setState({ showEdges: false });
                if (this.fnNewNodeDropped != null) {
                    this.fnNewNodeDropped();
                    this.fnNewNodeDropped = undefined;
                }
                try {
                    (_b = (_a = this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                catch (e) {
                    console.error(e);
                }
                DragDrop.instance.hideGlass();
                this.newTabJson = undefined;
                this.customDrop = undefined;
            }
            this.setState({ showHiddenBorder: DockLocation.CENTER });
        };
        /** @internal */
        this.onDragDivMouseDown = (event) => {
            event.preventDefault();
            this.dragStart(event, this.dragDivText, TabNode._fromJson(this.newTabJson, this.props.model, false), true, undefined, undefined);
        };
        /** @internal */
        this.dragStart = (event, dragDivText, node, allowDrag, onClick, onDoubleClick) => {
            if (!allowDrag) {
                DragDrop.instance.startDrag(event, undefined, undefined, undefined, undefined, onClick, onDoubleClick, this.currentDocument, this.selfRef.current);
            }
            else {
                this.dragNode = node;
                this.dragDivText = dragDivText;
                DragDrop.instance.startDrag(event, this.onDragStart, this.onDragMove, this.onDragEnd, this.onCancelDrag, onClick, onDoubleClick, this.currentDocument, this.selfRef.current);
            }
        };
        /** @internal */
        this.dragRectRender = (text, node, json, onRendered) => {
            let content;
            if (text !== undefined) {
                content = React.createElement("div", { style: { whiteSpace: "pre" } }, text.replace("<br>", "\n"));
            }
            else {
                if (node && node instanceof TabNode) {
                    content = (React.createElement(TabButtonStamp, { node: node, layout: this, iconFactory: this.props.iconFactory, titleFactory: this.props.titleFactory }));
                }
            }
            if (this.props.onRenderDragRect !== undefined) {
                const customContent = this.props.onRenderDragRect(content, node, json);
                if (customContent !== undefined) {
                    content = customContent;
                }
            }
            // hide div until the render is complete
            this.dragDiv.style.visibility = "hidden";
            this.dragRectRendered = false;
            this.showPortal(React.createElement(DragRectRenderWrapper
            // wait for it to be rendered
            , { 
                // wait for it to be rendered
                onRendered: () => {
                    this.dragRectRendered = true;
                    onRendered === null || onRendered === void 0 ? void 0 : onRendered();
                } }, content), this.dragDiv);
        };
        /** @internal */
        this.showPortal = (control, element) => {
            const portal = createPortal(control, element);
            this.setState({ portal });
        };
        /** @internal */
        this.hidePortal = () => {
            this.setState({ portal: undefined });
        };
        /** @internal */
        this.onDragStart = () => {
            this.dropInfo = undefined;
            this.customDrop = undefined;
            const rootdiv = this.selfRef.current;
            this.outlineDiv = this.currentDocument.createElement("div");
            this.outlineDiv.className = this.getClassName(CLASSES.FLEXLAYOUT__OUTLINE_RECT);
            this.outlineDiv.style.visibility = "hidden";
            rootdiv.appendChild(this.outlineDiv);
            if (this.dragDiv == null) {
                this.dragDiv = this.currentDocument.createElement("div");
                this.dragDiv.className = this.getClassName(CLASSES.FLEXLAYOUT__DRAG_RECT);
                this.dragDiv.setAttribute("data-layout-path", "/drag-rectangle");
                this.dragRectRender(this.dragDivText, this.dragNode, this.newTabJson);
                rootdiv.appendChild(this.dragDiv);
            }
            // add edge indicators
            if (this.props.model.getMaximizedTabset() === undefined) {
                this.setState({ showEdges: true });
            }
            if (this.dragNode !== undefined && this.dragNode instanceof TabNode && this.dragNode.getTabRect() !== undefined) {
                this.dragNode.getTabRect().positionElement(this.outlineDiv);
            }
            this.firstMove = true;
            return true;
        };
        /** @internal */
        this.onDragMove = (event) => {
            if (this.firstMove === false) {
                const speed = this.props.model._getAttribute("tabDragSpeed");
                this.outlineDiv.style.transition = `top ${speed}s, left ${speed}s, width ${speed}s, height ${speed}s`;
            }
            this.firstMove = false;
            const clientRect = this.selfRef.current.getBoundingClientRect();
            const pos = {
                x: event.clientX - clientRect.left,
                y: event.clientY - clientRect.top,
            };
            this.checkForBorderToShow(pos.x, pos.y);
            // keep it between left & right
            const dragRect = this.dragDiv.getBoundingClientRect();
            let newLeft = pos.x - dragRect.width / 2;
            if (newLeft + dragRect.width > clientRect.width) {
                newLeft = clientRect.width - dragRect.width;
            }
            newLeft = Math.max(0, newLeft);
            this.dragDiv.style.left = newLeft + "px";
            this.dragDiv.style.top = pos.y + 5 + "px";
            if (this.dragRectRendered && this.dragDiv.style.visibility === "hidden") {
                // make visible once the drag rect has been rendered
                this.dragDiv.style.visibility = "visible";
            }
            let dropInfo = this.props.model._findDropTargetNode(this.dragNode, pos.x, pos.y);
            if (dropInfo) {
                if (this.props.onTabDrag) {
                    this.handleCustomTabDrag(dropInfo, pos, event);
                }
                else {
                    this.dropInfo = dropInfo;
                    this.outlineDiv.className = this.getClassName(dropInfo.className);
                    dropInfo.rect.positionElement(this.outlineDiv);
                    this.outlineDiv.style.visibility = "visible";
                }
            }
        };
        /** @internal */
        this.onDragEnd = (event) => {
            const rootdiv = this.selfRef.current;
            rootdiv.removeChild(this.outlineDiv);
            rootdiv.removeChild(this.dragDiv);
            this.dragDiv = undefined;
            this.hidePortal();
            this.setState({ showEdges: false });
            DragDrop.instance.hideGlass();
            if (this.dropInfo) {
                if (this.customDrop) {
                    this.newTabJson = undefined;
                    try {
                        const { callback, dragging, over, x, y, location } = this.customDrop;
                        callback(dragging, over, x, y, location);
                        if (this.fnNewNodeDropped != null) {
                            this.fnNewNodeDropped();
                            this.fnNewNodeDropped = undefined;
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (this.newTabJson !== undefined) {
                    const newNode = this.doAction(Actions.addNode(this.newTabJson, this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));
                    if (this.fnNewNodeDropped != null) {
                        this.fnNewNodeDropped(newNode, event);
                        this.fnNewNodeDropped = undefined;
                    }
                    this.newTabJson = undefined;
                }
                else if (this.dragNode !== undefined) {
                    this.doAction(Actions.moveNode(this.dragNode.getId(), this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));
                }
            }
            this.setState({ showHiddenBorder: DockLocation.CENTER });
        };
        this.props.model._setChangeListener(this.onModelChange);
        this.tabIds = [];
        this.selfRef = React.createRef();
        this.findHeaderBarSizeRef = React.createRef();
        this.findTabBarSizeRef = React.createRef();
        this.findBorderBarSizeRef = React.createRef();
        this.supportsPopout = props.supportsPopout !== undefined ? props.supportsPopout : defaultSupportsPopout;
        this.popoutURL = props.popoutURL ? props.popoutURL : "popout.html";
        this.icons = Object.assign(Object.assign({}, defaultIcons), props.icons);
        this.state = {
            rect: new Rect(0, 0, 0, 0),
            calculatedHeaderBarSize: 25,
            calculatedTabBarSize: 26,
            calculatedBorderBarSize: 30,
            editingTab: undefined,
            showHiddenBorder: DockLocation.CENTER,
            showEdges: false,
        };
        this.onDragEnter = this.onDragEnter.bind(this);
    }
    /** @internal */
    styleFont(style) {
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
    }
    /** @internal */
    doAction(action) {
        if (this.props.onAction !== undefined) {
            const outcome = this.props.onAction(action);
            if (outcome !== undefined) {
                return this.props.model.doAction(outcome);
            }
            return undefined;
        }
        else {
            return this.props.model.doAction(action);
        }
    }
    /** @internal */
    componentDidMount() {
        this.updateRect();
        this.updateLayoutMetrics();
        // need to re-render if size changes
        this.currentDocument = this.selfRef.current.ownerDocument;
        this.currentWindow = this.currentDocument.defaultView;
        this.resizeObserver = new ResizeObserver(entries => {
            this.updateRect(entries[0].contentRect);
        });
        this.resizeObserver.observe(this.selfRef.current);
    }
    /** @internal */
    componentDidUpdate() {
        this.updateLayoutMetrics();
        if (this.props.model !== this.previousModel) {
            if (this.previousModel !== undefined) {
                this.previousModel._setChangeListener(undefined); // stop listening to old model
            }
            this.props.model._setChangeListener(this.onModelChange);
            this.previousModel = this.props.model;
        }
        // console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
    }
    /** @internal */
    getCurrentDocument() {
        return this.currentDocument;
    }
    /** @internal */
    getDomRect() {
        return this.selfRef.current.getBoundingClientRect();
    }
    /** @internal */
    getRootDiv() {
        return this.selfRef.current;
    }
    /** @internal */
    isSupportsPopout() {
        return this.supportsPopout;
    }
    /** @internal */
    isRealtimeResize() {
        var _a;
        return (_a = this.props.realtimeResize) !== null && _a !== void 0 ? _a : false;
    }
    /** @internal */
    onTabDrag(...args) {
        var _a, _b;
        return (_b = (_a = this.props).onTabDrag) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
    }
    /** @internal */
    getPopoutURL() {
        return this.popoutURL;
    }
    /** @internal */
    componentWillUnmount() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.selfRef.current);
    }
    /** @internal */
    setEditingTab(tabNode) {
        this.setState({ editingTab: tabNode });
    }
    /** @internal */
    getEditingTab() {
        return this.state.editingTab;
    }
    /** @internal */
    render() {
        // first render will be used to find the size (via selfRef)
        if (!this.selfRef.current) {
            return (React.createElement("div", { ref: this.selfRef, className: this.getClassName(CLASSES.FLEXLAYOUT__LAYOUT) }, this.metricsElements()));
        }
        this.props.model._setPointerFine(window && window.matchMedia && window.matchMedia("(pointer: fine)").matches);
        // this.start = Date.now();
        const borderComponents = [];
        const tabSetComponents = [];
        const floatingWindows = [];
        const tabComponents = {};
        const splitterComponents = [];
        const metrics = {
            headerBarSize: this.state.calculatedHeaderBarSize,
            tabBarSize: this.state.calculatedTabBarSize,
            borderBarSize: this.state.calculatedBorderBarSize
        };
        this.props.model._setShowHiddenBorder(this.state.showHiddenBorder);
        this.centerRect = this.props.model._layout(this.state.rect, metrics);
        this.renderBorder(this.props.model.getBorderSet(), borderComponents, tabComponents, floatingWindows, splitterComponents);
        this.renderChildren("", this.props.model.getRoot(), tabSetComponents, tabComponents, floatingWindows, splitterComponents);
        const nextTopIds = [];
        const nextTopIdsMap = {};
        // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
        for (const t of this.tabIds) {
            if (tabComponents[t]) {
                nextTopIds.push(t);
                nextTopIdsMap[t] = t;
            }
        }
        this.tabIds = nextTopIds;
        // Add tabs that have been added to the DOM
        for (const t of Object.keys(tabComponents)) {
            if (!nextTopIdsMap[t]) {
                this.tabIds.push(t);
            }
        }
        const edges = [];
        if (this.state.showEdges) {
            const r = this.centerRect;
            const length = this.edgeRectLength;
            const width = this.edgeRectWidth;
            const offset = this.edgeRectLength / 2;
            const className = this.getClassName(CLASSES.FLEXLAYOUT__EDGE_RECT);
            const radius = 50;
            edges.push(React.createElement("div", { key: "North", style: { top: r.y, left: r.x + r.width / 2 - offset, width: length, height: width, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }, className: className }));
            edges.push(React.createElement("div", { key: "West", style: { top: r.y + r.height / 2 - offset, left: r.x, width: width, height: length, borderTopRightRadius: radius, borderBottomRightRadius: radius }, className: className }));
            edges.push(React.createElement("div", { key: "South", style: { top: r.y + r.height - width, left: r.x + r.width / 2 - offset, width: length, height: width, borderTopLeftRadius: radius, borderTopRightRadius: radius }, className: className }));
            edges.push(React.createElement("div", { key: "East", style: { top: r.y + r.height / 2 - offset, left: r.x + r.width - width, width: width, height: length, borderTopLeftRadius: radius, borderBottomLeftRadius: radius }, className: className }));
        }
        // this.layoutTime = (Date.now() - this.start);
        return (React.createElement("div", { ref: this.selfRef, className: this.getClassName(CLASSES.FLEXLAYOUT__LAYOUT), onDragEnter: this.props.onExternalDrag ? this.onDragEnter : undefined },
            tabSetComponents,
            this.tabIds.map((t) => {
                return tabComponents[t];
            }),
            borderComponents,
            splitterComponents,
            edges,
            floatingWindows,
            this.metricsElements(),
            this.state.portal));
    }
    /** @internal */
    metricsElements() {
        // used to measure the tab and border tab sizes
        const fontStyle = this.styleFont({ visibility: "hidden" });
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { key: "findHeaderBarSize", ref: this.findHeaderBarSizeRef, style: fontStyle, className: this.getClassName(CLASSES.FLEXLAYOUT__TABSET_HEADER_SIZER) }, "FindHeaderBarSize"),
            React.createElement("div", { key: "findTabBarSize", ref: this.findTabBarSizeRef, style: fontStyle, className: this.getClassName(CLASSES.FLEXLAYOUT__TABSET_SIZER) }, "FindTabBarSize"),
            React.createElement("div", { key: "findBorderBarSize", ref: this.findBorderBarSizeRef, style: fontStyle, className: this.getClassName(CLASSES.FLEXLAYOUT__BORDER_SIZER) }, "FindBorderBarSize")));
    }
    /** @internal */
    renderBorder(borderSet, borderComponents, tabComponents, floatingWindows, splitterComponents) {
        for (const border of borderSet.getBorders()) {
            const borderPath = `/border/${border.getLocation().getName()}`;
            if (border.isShowing()) {
                borderComponents.push(React.createElement(BorderTabSet, { key: `border_${border.getLocation().getName()}`, path: borderPath, border: border, layout: this, iconFactory: this.props.iconFactory, titleFactory: this.props.titleFactory, icons: this.icons }));
                const drawChildren = border._getDrawChildren();
                let i = 0;
                let tabCount = 0;
                for (const child of drawChildren) {
                    if (child instanceof SplitterNode) {
                        let path = borderPath + "/s";
                        splitterComponents.push(React.createElement(Splitter, { key: child.getId(), layout: this, node: child, path: path }));
                    }
                    else if (child instanceof TabNode) {
                        let path = borderPath + "/t" + tabCount++;
                        if (this.supportsPopout && child.isFloating()) {
                            const rect = this._getScreenRect(child);
                            floatingWindows.push(React.createElement(FloatingWindow, { key: child.getId(), url: this.popoutURL, rect: rect, title: child.getName(), id: child.getId(), onSetWindow: this.onSetWindow, onCloseWindow: this.onCloseWindow },
                                React.createElement(FloatingWindowTab, { layout: this, node: child, factory: this.props.factory })));
                            tabComponents[child.getId()] = React.createElement(TabFloating, { key: child.getId(), layout: this, path: path, node: child, selected: i === border.getSelected() });
                        }
                        else {
                            tabComponents[child.getId()] = React.createElement(Tab, { key: child.getId(), layout: this, path: path, node: child, selected: i === border.getSelected(), factory: this.props.factory });
                        }
                    }
                    i++;
                }
            }
        }
    }
    /** @internal */
    renderChildren(path, node, tabSetComponents, tabComponents, floatingWindows, splitterComponents) {
        const drawChildren = node._getDrawChildren();
        let splitterCount = 0;
        let tabCount = 0;
        let rowCount = 0;
        for (const child of drawChildren) {
            if (child instanceof SplitterNode) {
                const newPath = path + "/s" + (splitterCount++);
                splitterComponents.push(React.createElement(Splitter, { key: child.getId(), layout: this, path: newPath, node: child }));
            }
            else if (child instanceof TabSetNode) {
                const newPath = path + "/ts" + (rowCount++);
                tabSetComponents.push(React.createElement(TabSet, { key: child.getId(), layout: this, path: newPath, node: child, iconFactory: this.props.iconFactory, titleFactory: this.props.titleFactory, icons: this.icons }));
                this.renderChildren(newPath, child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
            }
            else if (child instanceof TabNode) {
                const newPath = path + "/t" + (tabCount++);
                const selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
                if (selectedTab === undefined) {
                    // this should not happen!
                    console.warn("undefined selectedTab should not happen");
                }
                if (this.supportsPopout && child.isFloating()) {
                    const rect = this._getScreenRect(child);
                    floatingWindows.push(React.createElement(FloatingWindow, { key: child.getId(), url: this.popoutURL, rect: rect, title: child.getName(), id: child.getId(), onSetWindow: this.onSetWindow, onCloseWindow: this.onCloseWindow },
                        React.createElement(FloatingWindowTab, { layout: this, node: child, factory: this.props.factory })));
                    tabComponents[child.getId()] = React.createElement(TabFloating, { key: child.getId(), layout: this, path: newPath, node: child, selected: child === selectedTab });
                }
                else {
                    tabComponents[child.getId()] = React.createElement(Tab, { key: child.getId(), layout: this, path: newPath, node: child, selected: child === selectedTab, factory: this.props.factory });
                }
            }
            else {
                // is row
                const newPath = path + ((child.getOrientation() === Orientation.HORZ) ? "/r" : "/c") + (rowCount++);
                this.renderChildren(newPath, child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
            }
        }
    }
    /** @internal */
    _getScreenRect(node) {
        const rect = node.getRect().clone();
        const bodyRect = this.selfRef.current.getBoundingClientRect();
        const navHeight = Math.min(80, this.currentWindow.outerHeight - this.currentWindow.innerHeight);
        const navWidth = Math.min(80, this.currentWindow.outerWidth - this.currentWindow.innerWidth);
        rect.x = rect.x + bodyRect.x + this.currentWindow.screenX + navWidth;
        rect.y = rect.y + bodyRect.y + this.currentWindow.screenY + navHeight;
        return rect;
    }
    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
     */
    addTabToTabSet(tabsetId, json) {
        const tabsetNode = this.props.model.getNodeById(tabsetId);
        if (tabsetNode !== undefined) {
            this.doAction(Actions.addNode(json, tabsetId, DockLocation.CENTER, -1));
        }
    }
    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
    addTabToActiveTabSet(json) {
        const tabsetNode = this.props.model.getActiveTabset();
        if (tabsetNode !== undefined) {
            this.doAction(Actions.addNode(json, tabsetNode.getId(), DockLocation.CENTER, -1));
        }
    }
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    addTabWithDragAndDrop(dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        this.dragStart(undefined, dragText, TabNode._fromJson(json, this.props.model, false), true, undefined, undefined);
    }
    /**
     * Move a tab/tabset using drag and drop
     * @param node the tab or tabset to drag
     * @param dragText the text to show on the drag panel
     */
    moveTabWithDragAndDrop(node, dragText) {
        this.dragStart(undefined, dragText, node, true, undefined, undefined);
    }
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete (node and event will be undefined if the drag was cancelled)
     */
    addTabWithDragAndDropIndirect(dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        DragDrop.instance.addGlass(this.onCancelAdd);
        this.dragDivText = dragText;
        this.dragDiv = this.currentDocument.createElement("div");
        this.dragDiv.className = this.getClassName(CLASSES.FLEXLAYOUT__DRAG_RECT);
        this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown);
        this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown, { passive: false });
        this.dragRectRender(this.dragDivText, undefined, this.newTabJson, () => {
            if (this.dragDiv) {
                // now it's been rendered into the dom it can be centered
                this.dragDiv.style.visibility = "visible";
                const domRect = this.dragDiv.getBoundingClientRect();
                const r = new Rect(0, 0, domRect === null || domRect === void 0 ? void 0 : domRect.width, domRect === null || domRect === void 0 ? void 0 : domRect.height);
                r.centerInRect(this.state.rect);
                this.dragDiv.setAttribute("data-layout-path", "/drag-rectangle");
                this.dragDiv.style.left = r.x + "px";
                this.dragDiv.style.top = r.y + "px";
            }
        });
        const rootdiv = this.selfRef.current;
        rootdiv.appendChild(this.dragDiv);
    }
    /** @internal */
    handleCustomTabDrag(dropInfo, pos, event) {
        var _a, _b, _c;
        let invalidated = (_a = this.customDrop) === null || _a === void 0 ? void 0 : _a.invalidated;
        const currentCallback = (_b = this.customDrop) === null || _b === void 0 ? void 0 : _b.callback;
        this.customDrop = undefined;
        const dragging = this.newTabJson || (this.dragNode instanceof TabNode ? this.dragNode : undefined);
        if (dragging && (dropInfo.node instanceof TabSetNode || dropInfo.node instanceof BorderNode) && dropInfo.index === -1) {
            const selected = dropInfo.node.getSelectedNode();
            const tabRect = selected === null || selected === void 0 ? void 0 : selected.getRect();
            if (selected && (tabRect === null || tabRect === void 0 ? void 0 : tabRect.contains(pos.x, pos.y))) {
                let customDrop = undefined;
                try {
                    const dest = this.onTabDrag(dragging, selected, pos.x - tabRect.x, pos.y - tabRect.y, dropInfo.location, () => this.onDragMove(event));
                    if (dest) {
                        customDrop = {
                            rect: new Rect(dest.x + tabRect.x, dest.y + tabRect.y, dest.width, dest.height),
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
        this.outlineDiv.className = this.getClassName(this.customDrop ? CLASSES.FLEXLAYOUT__OUTLINE_RECT : dropInfo.className);
        if (this.customDrop) {
            this.customDrop.rect.positionElement(this.outlineDiv);
        }
        else {
            dropInfo.rect.positionElement(this.outlineDiv);
        }
        DragDrop.instance.setGlassCursorOverride((_c = this.customDrop) === null || _c === void 0 ? void 0 : _c.cursor);
        this.outlineDiv.style.visibility = "visible";
        try {
            invalidated === null || invalidated === void 0 ? void 0 : invalidated();
        }
        catch (e) {
            console.error(e);
        }
    }
    /** @internal */
    onDragEnter(event) {
        // DragDrop keeps track of number of dragenters minus the number of
        // dragleaves. Only start a new drag if there isn't one already.
        if (DragDrop.instance.isDragging())
            return;
        const drag = this.props.onExternalDrag(event);
        if (drag) {
            // Mimic addTabWithDragAndDrop, but pass in DragEvent
            this.fnNewNodeDropped = drag.onDrop;
            this.newTabJson = drag.json;
            this.dragStart(event, drag.dragText, TabNode._fromJson(drag.json, this.props.model, false), true, undefined, undefined);
        }
    }
    /** @internal */
    checkForBorderToShow(x, y) {
        const r = this.props.model._getOuterInnerRects().outer;
        const c = r.getCenter();
        const margin = this.edgeRectWidth;
        const offset = this.edgeRectLength / 2;
        let overEdge = false;
        if (this.props.model.isEnableEdgeDock() && this.state.showHiddenBorder === DockLocation.CENTER) {
            if ((y > c.y - offset && y < c.y + offset) ||
                (x > c.x - offset && x < c.x + offset)) {
                overEdge = true;
            }
        }
        let location = DockLocation.CENTER;
        if (!overEdge) {
            if (x <= r.x + margin) {
                location = DockLocation.LEFT;
            }
            else if (x >= r.getRight() - margin) {
                location = DockLocation.RIGHT;
            }
            else if (y <= r.y + margin) {
                location = DockLocation.TOP;
            }
            else if (y >= r.getBottom() - margin) {
                location = DockLocation.BOTTOM;
            }
        }
        if (location !== this.state.showHiddenBorder) {
            this.setState({ showHiddenBorder: location });
        }
    }
    /** @internal */
    maximize(tabsetNode) {
        this.doAction(Actions.maximizeToggle(tabsetNode.getId()));
    }
    /** @internal */
    customizeTab(tabNode, renderValues) {
        if (this.props.onRenderTab) {
            this.props.onRenderTab(tabNode, renderValues);
        }
    }
    /** @internal */
    customizeTabSet(tabSetNode, renderValues) {
        if (this.props.onRenderTabSet) {
            this.props.onRenderTabSet(tabSetNode, renderValues);
        }
    }
    /** @internal */
    i18nName(id, param) {
        let message;
        if (this.props.i18nMapper) {
            message = this.props.i18nMapper(id, param);
        }
        if (message === undefined) {
            message = id + (param === undefined ? "" : param);
        }
        return message;
    }
    /** @internal */
    getOnRenderFloatingTabPlaceholder() {
        return this.props.onRenderFloatingTabPlaceholder;
    }
    /** @internal */
    getShowOverflowMenu() {
        return this.props.onShowOverflowMenu;
    }
    /** @internal */
    getTabSetPlaceHolderCallback() {
        return this.props.onTabSetPlaceHolder;
    }
    /** @internal */
    showContextMenu(node, event) {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(node, event);
        }
    }
    /** @internal */
    auxMouseClick(node, event) {
        if (this.props.onAuxMouseClick) {
            this.props.onAuxMouseClick(node, event);
        }
    }
}
/** @internal */
const DragRectRenderWrapper = (props) => {
    React.useEffect(() => {
        var _a;
        (_a = props.onRendered) === null || _a === void 0 ? void 0 : _a.call(props);
    }, [props]);
    return (React.createElement(React.Fragment, null, props.children));
};
//# sourceMappingURL=Layout.js.map