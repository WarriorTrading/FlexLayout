"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab = void 0;
var React = require("react");
var react_1 = require("react");
var Actions_1 = require("../model/Actions");
var TabSetNode_1 = require("../model/TabSetNode");
var Types_1 = require("../Types");
var ErrorBoundary_1 = require("./ErrorBoundary");
var I18nLabel_1 = require("../I18nLabel");
var BorderNode_1 = require("../model/BorderNode");
var Utils_1 = require("./Utils");
/** @internal */
var Tab = function (props) {
    var layout = props.layout, selected = props.selected, node = props.node, factory = props.factory, path = props.path;
    var _a = React.useState(!props.node.isEnableRenderOnDemand() || props.selected), renderComponent = _a[0], setRenderComponent = _a[1];
    React.useLayoutEffect(function () {
        if (!renderComponent && selected) {
            // load on demand
            // console.log("load on demand: " + node.getName());
            setRenderComponent(true);
        }
    });
    var onMouseDown = function () {
        var parent = node.getParent();
        if (parent.getType() === TabSetNode_1.TabSetNode.TYPE) {
            if (!parent.isActive()) {
                layout.doAction(Actions_1.Actions.setActiveTabset(parent.getId()));
            }
        }
    };
    var cm = layout.getClassName;
    var useVisibility = node.getModel().isUseVisibility();
    var parentNode = node.getParent();
    var style = node._styleWithPosition();
    if (!selected) {
        (0, Utils_1.hideElement)(style, useVisibility);
    }
    if (parentNode instanceof TabSetNode_1.TabSetNode) {
        if (node.getModel().getMaximizedTabset() !== undefined && !parentNode.isMaximized()) {
            (0, Utils_1.hideElement)(style, useVisibility);
        }
    }
    var child;
    if (renderComponent) {
        child = factory(node);
    }
    var className = cm(Types_1.CLASSES.FLEXLAYOUT__TAB);
    if (parentNode instanceof BorderNode_1.BorderNode) {
        className += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BORDER);
        className += " " + cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BORDER_ + parentNode.getLocation().getName());
    }
    return (React.createElement("div", { className: className, "data-layout-path": path, onMouseDown: onMouseDown, onTouchStart: onMouseDown, style: style },
        React.createElement(ErrorBoundary_1.ErrorBoundary, { message: props.layout.i18nName(I18nLabel_1.I18nLabel.Error_rendering_component) },
            React.createElement(react_1.Fragment, null, child))));
};
exports.Tab = Tab;
//# sourceMappingURL=Tab.js.map