"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splitter = void 0;
var React = require("react");
var DragDrop_1 = require("../DragDrop");
var Actions_1 = require("../model/Actions");
var BorderNode_1 = require("../model/BorderNode");
var Orientation_1 = require("../Orientation");
var Types_1 = require("../Types");
/** @internal */
var Splitter = function (props) {
    var layout = props.layout, node = props.node, path = props.path;
    var pBounds = React.useRef([]);
    var outlineDiv = React.useRef(undefined);
    var parentNode = node.getParent();
    var onMouseDown = function (event) {
        DragDrop_1.DragDrop.instance.setGlassCursorOverride(node.getOrientation() === Orientation_1.Orientation.HORZ ? "ns-resize" : "ew-resize");
        DragDrop_1.DragDrop.instance.startDrag(event, onDragStart, onDragMove, onDragEnd, onDragCancel, undefined, undefined, layout.getCurrentDocument(), layout.getRootDiv());
        pBounds.current = parentNode._getSplitterBounds(node, true);
        var rootdiv = layout.getRootDiv();
        outlineDiv.current = layout.getCurrentDocument().createElement("div");
        outlineDiv.current.style.position = "absolute";
        outlineDiv.current.className = layout.getClassName(Types_1.CLASSES.FLEXLAYOUT__SPLITTER_DRAG);
        outlineDiv.current.style.cursor = node.getOrientation() === Orientation_1.Orientation.HORZ ? "ns-resize" : "ew-resize";
        var r = node.getRect();
        if (node.getOrientation() === Orientation_1.Orientation.VERT && r.width < 2) {
            r.width = 2;
        }
        else if (node.getOrientation() === Orientation_1.Orientation.HORZ && r.height < 2) {
            r.height = 2;
        }
        r.positionElement(outlineDiv.current);
        rootdiv.appendChild(outlineDiv.current);
    };
    var onDragCancel = function (wasDragging) {
        var rootdiv = layout.getRootDiv();
        rootdiv.removeChild(outlineDiv.current);
    };
    var onDragStart = function () {
        return true;
    };
    var onDragMove = function (event) {
        var clientRect = layout.getDomRect();
        var pos = {
            x: event.clientX - clientRect.left,
            y: event.clientY - clientRect.top,
        };
        if (outlineDiv) {
            if (node.getOrientation() === Orientation_1.Orientation.HORZ) {
                outlineDiv.current.style.top = getBoundPosition(pos.y - 4) + "px";
            }
            else {
                outlineDiv.current.style.left = getBoundPosition(pos.x - 4) + "px";
            }
        }
        if (layout.isRealtimeResize()) {
            updateLayout();
        }
    };
    var updateLayout = function () {
        var value = 0;
        if (outlineDiv) {
            if (node.getOrientation() === Orientation_1.Orientation.HORZ) {
                value = outlineDiv.current.offsetTop;
            }
            else {
                value = outlineDiv.current.offsetLeft;
            }
        }
        if (parentNode instanceof BorderNode_1.BorderNode) {
            var pos = parentNode._calculateSplit(node, value);
            layout.doAction(Actions_1.Actions.adjustBorderSplit(node.getParent().getId(), pos));
        }
        else {
            var splitSpec = parentNode._calculateSplit(node, value);
            if (splitSpec !== undefined) {
                layout.doAction(Actions_1.Actions.adjustSplit(splitSpec));
            }
        }
    };
    var onDragEnd = function () {
        updateLayout();
        var rootdiv = layout.getRootDiv();
        rootdiv.removeChild(outlineDiv.current);
    };
    var getBoundPosition = function (p) {
        var bounds = pBounds.current;
        var rtn = p;
        if (p < bounds[0]) {
            rtn = bounds[0];
        }
        if (p > bounds[1]) {
            rtn = bounds[1];
        }
        return rtn;
    };
    var cm = layout.getClassName;
    var r = node.getRect();
    var style = r.styleWithPosition({
        cursor: node.getOrientation() === Orientation_1.Orientation.HORZ ? "ns-resize" : "ew-resize",
    });
    var className = cm(Types_1.CLASSES.FLEXLAYOUT__SPLITTER) + " " + cm(Types_1.CLASSES.FLEXLAYOUT__SPLITTER_ + node.getOrientation().getName());
    if (parentNode instanceof BorderNode_1.BorderNode) {
        className += " " + cm(Types_1.CLASSES.FLEXLAYOUT__SPLITTER_BORDER);
    }
    else {
        if (node.getModel().getMaximizedTabset() !== undefined) {
            style.display = "none";
        }
    }
    var extra = node.getModel().getSplitterExtra();
    if (extra === 0) {
        return (React.createElement("div", { style: style, "data-layout-path": path, className: className, onTouchStart: onMouseDown, onMouseDown: onMouseDown }));
    }
    else {
        // add extended transparent div for hit testing
        // extends forward only, so as not to interfere with scrollbars
        var r2 = r.clone();
        r2.x = 0;
        r2.y = 0;
        if (node.getOrientation() === Orientation_1.Orientation.VERT) {
            r2.width += extra;
        }
        else {
            r2.height += extra;
        }
        var style2 = r2.styleWithPosition({
            cursor: node.getOrientation() === Orientation_1.Orientation.HORZ ? "ns-resize" : "ew-resize"
        });
        var className2 = cm(Types_1.CLASSES.FLEXLAYOUT__SPLITTER_EXTRA);
        return (React.createElement("div", { style: style, "data-layout-path": path, className: className },
            React.createElement("div", { style: style2, className: className2, onTouchStart: onMouseDown, onMouseDown: onMouseDown })));
    }
};
exports.Splitter = Splitter;
//# sourceMappingURL=Splitter.js.map