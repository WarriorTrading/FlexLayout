import * as React from "react";
/** @internal */
export function getRenderStateEx(layout, node, iconFactory, titleFactory) {
    let leadingContent = iconFactory ? iconFactory(node) : undefined;
    let titleContent = node.getName();
    let name = node.getName();
    function isTitleObject(obj) {
        return obj.titleContent !== undefined;
    }
    if (titleFactory !== undefined) {
        const titleObj = titleFactory(node);
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
    let buttons = [];
    // allow customization of leading contents (icon) and contents
    const renderState = { leading: leadingContent, content: titleContent, name, buttons };
    layout.customizeTab(node, renderState);
    node._setRenderedName(renderState.name);
    return renderState;
}
/** @internal */
export function hideElement(style, useVisibility) {
    if (useVisibility) {
        style.visibility = "hidden";
    }
    else {
        style.display = "none";
    }
}
/** @internal */
export function isAuxMouseEvent(event) {
    let auxEvent = false;
    if (event.nativeEvent instanceof MouseEvent) {
        if (event.nativeEvent.button !== 0 || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            auxEvent = true;
        }
    }
    return auxEvent;
}
//# sourceMappingURL=Utils.js.map