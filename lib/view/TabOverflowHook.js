"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTabOverflow = void 0;
var React = require("react");
var Rect_1 = require("../Rect");
var TabSetNode_1 = require("../model/TabSetNode");
var Orientation_1 = require("../Orientation");
/** @internal */
var useTabOverflow = function (node, orientation, toolbarRef, stickyButtonsRef) {
    var firstRender = React.useRef(true);
    var tabsTruncated = React.useRef(false);
    var lastRect = React.useRef(new Rect_1.Rect(0, 0, 0, 0));
    var selfRef = React.useRef(null);
    var _a = React.useState(0), position = _a[0], setPosition = _a[1];
    var userControlledLeft = React.useRef(false);
    var _b = React.useState([]), hiddenTabs = _b[0], setHiddenTabs = _b[1];
    var lastHiddenCount = React.useRef(0);
    // if selected node or tabset/border rectangle change then unset usercontrolled (so selected tab will be kept in view)
    React.useLayoutEffect(function () {
        userControlledLeft.current = false;
    }, [node.getSelectedNode(), node.getRect().width, node.getRect().height]);
    React.useLayoutEffect(function () {
        updateVisibleTabs();
    });
    React.useEffect(function () {
        var instance = selfRef.current;
        instance.addEventListener('wheel', onWheel);
        return function () {
            instance.removeEventListener('wheel', onWheel);
        };
    }, []);
    // needed to prevent default mouse wheel over tabset/border (cannot do with react event?)
    var onWheel = function (event) {
        event.preventDefault();
    };
    var getNear = function (rect) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return rect.x;
        }
        else {
            return rect.y;
        }
    };
    var getFar = function (rect) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return rect.getRight();
        }
        else {
            return rect.getBottom();
        }
    };
    var getSize = function (rect) {
        if (orientation === Orientation_1.Orientation.HORZ) {
            return rect.width;
        }
        else {
            return rect.height;
        }
    };
    var updateVisibleTabs = function () {
        var tabMargin = 2;
        if (firstRender.current === true) {
            tabsTruncated.current = false;
        }
        var nodeRect = node instanceof TabSetNode_1.TabSetNode ? node.getRect() : node.getTabHeaderRect();
        var lastChild = node.getChildren()[node.getChildren().length - 1];
        var stickyButtonsSize = stickyButtonsRef.current === null ? 0 : getSize(stickyButtonsRef.current.getBoundingClientRect());
        if (firstRender.current === true ||
            (lastHiddenCount.current === 0 && hiddenTabs.length !== 0) ||
            nodeRect.width !== lastRect.current.width || // incase rect changed between first render and second
            nodeRect.height !== lastRect.current.height) {
            lastHiddenCount.current = hiddenTabs.length;
            lastRect.current = nodeRect;
            var enabled = node instanceof TabSetNode_1.TabSetNode ? node.isEnableTabStrip() === true : true;
            var endPos = getFar(nodeRect) - stickyButtonsSize;
            if (toolbarRef.current !== null) {
                endPos -= getSize(toolbarRef.current.getBoundingClientRect());
            }
            if (enabled && node.getChildren().length > 0) {
                if (hiddenTabs.length === 0 && position === 0 && getFar(lastChild.getTabRect()) + tabMargin < endPos) {
                    return; // nothing to do all tabs are shown in available space
                }
                var shiftPos = 0;
                var selectedTab = node.getSelectedNode();
                if (selectedTab && !userControlledLeft.current) {
                    var selectedRect = selectedTab.getTabRect();
                    var selectedStart = getNear(selectedRect) - tabMargin;
                    var selectedEnd = getFar(selectedRect) + tabMargin;
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
                var extraSpace = Math.max(0, endPos - (getFar(lastChild.getTabRect()) + tabMargin + shiftPos));
                var newPosition = Math.min(0, position + shiftPos + extraSpace);
                // find hidden tabs
                var diff = newPosition - position;
                var hidden = [];
                for (var i = 0; i < node.getChildren().length; i++) {
                    var child = node.getChildren()[i];
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
    var onMouseWheel = function (event) {
        var delta = 0;
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
    return { selfRef: selfRef, position: position, userControlledLeft: userControlledLeft, hiddenTabs: hiddenTabs, onMouseWheel: onMouseWheel, tabsTruncated: tabsTruncated.current };
};
exports.useTabOverflow = useTabOverflow;
//# sourceMappingURL=TabOverflowHook.js.map