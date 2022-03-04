"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustSelectedIndex = exports.adjustSelectedIndexAfterDock = exports.adjustSelectedIndexAfterFloat = void 0;
var TabSetNode_1 = require("./TabSetNode");
var BorderNode_1 = require("./BorderNode");
/** @internal */
function adjustSelectedIndexAfterFloat(node) {
    var parent = node.getParent();
    if (parent !== null) {
        if (parent instanceof TabSetNode_1.TabSetNode) {
            var found = false;
            var newSelected = 0;
            var children = parent.getChildren();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child === node) {
                    found = true;
                }
                else {
                    if (!child.isFloating()) {
                        newSelected = i;
                        if (found)
                            break;
                    }
                }
            }
            parent._setSelected(newSelected);
        }
        else if (parent instanceof BorderNode_1.BorderNode) {
            parent._setSelected(-1);
        }
    }
}
exports.adjustSelectedIndexAfterFloat = adjustSelectedIndexAfterFloat;
/** @internal */
function adjustSelectedIndexAfterDock(node) {
    var parent = node.getParent();
    if (parent !== null && (parent instanceof TabSetNode_1.TabSetNode || parent instanceof BorderNode_1.BorderNode)) {
        var children = parent.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child === node) {
                parent._setSelected(i);
                return;
            }
        }
    }
}
exports.adjustSelectedIndexAfterDock = adjustSelectedIndexAfterDock;
/** @internal */
function adjustSelectedIndex(parent, removedIndex) {
    // for the tabset/border being removed from set the selected index
    if (parent !== undefined && (parent.getType() === TabSetNode_1.TabSetNode.TYPE || parent.getType() === BorderNode_1.BorderNode.TYPE)) {
        var selectedIndex = parent.getSelected();
        if (selectedIndex !== -1) {
            if (removedIndex === selectedIndex && parent.getChildren().length > 0) {
                if (removedIndex >= parent.getChildren().length) {
                    // removed last tab; select new last tab
                    parent._setSelected(parent.getChildren().length - 1);
                }
                else {
                    // leave selected index as is, selecting next tab after this one
                }
            }
            else if (removedIndex < selectedIndex) {
                parent._setSelected(selectedIndex - 1);
            }
            else if (removedIndex > selectedIndex) {
                // leave selected index as is
            }
            else {
                parent._setSelected(-1);
            }
        }
    }
}
exports.adjustSelectedIndex = adjustSelectedIndex;
//# sourceMappingURL=Utils.js.map