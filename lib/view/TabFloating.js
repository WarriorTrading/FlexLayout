"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabFloating = void 0;
var React = require("react");
var Actions_1 = require("../model/Actions");
var TabSetNode_1 = require("../model/TabSetNode");
var Types_1 = require("../Types");
var I18nLabel_1 = require("../I18nLabel");
var Utils_1 = require("./Utils");
/** @internal */
var TabFloating = function (props) {
    var layout = props.layout, selected = props.selected, node = props.node, path = props.path;
    var showPopout = function () {
        if (node.getWindow()) {
            node.getWindow().focus();
        }
    };
    var dockPopout = function () {
        layout.doAction(Actions_1.Actions.unFloatTab(node.getId()));
    };
    var onMouseDown = function () {
        var parent = node.getParent();
        if (parent.getType() === TabSetNode_1.TabSetNode.TYPE) {
            if (!parent.isActive()) {
                layout.doAction(Actions_1.Actions.setActiveTabset(parent.getId()));
            }
        }
    };
    var onClickFocus = function (event) {
        event.preventDefault();
        showPopout();
    };
    var onClickDock = function (event) {
        event.preventDefault();
        dockPopout();
    };
    var cm = layout.getClassName;
    var parentNode = node.getParent();
    var style = node._styleWithPosition();
    if (!selected) {
        (0, Utils_1.hideElement)(style, node.getModel().isUseVisibility());
    }
    if (parentNode instanceof TabSetNode_1.TabSetNode) {
        if (node.getModel().getMaximizedTabset() !== undefined && !parentNode.isMaximized()) {
            (0, Utils_1.hideElement)(style, node.getModel().isUseVisibility());
        }
    }
    var message = layout.i18nName(I18nLabel_1.I18nLabel.Floating_Window_Message);
    var showMessage = layout.i18nName(I18nLabel_1.I18nLabel.Floating_Window_Show_Window);
    var dockMessage = layout.i18nName(I18nLabel_1.I18nLabel.Floating_Window_Dock_Window);
    var customRenderCallback = layout.getOnRenderFloatingTabPlaceholder();
    if (customRenderCallback) {
        return (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_FLOATING), onMouseDown: onMouseDown, onTouchStart: onMouseDown, style: style }, customRenderCallback(dockPopout, showPopout)));
    }
    else {
        return (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_FLOATING), "data-layout-path": path, onMouseDown: onMouseDown, onTouchStart: onMouseDown, style: style },
            React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_FLOATING_INNER) },
                React.createElement("div", null, message),
                React.createElement("div", null,
                    React.createElement("a", { href: "#", onClick: onClickFocus }, showMessage)),
                React.createElement("div", null,
                    React.createElement("a", { href: "#", onClick: onClickDock }, dockMessage)))));
    }
};
exports.TabFloating = TabFloating;
//# sourceMappingURL=TabFloating.js.map