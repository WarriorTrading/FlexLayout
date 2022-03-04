"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuxMouseEvent = exports.hideElement = exports.getRenderStateEx = void 0;
var React = require("react");
/** @internal */
function getRenderStateEx(layout, node, iconFactory, titleFactory) {
    var leadingContent = iconFactory ? iconFactory(node) : undefined;
    var titleContent = node.getName();
    var name = node.getName();
    function isTitleObject(obj) {
        return obj.titleContent !== undefined;
    }
    if (titleFactory !== undefined) {
        var titleObj = titleFactory(node);
        if (titleObj !== undefined) {
            if (typeof titleObj === "string") {
                titleContent = titleObj;
                name = titleObj;
            }
            else if (isTitleObject(titleObj)) {
                titleContent = titleObj.titleContent;
                name = titleObj.name;
            }
            else {
                titleContent = titleObj;
            }
        }
    }
    if (leadingContent === undefined && node.getIcon() !== undefined) {
        leadingContent = React.createElement("img", { style: { width: "1em", height: "1em" }, src: node.getIcon(), alt: "leadingContent" });
    }
    var buttons = [];
    // allow customization of leading contents (icon) and contents
    var renderState = { leading: leadingContent, content: titleContent, name: name, buttons: buttons };
    layout.customizeTab(node, renderState);
    node._setRenderedName(renderState.name);
    return renderState;
}
exports.getRenderStateEx = getRenderStateEx;
/** @internal */
function hideElement(style, useVisibility) {
    if (useVisibility) {
        style.visibility = "hidden";
    }
    else {
        style.display = "none";
    }
}
exports.hideElement = hideElement;
/** @internal */
function isAuxMouseEvent(event) {
    var auxEvent = false;
    if (event.nativeEvent instanceof MouseEvent) {
        if (event.nativeEvent.button !== 0 || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            auxEvent = true;
        }
    }
    return auxEvent;
}
exports.isAuxMouseEvent = isAuxMouseEvent;
//# sourceMappingURL=Utils.js.map