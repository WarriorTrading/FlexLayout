import * as React from "react";
import { DockLocation } from "../DockLocation";
import { BorderButton } from "./BorderButton";
import { showPopup } from "../PopupMenu";
import { Actions } from "../model/Actions";
import { I18nLabel } from "../I18nLabel";
import { useTabOverflow } from "./TabOverflowHook";
import { Orientation } from "../Orientation";
import { CLASSES } from "../Types";
import { isAuxMouseEvent } from "./Utils";
/** @internal */
export const BorderTabSet = (props) => {
    const { border, layout, iconFactory, titleFactory, icons, path } = props;
    const toolbarRef = React.useRef(null);
    const overflowbuttonRef = React.useRef(null);
    const stickyButtonsRef = React.useRef(null);
    const { selfRef, position, userControlledLeft, hiddenTabs, onMouseWheel } = useTabOverflow(border, Orientation.flip(border.getOrientation()), toolbarRef, stickyButtonsRef);
    const onAuxMouseClick = (event) => {
        if (isAuxMouseEvent(event)) {
            layout.auxMouseClick(border, event);
        }
    };
    const onContextMenu = (event) => {
        layout.showContextMenu(border, event);
    };
    const onInterceptMouseDown = (event) => {
        event.stopPropagation();
    };
    const onOverflowClick = (event) => {
        const callback = layout.getShowOverflowMenu();
        if (callback !== undefined) {
            callback(border, event, hiddenTabs, onOverflowItemSelect);
        }
        else {
            const element = overflowbuttonRef.current;
            showPopup(element, hiddenTabs, onOverflowItemSelect, layout, iconFactory, titleFactory);
        }
        event.stopPropagation();
    };
    const onOverflowItemSelect = (item) => {
        layout.doAction(Actions.selectTab(item.node.getId()));
        userControlledLeft.current = false;
    };
    const onFloatTab = (event) => {
        const selectedTabNode = border.getChildren()[border.getSelected()];
        if (selectedTabNode !== undefined) {
            layout.doAction(Actions.floatTab(selectedTabNode.getId()));
        }
        event.stopPropagation();
    };
    const cm = layout.getClassName;
    let style = border.getTabHeaderRect().styleWithPosition({});
    const tabs = [];
    const layoutTab = (i) => {
        let isSelected = border.getSelected() === i;
        let child = border.getChildren()[i];
        tabs.push(React.createElement(BorderButton, { layout: layout, border: border.getLocation().getName(), node: child, path: path + "/tb" + i, key: child.getId(), selected: isSelected, iconFactory: iconFactory, titleFactory: titleFactory, icons: icons }));
        if (i < border.getChildren().length - 1) {
            tabs.push(React.createElement("div", { key: "divider" + i, className: cm(CLASSES.FLEXLAYOUT__BORDER_TAB_DIVIDER) }));
        }
    };
    for (let i = 0; i < border.getChildren().length; i++) {
        layoutTab(i);
    }
    let borderClasses = cm(CLASSES.FLEXLAYOUT__BORDER) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_ + border.getLocation().getName());
    if (border.getClassName() !== undefined) {
        borderClasses += " " + border.getClassName();
    }
    // allow customization of tabset right/bottom buttons
    let buttons = [];
    const renderState = { headerContent: undefined, buttons, stickyButtons: [], headerButtons: [] };
    layout.customizeTabSet(border, renderState);
    buttons = renderState.buttons;
    let toolbar;
    if (hiddenTabs.length > 0) {
        const overflowTitle = layout.i18nName(I18nLabel.Overflow_Menu_Tooltip);
        let overflowContent;
        if (typeof icons.more === "function") {
            overflowContent = icons.more(border, hiddenTabs);
        }
        else {
            overflowContent = (React.createElement(React.Fragment, null,
                icons.more,
                React.createElement("div", { className: cm(CLASSES.FLEXLAYOUT__TAB_BUTTON_OVERFLOW_COUNT) }, hiddenTabs.length)));
        }
        buttons.push(React.createElement("button", { key: "overflowbutton", ref: overflowbuttonRef, className: cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_OVERFLOW) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_OVERFLOW_ + border.getLocation().getName()), title: overflowTitle, onClick: onOverflowClick, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, overflowContent));
    }
    const selectedIndex = border.getSelected();
    if (selectedIndex !== -1) {
        const selectedTabNode = border.getChildren()[selectedIndex];
        if (selectedTabNode !== undefined && layout.isSupportsPopout() && selectedTabNode.isEnableFloat() && !selectedTabNode.isFloating()) {
            const floatTitle = layout.i18nName(I18nLabel.Float_Tab);
            buttons.push(React.createElement("button", { key: "float", title: floatTitle, className: cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_FLOAT), onClick: onFloatTab, onMouseDown: onInterceptMouseDown, onTouchStart: onInterceptMouseDown }, (typeof icons.popout === "function") ? icons.popout(selectedTabNode) : icons.popout));
        }
    }
    toolbar = (React.createElement("div", { key: "toolbar", ref: toolbarRef, className: cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_ + border.getLocation().getName()) }, buttons));
    style = layout.styleFont(style);
    let innerStyle = {};
    const borderHeight = border.getBorderBarSize() - 1;
    if (border.getLocation() === DockLocation.LEFT) {
        innerStyle = { right: borderHeight, height: borderHeight, top: position };
    }
    else if (border.getLocation() === DockLocation.RIGHT) {
        innerStyle = { left: borderHeight, height: borderHeight, top: position };
    }
    else {
        innerStyle = { height: borderHeight, left: position };
    }
    return (React.createElement("div", { ref: selfRef, dir: "ltr", style: style, className: borderClasses, "data-layout-path": path, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onContextMenu: onContextMenu, onWheel: onMouseWheel },
        React.createElement("div", { style: { height: borderHeight }, className: cm(CLASSES.FLEXLAYOUT__BORDER_INNER) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_INNER_ + border.getLocation().getName()) },
            React.createElement("div", { style: innerStyle, className: cm(CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER_ + border.getLocation().getName()) }, tabs)),
        toolbar));
};
//# sourceMappingURL=BorderTabSet.js.map