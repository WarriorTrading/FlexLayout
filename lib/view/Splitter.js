"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var DragDrop_1 = require("../DragDrop");
var Actions_1 = require("../model/Actions");
var BorderNode_1 = require("../model/BorderNode");
var Orientation_1 = require("../Orientation");
/** @hidden @internal */
var Splitter = /** @class */ (function (_super) {
    __extends(Splitter, _super);
    function Splitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseDown = function (event) {
            DragDrop_1.default.instance.startDrag(event, _this.onDragStart, _this.onDragMove, _this.onDragEnd, _this.onDragCancel);
            var parentNode = _this.props.node.getParent();
            _this.pBounds = parentNode._getSplitterBounds(_this.props.node);
            var rootdiv = ReactDOM.findDOMNode(_this.props.layout);
            _this.outlineDiv = document.createElement("div");
            _this.outlineDiv.style.position = "absolute";
            _this.outlineDiv.className = _this.props.layout.getClassName("flexlayout__splitter_drag");
            _this.outlineDiv.style.cursor = _this.props.node.getOrientation() === Orientation_1.default.HORZ ? "ns-resize" : "ew-resize";
            _this.props.node.getRect().positionElement(_this.outlineDiv);
            rootdiv.appendChild(_this.outlineDiv);
        };
        _this.onDragCancel = function (wasDragging) {
            var rootdiv = ReactDOM.findDOMNode(_this.props.layout);
            rootdiv.removeChild(_this.outlineDiv);
        };
        _this.onDragStart = function () {
            return true;
        };
        _this.onDragMove = function (event) {
            var clientRect = ReactDOM.findDOMNode(_this.props.layout).getBoundingClientRect();
            var pos = {
                x: event.clientX - clientRect.left,
                y: event.clientY - clientRect.top
            };
            var outlineDiv = _this.outlineDiv;
            if (_this.props.node.getOrientation() === Orientation_1.default.HORZ) {
                outlineDiv.style.top = _this.getBoundPosition(pos.y - 4) + "px";
            }
            else {
                outlineDiv.style.left = _this.getBoundPosition(pos.x - 4) + "px";
            }
        };
        _this.onDragEnd = function () {
            var node = _this.props.node;
            var parentNode = node.getParent();
            var value = 0;
            var outlineDiv = _this.outlineDiv;
            if (node.getOrientation() === Orientation_1.default.HORZ) {
                value = outlineDiv.offsetTop;
            }
            else {
                value = outlineDiv.offsetLeft;
            }
            if (parentNode instanceof BorderNode_1.default) {
                var pos = parentNode._calculateSplit(node, value);
                _this.props.layout.doAction(Actions_1.default.adjustBorderSplit(node.getParent().getId(), pos));
            }
            else {
                var splitSpec = parentNode._calculateSplit(_this.props.node, value);
                if (splitSpec !== undefined) {
                    _this.props.layout.doAction(Actions_1.default.adjustSplit(splitSpec));
                }
            }
            var rootdiv = ReactDOM.findDOMNode(_this.props.layout);
            rootdiv.removeChild(_this.outlineDiv);
        };
        return _this;
    }
    Splitter.prototype.getBoundPosition = function (p) {
        var bounds = this.pBounds;
        var rtn = p;
        if (p < bounds[0]) {
            rtn = bounds[0];
        }
        if (p > bounds[1]) {
            rtn = bounds[1];
        }
        return rtn;
    };
    Splitter.prototype.render = function () {
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var style = node._styleWithPosition({
            cursor: this.props.node.getOrientation() === Orientation_1.default.HORZ ? "ns-resize" : "ew-resize"
        });
        return React.createElement("div", { style: style, onTouchStart: this.onMouseDown, onMouseDown: this.onMouseDown, className: cm("flexlayout__splitter") });
    };
    return Splitter;
}(React.Component));
exports.Splitter = Splitter;
// export default Splitter;
//# sourceMappingURL=Splitter.js.map