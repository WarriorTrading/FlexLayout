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
var Actions_1 = require("../model/Actions");
var TabSetNode_1 = require("../model/TabSetNode");
/** @hidden @internal */
var Tab = /** @class */ (function (_super) {
    __extends(Tab, _super);
    function Tab(props) {
        var _this = _super.call(this, props) || this;
        _this.onMouseDown = function () {
            var parent = _this.props.node.getParent();
            if (parent.getType() === TabSetNode_1.default.TYPE) {
                if (!parent.isActive()) {
                    _this.props.layout.doAction(Actions_1.default.setActiveTabset(parent.getId()));
                }
            }
        };
        _this.state = { renderComponent: !props.node.isEnableRenderOnDemand() || props.selected };
        return _this;
    }
    Tab.prototype.componentDidMount = function () {
        // console.log("mount " + this.props.node.getName());
    };
    Tab.prototype.componentWillUnmount = function () {
        // console.log("unmount " + this.props.node.getName());
    };
    Tab.prototype.componentWillReceiveProps = function (newProps) {
        if (!this.state.renderComponent && newProps.selected) {
            // load on demand
            // console.log("load on demand: " + this.props.node.getName());
            this.setState({ renderComponent: true });
        }
    };
    Tab.prototype.render = function () {
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var parentNode = node.getParent();
        var style = node._styleWithPosition({
            display: this.props.selected ? "block" : "none"
        });
        if (parentNode.isMaximized()) {
            style.zIndex = 100;
        }
        var child;
        if (this.state.renderComponent) {
            child = this.props.factory(node);
        }
        return React.createElement("div", { className: cm("flexlayout__tab"), onMouseDown: this.onMouseDown, onTouchStart: this.onMouseDown, style: style }, child);
    };
    return Tab;
}(React.Component));
exports.Tab = Tab;
// export default Tab;
//# sourceMappingURL=Tab.js.map