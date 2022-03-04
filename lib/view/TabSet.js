"use strict";
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
exports.TabSet = void 0;
var React = require("react");
var I18nLabel_1 = require("../I18nLabel");
var Actions_1 = require("../model/Actions");
var PopupMenu_1 = require("../PopupMenu");
var TabButton_1 = require("./TabButton");
var TabOverflowHook_1 = require("./TabOverflowHook");
var Orientation_1 = require("../Orientation");
var Types_1 = require("../Types");
var Utils_1 = require("./Utils");
/** @internal */
var TabSet = function (props) {
    var node = props.node, layout = props.layout, iconFactory = props.iconFactory, titleFactory = props.titleFactory, icons = props.icons, path = props.path;
    var toolbarRef = React.useRef(null);
    var overflowbuttonRef = React.useRef(null);
    var tabbarInnerRef = React.useRef(null);
    var stickyButtonsRef = React.useRef(null);
    var _a = (0, TabOverflowHook_1.useTabOverflow)(node, Orientation_1.Orientation.HORZ, toolbarRef, stickyButtonsRef), selfRef = _a.selfRef, position = _a.position, userControlledLeft = _a.userControlledLeft, hiddenTabs = _a.hiddenTabs, onMouseWheel = _a.onMouseWheel, tabsTruncated = _a.tabsTruncated;
    var onOverflowClick = function (event) {
        var callback = layout.getShowOverflowMenu();
        if (callback !== undefined) {
            callback(node, event, hiddenTabs, onOverflowItemSelect);
        }
        else {
            var element = overflowbuttonRef.current;
            (0, PopupMenu_1.showPopup)(element, hiddenTabs, onOverflowItemSelect, layout, iconFactory, titleFactory);
        }
        event.stopPropagation();
    };
    var onOverflowItemSelect = function (item) {
        layout.doAction(Actions_1.Actions.selectTab(item.node.getId()));
        userControlledLeft.current = false;
    };
    var onMouseDown = function (event) {
        if (!(0, Utils_1.isAuxMouseEvent)(event)) {
            var name_1 = node.getName();
            if (name_1 === undefined) {
                name_1 = "";
            }
            else {
                name_1 = ": " + name_1;
            }
            layout.doAction(Actions_1.Actions.setActiveTabset(node.getId()));
            if (!layout.getEditingTab()) {
                var message = layout.i18nName(I18nLabel_1.I18nLabel.Move_Tabset, name_1);
                layout.dragStart(event, message, node, node.isEnableDrag(), function (event2) { return undefined; }, onDoubleClick);
            }
        }
    };
    var onAuxMouseClick = function (event) {
        if ((0, Utils_1.isAuxMouseEvent)(event)) {
            layout.auxMouseClick(node, event);
        }
    };
    var onContextMenu = function (event) {
        layout.showContextMenu(node, event);
    };
    var onInterceptMouseDown = function (event) {
        event.stopPropagation();
    };
    var onMaximizeToggle = function (event) {
        if (node.canMaximize()) {
            layout.maximize(node);
        }
        event.stopPropagation();
    };
    var onClose = function (event) {
        layout.doAction(Actions_1.Actions.deleteTabset(node.getId()));
        event.stopPropagation();
    };
    var onFloatTab = function (event) {
        if (selectedTabNode !== undefined) {
            layout.doAction(Actions_1.Actions.floatTab(selectedTabNode.getId()));
        }
        event.stopPropagation();
    };
    var onDoubleClick = function (event) {
        if (node.canMaximize()) {
            layout.maximize(node);
        }
    };
    // Start Render
    var cm = layout.getClassName;
    // tabbar inner can get shifted left via tab rename, this resets scrollleft to 0
    if (tabbarInnerRef.current !== null && tabbarInnerRef.current.scrollLeft !== 0) {
        tabbarInnerRef.current.scrollLeft = 0;
    }
    var selectedTabNode = node.getSelectedNode();
    var style = node._styleWithPosition();
    if (node.getModel().getMaximizedTabset() !== undefined && !node.isMaximized()) {
        (0, Utils_1.hideElement)(style, node.getModel().isUseVisibility());
    }
    var tabs = [];
    if (node.isEnableTabStrip()) {
        for (var i = 0; i < node.getChildren().length; i++) {
            var child = node.getChildren()[i];
            var isSelected = node.getSelected() === i;
            tabs.push(React.createElement(TabButton_1.TabButton, { layout: layout, node: child, path: path + "/tb" + i, key: child.getId(), selected: isSelected, iconFactory: iconFactory, titleFactory: titleFactory, icons: icons }));
            tabs.push(React.createElement("div", { key: "divider" + i, className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TAB_DIVIDER) }));
        }
    }
    var showHeader = node.getName() !== undefined;
    var stickyButtons = [];
    var buttons = [];
    var headerButtons = [];
    // allow customization of header contents and buttons
    var renderState = { headerContent: node.getName(), stickyButtons: stickyButtons, buttons: buttons, headerButtons: headerButtons };
    layout.customizeTabSet(node, renderState);
    var headerContent = renderState.headerContent;
    stickyButtons = renderState.stickyButtons;
    buttons = renderState.buttons;
    headerButtons = renderState.headerButtons;
    if (stickyButtons.length > 0) {
        if (tabsTruncated) {
            buttons = __spreadArray(__spreadArray([], stickyButtons, true), buttons, true);
        }
        else {
            tabs.push(React.createElement("div", { ref: stickyButtonsRef, key: "sticky_buttons_container", onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown, onDragStart: function (e) { e.preventDefault(); }, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_STICKY_BUTTONS_CONTAINER) }, stickyButtons));
        }
    }
    var toolbar;
    if (hiddenTabs.length > 0) {
        var overflowTitle = layout.i18nName(I18nLabel_1.I18nLabel.Overflow_Menu_Tooltip);
        var overflowContent = void 0;
        if (typeof icons.more === "function") {
            overflowContent = icons.more(node, hiddenTabs);
        }
        else {
            overflowContent = (React.createElement(React.Fragment, null,
                icons.more,
                React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_OVERFLOW_COUNT) }, hiddenTabs.length)));
        }
        buttons.push(React.createElement("button", { key: "overflowbutton", "data-layout-path": path + "/button/overflow", ref: overflowbuttonRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_OVERFLOW), title: overflowTitle, onClick: onOverflowClick, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, overflowContent));
    }
    if (selectedTabNode !== undefined && layout.isSupportsPopout() && selectedTabNode.isEnableFloat() && !selectedTabNode.isFloating()) {
        var floatTitle = layout.i18nName(I18nLabel_1.I18nLabel.Float_Tab);
        buttons.push(React.createElement("button", { key: "float", "data-layout-path": path + "/button/float", title: floatTitle, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON_FLOAT), onClick: onFloatTab, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, (typeof icons.popout === "function") ? icons.popout(selectedTabNode) : icons.popout));
    }
    if (node.canMaximize()) {
        var minTitle = layout.i18nName(I18nLabel_1.I18nLabel.Restore);
        var maxTitle = layout.i18nName(I18nLabel_1.I18nLabel.Maximize);
        var btns = showHeader ? headerButtons : buttons;
        btns.push(React.createElement("button", { key: "max", "data-layout-path": path + "/button/max", title: node.isMaximized() ? minTitle : maxTitle, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON_ + (node.isMaximized() ? "max" : "min")), onClick: onMaximizeToggle, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, node.isMaximized() ?
            (typeof icons.restore === "function") ? icons.restore(node) : icons.restore :
            (typeof icons.maximize === "function") ? icons.maximize(node) : icons.maximize));
    }
    if (!node.isMaximized() && node.isEnableClose()) {
        var title = layout.i18nName(I18nLabel_1.I18nLabel.Close_Tabset);
        var btns = showHeader ? headerButtons : buttons;
        btns.push(React.createElement("button", { key: "close", "data-layout-path": path + "/button/close", title: title, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON_CLOSE), onClick: onClose, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, (typeof icons.closeTabset === "function") ? icons.closeTabset(node) : icons.closeTabset));
    }
    toolbar = (React.createElement("div", { key: "toolbar", ref: toolbarRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR), onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown, onDragStart: function (e) { e.preventDefault(); } }, buttons));
    var header;
    var tabStrip;
    var tabStripClasses = cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_OUTER);
    if (node.getClassNameTabStrip() !== undefined) {
        tabStripClasses += " " + node.getClassNameTabStrip();
    }
    tabStripClasses += " " + Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_OUTER_ + node.getTabLocation();
    if (node.isActive() && !showHeader) {
        tabStripClasses += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_SELECTED);
    }
    if (node.isMaximized() && !showHeader) {
        tabStripClasses += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_MAXIMIZED);
    }
    if (showHeader) {
        var headerToolbar = (React.createElement("div", { key: "toolbar", ref: toolbarRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_TOOLBAR), onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown, onDragStart: function (e) { e.preventDefault(); } }, headerButtons));
        var tabHeaderClasses = cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_HEADER);
        if (node.isActive()) {
            tabHeaderClasses += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        }
        if (node.isMaximized()) {
            tabHeaderClasses += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_MAXIMIZED);
        }
        if (node.getClassNameHeader() !== undefined) {
            tabHeaderClasses += " " + node.getClassNameHeader();
        }
        header = (React.createElement("div", { className: tabHeaderClasses, style: { height: node.getHeaderHeight() + "px" }, "data-layout-path": path + "/header", onMouseDown: onMouseDown, onContextMenu: onContextMenu, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onTouchStart: onMouseDown },
            React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_HEADER_CONTENT) }, headerContent),
            headerToolbar));
    }
    var tabStripStyle = { height: node.getTabStripHeight() + "px" };
    tabStrip = (React.createElement("div", { className: tabStripClasses, style: tabStripStyle, "data-layout-path": path + "/tabstrip", onMouseDown: onMouseDown, onContextMenu: onContextMenu, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onTouchStart: onMouseDown },
        React.createElement("div", { ref: tabbarInnerRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_ + node.getTabLocation()) },
            React.createElement("div", { style: { left: position }, className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_TAB_CONTAINER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_TAB_CONTAINER_ + node.getTabLocation()) }, tabs)),
        toolbar));
    style = layout.styleFont(style);
    var placeHolder = undefined;
    if (node.getChildren().length === 0) {
        var placeHolderCallback = layout.getTabSetPlaceHolderCallback();
        if (placeHolderCallback) {
            placeHolder = placeHolderCallback(node);
        }
    }
    var center = React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET_CONTENT) }, placeHolder);
    var content;
    if (node.getTabLocation() === "top") {
        content = React.createElement(React.Fragment, null,
            header,
            tabStrip,
            center);
    }
    else {
        content = React.createElement(React.Fragment, null,
            header,
            center,
            tabStrip);
    }
    return (React.createElement("div", { ref: selfRef, dir: "ltr", "data-layout-path": path, style: style, className: cm(Types_1.CLASSES.FLEXLAYOUT__TABSET), onWheel: onMouseWheel }, content));
};
exports.TabSet = TabSet;
//# sourceMappingURL=TabSet.js.map