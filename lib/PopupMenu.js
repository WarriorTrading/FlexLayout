"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPopup = void 0;
var React = require("react");
var DragDrop_1 = require("./DragDrop");
var Types_1 = require("./Types");
var TabButtonStamp_1 = require("./view/TabButtonStamp");
/** @internal */
function showPopup(triggerElement, items, onSelect, layout, iconFactory, titleFactory) {
    var layoutDiv = layout.getRootDiv();
    var classNameMapper = layout.getClassName;
    var currentDocument = triggerElement.ownerDocument;
    var triggerRect = triggerElement.getBoundingClientRect();
    var layoutRect = layoutDiv.getBoundingClientRect();
    var elm = currentDocument.createElement("div");
    elm.className = classNameMapper(Types_1.CLASSES.FLEXLAYOUT__POPUP_MENU_CONTAINER);
    if (triggerRect.left < layoutRect.left + layoutRect.width / 2) {
        elm.style.left = triggerRect.left - layoutRect.left + "px";
    }
    else {
        elm.style.right = layoutRect.right - triggerRect.right + "px";
    }
    if (triggerRect.top < layoutRect.top + layoutRect.height / 2) {
        elm.style.top = triggerRect.top - layoutRect.top + "px";
    }
    else {
        elm.style.bottom = layoutRect.bottom - triggerRect.bottom + "px";
    }
    DragDrop_1.DragDrop.instance.addGlass(function () { return onHide(); });
    DragDrop_1.DragDrop.instance.setGlassCursorOverride("default");
    layoutDiv.appendChild(elm);
    var onHide = function () {
        layout.hidePortal();
        DragDrop_1.DragDrop.instance.hideGlass();
        layoutDiv.removeChild(elm);
        elm.removeEventListener("mousedown", onElementMouseDown);
        currentDocument.removeEventListener("mousedown", onDocMouseDown);
    };
    var onElementMouseDown = function (event) {
        event.stopPropagation();
    };
    var onDocMouseDown = function (event) {
        onHide();
    };
    elm.addEventListener("mousedown", onElementMouseDown);
    currentDocument.addEventListener("mousedown", onDocMouseDown);
    layout.showPortal(React.createElement(PopupMenu, { currentDocument: currentDocument, onSelect: onSelect, onHide: onHide, items: items, classNameMapper: classNameMapper, layout: layout, iconFactory: iconFactory, titleFactory: titleFactory }), elm);
}
exports.showPopup = showPopup;
/** @internal */
var PopupMenu = function (props) {
    var items = props.items, onHide = props.onHide, onSelect = props.onSelect, classNameMapper = props.classNameMapper, layout = props.layout, iconFactory = props.iconFactory, titleFactory = props.titleFactory;
    var onItemClick = function (item, event) {
        onSelect(item);
        onHide();
        event.stopPropagation();
    };
    var itemElements = items.map(function (item, i) { return (React.createElement("div", { key: item.index, className: classNameMapper(Types_1.CLASSES.FLEXLAYOUT__POPUP_MENU_ITEM), "data-layout-path": "/popup-menu/tb" + i, onClick: function (event) { return onItemClick(item, event); }, title: item.node.getHelpText() }, item.node.getModel().isLegacyOverflowMenu() ?
        item.node._getNameForOverflowMenu() :
        React.createElement(TabButtonStamp_1.TabButtonStamp, { node: item.node, layout: layout, iconFactory: iconFactory, titleFactory: titleFactory }))); });
    return (React.createElement("div", { className: classNameMapper(Types_1.CLASSES.FLEXLAYOUT__POPUP_MENU), "data-layout-path": "/popup-menu" }, itemElements));
};
//# sourceMappingURL=PopupMenu.js.map