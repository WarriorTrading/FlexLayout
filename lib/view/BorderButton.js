"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderButton = void 0;
var React = require("react");
var I18nLabel_1 = require("../I18nLabel");
var Actions_1 = require("../model/Actions");
var Rect_1 = require("../Rect");
var ICloseType_1 = require("../model/ICloseType");
var Types_1 = require("../Types");
var Utils_1 = require("./Utils");
/** @internal */
var BorderButton = function (props) {
    var layout = props.layout, node = props.node, selected = props.selected, border = props.border, iconFactory = props.iconFactory, titleFactory = props.titleFactory, icons = props.icons, path = props.path;
    var selfRef = React.useRef(null);
    var contentRef = React.useRef(null);
    var onMouseDown = function (event) {
        if (!(0, Utils_1.isAuxMouseEvent)(event) && !layout.getEditingTab()) {
            layout.dragStart(event, undefined, node, node.isEnableDrag(), onClick, onDoubleClick);
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
    var onClick = function () {
        layout.doAction(Actions_1.Actions.selectTab(node.getId()));
    };
    var onDoubleClick = function (event) {
        // if (node.isEnableRename()) {
        //     onRename();
        // }
    };
    // const onRename = () => {
    //     layout.setEditingTab(node);
    //     layout.getCurrentDocument()!.body.addEventListener("mousedown", onEndEdit);
    //     layout.getCurrentDocument()!.body.addEventListener("touchstart", onEndEdit);
    // };
    var onEndEdit = function (event) {
        if (event.target !== contentRef.current) {
            layout.getCurrentDocument().body.removeEventListener("mousedown", onEndEdit);
            layout.getCurrentDocument().body.removeEventListener("touchstart", onEndEdit);
            layout.setEditingTab(undefined);
        }
    };
    var isClosable = function () {
        var closeType = node.getCloseType();
        if (selected || closeType === ICloseType_1.ICloseType.Always) {
            return true;
        }
        if (closeType === ICloseType_1.ICloseType.Visible) {
            // not selected but x should be visible due to hover
            if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                return true;
            }
        }
        return false;
    };
    var onClose = function (event) {
        if (isClosable()) {
            layout.doAction(Actions_1.Actions.deleteTab(node.getId()));
        }
        else {
            onClick();
        }
    };
    var onCloseMouseDown = function (event) {
        event.stopPropagation();
    };
    React.useLayoutEffect(function () {
        updateRect();
        if (layout.getEditingTab() === node) {
            contentRef.current.select();
        }
    });
    var updateRect = function () {
        // record position of tab in node
        var layoutRect = layout.getDomRect();
        var r = selfRef.current.getBoundingClientRect();
        node._setTabRect(new Rect_1.Rect(r.left - layoutRect.left, r.top - layoutRect.top, r.width, r.height));
    };
    var onTextBoxMouseDown = function (event) {
        // console.log("onTextBoxMouseDown");
        event.stopPropagation();
    };
    var onTextBoxKeyPress = function (event) {
        // console.log(event, event.keyCode);
        if (event.keyCode === 27) {
            // esc
            layout.setEditingTab(undefined);
        }
        else if (event.keyCode === 13) {
            // enter
            layout.setEditingTab(undefined);
            layout.doAction(Actions_1.Actions.renameTab(node.getId(), event.target.value));
        }
    };
    var cm = layout.getClassName;
    var classNames = cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON_ + border);
    if (selected) {
        classNames += " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON__SELECTED);
    }
    else {
        classNames += " " + cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON__UNSELECTED);
    }
    if (node.getClassName() !== undefined) {
        classNames += " " + node.getClassName();
    }
    var renderState = (0, Utils_1.getRenderStateEx)(layout, node, iconFactory, titleFactory);
    var content = renderState.content ? (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON_CONTENT) }, renderState.content)) : null;
    var leading = renderState.leading ? (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON_LEADING) }, renderState.leading)) : null;
    if (layout.getEditingTab() === node) {
        content = (React.createElement("input", { ref: contentRef, className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_TEXTBOX), "data-layout-path": path + "/textbox", type: "text", autoFocus: true, defaultValue: node.getName(), onKeyDown: onTextBoxKeyPress, onMouseDown: onTextBoxMouseDown, onTouchStart: onTextBoxMouseDown }));
    }
    if (node.isEnableClose()) {
        var closeTitle = layout.i18nName(I18nLabel_1.I18nLabel.Close_Tab);
        renderState.buttons.push(React.createElement("div", { key: "close", "data-layout-path": path + "/button/close", title: closeTitle, className: cm(Types_1.CLASSES.FLEXLAYOUT__BORDER_BUTTON_TRAILING), onMouseDown: onCloseMouseDown, onClick: onClose, onTouchStart: onCloseMouseDown }, (typeof icons.close === "function") ? icons.close(node) : icons.close));
    }
    return (React.createElement("div", { ref: selfRef, "data-layout-path": path, className: classNames, onMouseDown: onMouseDown, onClick: onAuxMouseClick, onAuxClick: onAuxMouseClick, onContextMenu: onContextMenu, onTouchStart: onMouseDown, title: node.getHelpText() },
        leading,
        content,
        renderState.buttons));
};
exports.BorderButton = BorderButton;
//# sourceMappingURL=BorderButton.js.map