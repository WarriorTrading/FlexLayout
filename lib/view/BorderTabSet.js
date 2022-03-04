"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderTabSet = void 0;
var React = require("react");
var DockLocation_1 = require("../DockLocation");
var BorderButton_1 = require("./BorderButton");
var PopupMenu_1 = require("../PopupMenu");
var Actions_1 = require("../model/Actions");
var I18nLabel_1 = require("../I18nLabel");
var TabOverflowHook_1 = require("./TabOverflowHook");
var Orientation_1 = require("../Orientation");
var Types_1 = require("../Types");
var Utils_1 = require("./Utils");
/** @internal */
var BorderTabSet = function (props) {
    var border = props.border, layout = props.layout, iconFactory = props.iconFactory, titleFactory = props.titleFactory, icons = props.icons, path = props.path;
    var toolbarRef = React.useRef(null);
    var overflowbuttonRef = React.useRef(null);
    var stickyButtonsRef = React.useRef(null);
    var _a = (0, TabOverflowHook_1.useTabOverflow)(border, Orientation_1.Orientation.flip(border.getOrientation()), toolbarRef, stickyButtonsRef), selfRef = _a.selfRef, position = _a.position, userControlledLeft = _a.userControlledLeft, hiddenTabs = _a.hiddenTabs, onMouseWheel = _a.onMouseWheel;
    var onAuxMouseClick = function (event) {
        if ((0, Utils_1.isAuxMouseEvent)(event)) {
            layout.auxMouseClick(border, event);
        }
    };
    var onContextMenu = function (event) {
        layout.showContextMenu(border, event);
    };
    var onInterceptMouseDown = function (event) {
        event.stopPropagation();
    };
    var onOverflowClick = function (event) {
        var callback = layout.getShowOverflowMenu();
        if (callback !== undefined) {
            callback(border, event, hiddenTabs, onOverflowItemSelect);
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
    var onFloatTab = function (event) {
        var selectedTabNode = border.getChildren()[border.getSelected()];
        if (selectedTabNode !== undefined) {
            layout.doAction(Actions_1.Actions.floatTab(selectedTabNode.getId()));
        }
        event.stopPropagation();
    };
    var cm = layout.getClassName;
    var style = border.getTabHeaderRect().styleWithPosition({});
    var tabs = [];
    var layoutTab = function (i) {
        var isSelected = border.getSelected() === i;
        var child = border.getChildren()[i];
        tabs.push(React.createElement(BorderButton_1.BorderButton, { layout: layout, border: border.getLocation().getName(), node: child, path: path + "/tb" + i, key: child.getId(), selected: isSelected, iconFactory: iconFactory, titleFactory: titleFactory, icons: icons }));
        tabs.push(React.createElement("div", { key: "divider" + i, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TAB_DIVIDER) }));
    };
    for (var i = 0; i < border.getChildren().length; i++) {
        layoutTab(i);
    }
    var borderClasses = cm(Types_1.CLASSES.FLEXLAYOUT__BORDER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_ + border.getLocation().getName());
    if (border.getClassName() !== undefined) {
        borderClasses += " " + border.getClassName();
    }
    // allow customization of tabset right/bottom buttons
    var buttons = [];
    var renderState = { headerContent: {}, buttons: buttons, stickyButtons: [], headerButtons: [] };
    layout.customizeTabSet(border, renderState);
    buttons = renderState.buttons;
    var toolbar;
    if (hiddenTabs.length > 0) {
        var overflowTitle = layout.i18nName(I18nLabel_1.I18nLabel.Overflow_Menu_Tooltip);
        var overflowContent = void 0;
        if (typeof icons.more === "function") {
            overflowContent = icons.more(border, hiddenTabs);
        }
        else {
            overflowContent = (React.createElement(React.Fragment, null,
                icons.more,
                React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_OVERFLOW_COUNT) }, hiddenTabs.length)));
        }
        buttons.push(React.createElement("button", { key: "overflowbutton", ref: overflowbuttonRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_OVERFLOW) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_OVERFLOW_ + border.getLocation().getName()), title: overflowTitle, onClick: onOverflowClick, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, overflowContent));
    }
    var selectedIndex = border.getSelected();
    if (selectedIndex !== -1) {
        var selectedTabNode = border.getChildren()[selectedIndex];
        if (selectedTabNode !== undefined && layout.isSupportsPopout() && selectedTabNode.isEnableFloat() && !selectedTabNode.isFloating()) {
            var floatTitle = layout.i18nName(I18nLabel_1.I18nLabel.Float_Tab);
            buttons.push(React.createElement("button", { key: "float", title: floatTitle, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_FLOAT), onClick: onFloatTab, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, (typeof icons.popout === "function") ? icons.popout(selectedTabNode) : icons.popout));
        }
    }
    toolbar = (React.createElement("div", { key: "toolbar", ref: toolbarRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_ + border.getLocation().getName()) }, buttons));
    style = layout.styleFont(style);
    var innerStyle = {};
    var borderHeight = border.getBorderBarSize() - 1;
    if (border.getLocation() === DockLocation_1.DockLocation.LEFT) {
        innerStyle = { right: borderHeight, height: borderHeight, top: position };
    }
    else if (border.getLocation() === DockLocation_1.DockLocation.RIGHT) {
        innerStyle = { left: borderHeight, height: borderHeight, top: position };
    }
    else {
        innerStyle = { height: borderHeight, left: position };
    }
    return (React.createElement("div", { ref: selfRef, dir: "ltr", style: style, className: borderClasses, "data-layout-path": path, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onContextMenu: onContextMenu, onWheel: onMouseWheel },
        React.createElement("div", { style: { height: borderHeight }, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_INNER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_INNER_ + border.getLocation().getName()) },
            React.createElement("div", { style: innerStyle, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER_ + border.getLocation().getName()) }, tabs)),
        toolbar));
};
exports.BorderTabSet = BorderTabSet;
//# sourceMappingURL=BorderTabSet.js.map