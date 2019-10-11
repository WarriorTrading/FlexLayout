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
var __1 = require("..");
var Actions_1 = require("../model/Actions");
var Rect_1 = require("../Rect");
/** @hidden @internal */
var BorderButton = /** @class */ (function (_super) {
    __extends(BorderButton, _super);
    function BorderButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseDown = function (event) {
            var message = _this.props.layout.i18nName(__1.I18nLabel.Move_Tab, _this.props.node.getName());
            _this.props.layout.dragStart(event, message, _this.props.node, _this.props.node.isEnableDrag(), _this.onClick, function (event2) { return undefined; });
        };
        _this.onClick = function () {
            var node = _this.props.node;
            _this.props.layout.doAction(Actions_1.default.selectTab(node.getId()));
        };
        _this.onClose = function (event) {
            var node = _this.props.node;
            _this.props.layout.doAction(Actions_1.default.deleteTab(node.getId()));
        };
        _this.onCloseMouseDown = function (event) {
            event.stopPropagation();
        };
        return _this;
    }
    BorderButton.prototype.componentDidMount = function () {
        this.updateRect();
    };
    BorderButton.prototype.componentDidUpdate = function () {
        this.updateRect();
    };
    BorderButton.prototype.updateRect = function () {
        // record position of tab in border
        var clientRect = ReactDOM.findDOMNode(this.props.layout).getBoundingClientRect();
        var r = this.selfRef.getBoundingClientRect();
        this.props.node._setTabRect(new Rect_1.default(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
    };
    BorderButton.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var classNames = cm("flexlayout__border_button", this.props.node) +
            " " +
            cm("flexlayout__border_button_" + this.props.border, this.props.node);
        var node = this.props.node;
        if (this.props.selected) {
            classNames +=
                " " + cm("flexlayout__border_button--selected", this.props.node);
        }
        else {
            classNames +=
                " " + cm("flexlayout__border_button--unselected", this.props.node);
        }
        if (this.props.node.getClassName() !== undefined) {
            classNames += " " + this.props.node.getClassName();
        }
        var leadingContent;
        if (node.getIcon() !== undefined) {
            leadingContent = React.createElement("img", { src: node.getIcon(), alt: "leadingContent" });
        }
        // allow customization of leading contents (icon) and contents
        var renderState = { leading: leadingContent, content: node.getName() };
        this.props.layout.customizeTab(node, renderState);
        var content = (React.createElement("div", { ref: function (ref) { return (_this.contentsRef = ref === null ? undefined : ref); }, className: cm("flexlayout__border_button_content", this.props.node) }, renderState.content));
        var leading = (React.createElement("div", { className: cm("flexlayout__border_button_leading", this.props.node) }, renderState.leading));
        var closeButton;
        if (this.props.node.isEnableClose()) {
            closeButton = (React.createElement("div", { className: cm("flexlayout__border_button_trailing", this.props.node), onMouseDown: this.onCloseMouseDown, onClick: this.onClose, onTouchStart: this.onCloseMouseDown }));
        }
        return (React.createElement("div", { ref: function (ref) { return (_this.selfRef = ref === null ? undefined : ref); }, style: {}, className: classNames, onMouseDown: this.onMouseDown, onTouchStart: this.onMouseDown },
            leading,
            content,
            closeButton));
    };
    return BorderButton;
}(React.Component));
exports.BorderButton = BorderButton;
// export default BorderButton;
//# sourceMappingURL=BorderButton.js.map