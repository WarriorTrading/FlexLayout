import * as React from "react";
import { I18nLabel } from "../I18nLabel";
import { Actions } from "../model/Actions";
import { Rect } from "../Rect";
import { ICloseType } from "../model/ICloseType";
import { CLASSES } from "../Types";
import { getRenderStateEx, isAuxMouseEvent } from "./Utils";
/** @internal */
export const BorderButton = (props) => {
    const { layout, node, selected, border, iconFactory, titleFactory, icons, path } = props;
    const selfRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const onMouseDown = (event) => {
        if (!isAuxMouseEvent(event) && !layout.getEditingTab()) {
            layout.dragStart(event, undefined, node, node.isEnableDrag(), onClick, onDoubleClick);
        }
    };
    const onAuxMouseClick = (event) => {
        if (isAuxMouseEvent(event)) {
            layout.auxMouseClick(node, event);
        }
    };
    const onContextMenu = (event) => {
        layout.showContextMenu(node, event);
    };
    const onClick = () => {
        layout.doAction(Actions.selectTab(node.getId()));
    };
    const onDoubleClick = (event) => {
        // if (node.isEnableRename()) {
        //     onRename();
        // }
    };
    // const onRename = () => {
    //     layout.setEditingTab(node);
    //     layout.getCurrentDocument()!.body.addEventListener("mousedown", onEndEdit);
    //     layout.getCurrentDocument()!.body.addEventListener("touchstart", onEndEdit);
    // };
    const onEndEdit = (event) => {
        if (event.target !== contentRef.current) {
            layout.getCurrentDocument().body.removeEventListener("mousedown", onEndEdit);
            layout.getCurrentDocument().body.removeEventListener("touchstart", onEndEdit);
            layout.setEditingTab(undefined);
        }
    };
    const isClosable = () => {
        const closeType = node.getCloseType();
        if (selected || closeType === ICloseType.Always) {
            return true;
        }
        if (closeType === ICloseType.Visible) {
            // not selected but x should be visible due to hover
            if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                return true;
            }
        }
        return false;
    };
    const onClose = (event) => {
        if (isClosable()) {
            layout.doAction(Actions.deleteTab(node.getId()));
        }
        else {
            onClick();
        }
    };
    const onCloseMouseDown = (event) => {
        event.stopPropagation();
    };
    React.useLayoutEffect(() => {
        updateRect();
        if (layout.getEditingTab() === node) {
            contentRef.current.select();
        }
    });
    const updateRect = () => {
        // record position of tab in node
        const layoutRect = layout.getDomRect();
        const r = selfRef.current.getBoundingClientRect();
        node._setTabRect(new Rect(r.left - layoutRect.left, r.top - layoutRect.top, r.width, r.height));
    };
    const onTextBoxMouseDown = (event) => {
        // console.log("onTextBoxMouseDown");
        event.stopPropagation();
    };
    const onTextBoxKeyPress = (event) => {
        // console.log(event, event.keyCode);
        if (event.keyCode === 27) {
            // esc
            layout.setEditingTab(undefined);
        }
        else if (event.keyCode === 13) {
            // enter
            layout.setEditingTab(undefined);
            layout.doAction(Actions.renameTab(node.getId(), event.target.value));
        }
    };
    const cm = layout.getClassName;
    let classNames = cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON) + " " + cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON_ + border);
    if (selected) {
        classNames += " " + cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON__SELECTED);
    }
    else {
        classNames += " " + cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON__UNSELECTED);
    }
    if (node.getClassName() !== undefined) {
        classNames += " " + node.getClassName();
    }
    const renderState = getRenderStateEx(layout, node, iconFactory, titleFactory);
    let content = renderState.content ? (React.createElement("div", { className: cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON_CONTENT) }, renderState.content)) : null;
    const leading = renderState.leading ? (React.createElement("div", { className: cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON_LEADING) }, renderState.leading)) : null;
    if (layout.getEditingTab() === node) {
        content = (React.createElement("input", { ref: contentRef, className: cm(CLASSES.FLEXLAYOUT__TAB_BUTTON_TEXTBOX), "data-layout-path": path + "/textbox", type: "text", autoFocus: true, defaultValue: node.getName(), onKeyDown: onTextBoxKeyPress, onMouseDown: onTextBoxMouseDown, onTouchStart: onTextBoxMouseDown }));
    }
    if (node.isEnableClose()) {
        const closeTitle = layout.i18nName(I18nLabel.Close_Tab);
        renderState.buttons.push(React.createElement("div", { key: "close", "data-layout-path": path + "/button/close", title: closeTitle, className: cm(CLASSES.FLEXLAYOUT__BORDER_BUTTON_TRAILING), onMouseDown: onCloseMouseDown, onClick: onClose, onTouchStart: onCloseMouseDown }, (typeof icons.close === "function") ? icons.close(node) : icons.close));
    }
    return (React.createElement("div", { ref: selfRef, "data-layout-path": path, className: classNames, onMouseDown: onMouseDown, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onContextMenu: onContextMenu, onTouchStart: onMouseDown, title: node.getHelpText() },
        leading,
        content,
        renderState.buttons));
};
//# sourceMappingURL=BorderButton.js.map