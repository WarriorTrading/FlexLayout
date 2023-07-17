import * as React from "react";
import { Rect } from "../Rect";
import { TabSetNode } from "../model/TabSetNode";
import { Orientation } from "../Orientation";
/** @internal */
export const useTabOverflow = (node, orientation, toolbarRef, stickyButtonsRef) => {
    const firstRender = React.useRef(true);
    const tabsTruncated = React.useRef(false);
    const lastRect = React.useRef(new Rect(0, 0, 0, 0));
    const selfRef = React.useRef(null);
    const [position, setPosition] = React.useState(0);
    const userControlledLeft = React.useRef(false);
    const [hiddenTabs, setHiddenTabs] = React.useState([]);
    const lastHiddenCount = React.useRef(0);
    // if selected node or tabset/border rectangle change then unset usercontrolled (so selected tab will be kept in view)
    React.useLayoutEffect(() => {
        userControlledLeft.current = false;
    }, [node.getSelectedNode(), node.getRect().width, node.getRect().height]);
    React.useLayoutEffect(() => {
        updateVisibleTabs();
    });
    React.useEffect(() => {
        const instance = selfRef.current;
        instance.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            instance.removeEventListener('wheel', onWheel);
        };
    }, []);
    // needed to prevent default mouse wheel over tabset/border (cannot do with react event?)
    const onWheel = (event) => {
        event.preventDefault();
    };
    const getNear = (rect) => {
        if (orientation === Orientation.HORZ) {
            return rect.x;
        }
        else {
            return rect.y;
        }
    };
    const getFar = (rect) => {
        if (orientation === Orientation.HORZ) {
            return rect.getRight();
        }
        else {
            return rect.getBottom();
        }
    };
    const getSize = (rect) => {
        if (orientation === Orientation.HORZ) {
            return rect.width;
        }
        else {
            return rect.height;
        }
    };
    const updateVisibleTabs = () => {
        const tabMargin = 2;
        if (firstRender.current === true) {
            tabsTruncated.current = false;
        }
        const nodeRect = node instanceof TabSetNode ? node.getRect() : node.getTabHeaderRect();
        let lastChild = node.getChildren()[node.getChildren().length - 1];
        const stickyButtonsSize = stickyButtonsRef.current === null ? 0 : getSize(stickyButtonsRef.current.getBoundingClientRect());
        if (firstRender.current === true ||
            (lastHiddenCount.current === 0 && hiddenTabs.length !== 0) ||
            nodeRect.width !== lastRect.current.width || // incase rect changed between first render and second
            nodeRect.height !== lastRect.current.height) {
            lastHiddenCount.current = hiddenTabs.length;
            lastRect.current = nodeRect;
            const enabled = node instanceof TabSetNode ? node.isEnableTabStrip() === true : true;
            let endPos = getFar(nodeRect) - stickyButtonsSize;
            if (toolbarRef.current !== null) {
                endPos -= getSize(toolbarRef.current.getBoundingClientRect());
            }
            if (enabled && node.getChildren().length > 0) {
                if (hiddenTabs.length === 0 && position === 0 && getFar(lastChild.getTabRect()) + tabMargin < endPos) {
                    return; // nothing to do all tabs are shown in available space
                }
                let shiftPos = 0;
                const selectedTab = node.getSelectedNode();
                if (selectedTab && !userControlledLeft.current) {
                    const selectedRect = selectedTab.getTabRect();
                    const selectedStart = getNear(selectedRect) - tabMargin;
                    const selectedEnd = getFar(selectedRect) + tabMargin;
                    // when selected tab is larger than available space then align left
                    if (getSize(selectedRect) + 2 * tabMargin >= endPos - getNear(nodeRect)) {
                        shiftPos = getNear(nodeRect) - selectedStart;
                    }
                    else {
                        if (selectedEnd > endPos || selectedStart < getNear(nodeRect)) {
                            if (selectedStart < getNear(nodeRect)) {
                                shiftPos = getNear(nodeRect) - selectedStart;
                            }
                            // use second if statement to prevent tab moving back then forwards if not enough space for single tab
                            if (selectedEnd + shiftPos > endPos) {
                                shiftPos = endPos - selectedEnd;
                            }
                        }
                    }
                }
                const extraSpace = Math.max(0, endPos - (getFar(lastChild.getTabRect()) + tabMargin + shiftPos));
                const newPosition = Math.min(0, position + shiftPos + extraSpace);
                // find hidden tabs
                const diff = newPosition - position;
                const hidden = [];
                for (let i = 0; i < node.getChildren().length; i++) {
                    const child = node.getChildren()[i];
                    if (getNear(child.getTabRect()) + diff < getNear(nodeRect) || getFar(child.getTabRect()) + diff > endPos) {
                        hidden.push({ node: child, index: i });
                    }
                }
                if (hidden.length > 0) {
                    tabsTruncated.current = true;
                }
                firstRender.current = false; // need to do a second render
                setHiddenTabs(hidden);
                setPosition(newPosition);
            }
        }
        else {
            firstRender.current = true;
        }
    };
    const onMouseWheel = (event) => {
        let delta = 0;
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            delta = -event.deltaX;
        }
        else {
            delta = -event.deltaY;
        }
        if (event.deltaMode === 1) {
            // DOM_DELTA_LINE	0x01	The delta values are specified in lines.
            delta *= 40;
        }
        setPosition(position + delta);
        userControlledLeft.current = true;
        event.stopPropagation();
    };
    return { selfRef, position, userControlledLeft, hiddenTabs, onMouseWheel, tabsTruncated: tabsTruncated.current };
};
//# sourceMappingURL=TabOverflowHook.js.map