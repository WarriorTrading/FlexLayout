import { TabSetNode } from "./TabSetNode";
import { BorderNode } from "./BorderNode";
/** @internal */
export function adjustSelectedIndexAfterFloat(node) {
    const parent = node.getParent();
    if (parent !== null) {
        if (parent instanceof TabSetNode) {
            let found = false;
            let newSelected = 0;
            const children = parent.getChildren();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
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
        else if (parent instanceof BorderNode) {
            parent._setSelected(-1);
        }
    }
}
/** @internal */
export function adjustSelectedIndexAfterDock(node) {
    const parent = node.getParent();
    if (parent !== null && (parent instanceof TabSetNode || parent instanceof BorderNode)) {
        const children = parent.getChildren();
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child === node) {
                parent._setSelected(i);
                return;
            }
        }
    }
}
/** @internal */
export function adjustSelectedIndex(parent, removedIndex) {
    // for the tabset/border being removed from set the selected index
    if (parent !== undefined && (parent.getType() === TabSetNode.TYPE || parent.getType() === BorderNode.TYPE)) {
        const selectedIndex = parent.getSelected();
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
//# sourceMappingURL=Utils.js.map