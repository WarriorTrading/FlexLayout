"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabButtonStamp = void 0;
var React = require("react");
var Types_1 = require("../Types");
var Utils_1 = require("./Utils");
/** @internal */
var TabButtonStamp = function (props) {
    var layout = props.layout, node = props.node, iconFactory = props.iconFactory, titleFactory = props.titleFactory;
    var selfRef = React.useRef(null);
    var cm = layout.getClassName;
    var classNames = cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_STAMP);
    var renderState = (0, Utils_1.getRenderStateEx)(layout, node, iconFactory, titleFactory);
    var content = renderState.content ? (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_CONTENT) }, renderState.content))
        : node._getNameForOverflowMenu();
    var leading = renderState.leading ? (React.createElement("div", { className: cm(Types_1.CLASSES.FLEXLAYOUT__TAB_BUTTON_LEADING) }, renderState.leading)) : null;
    return (React.createElement("div", { ref: selfRef, className: classNames, title: node.getHelpText() },
        leading,
        content));
};
exports.TabButtonStamp = TabButtonStamp;
//# sourceMappingURL=TabButtonStamp.js.map