"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingWindowTab = void 0;
var React = require("react");
var ErrorBoundary_1 = require("./ErrorBoundary");
var I18nLabel_1 = require("../I18nLabel");
var react_1 = require("react");
var Types_1 = require("../Types");
/** @internal */
var FloatingWindowTab = function (props) {
    var layout = props.layout, node = props.node, factory = props.factory;
    var cm = layout.getClassName;
    var child = factory(node);
    return (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__FLOATING_WINDOW_TAB) },
        React.createElement(ErrorBoundary_1.ErrorBoundary, { message: props.layout.i18nName(I18nLabel_1.I18nLabel.Error_rendering_component) },
            React.createElement(react_1.Fragment, null, child))));
};
exports.FloatingWindowTab = FloatingWindowTab;
//# sourceMappingURL=FloatingWindowTab.js.map