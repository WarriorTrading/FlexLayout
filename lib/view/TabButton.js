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
var TabButton = /** @class */ (function (_super) {
    __extends(TabButton, _super);
    function TabButton(props) {
        var _this = _super.call(this, props) || this;
        _this.contentWidth = 0;
        _this.onMouseDown = function (event) {
            var message = _this.props.layout.i18nName(__1.I18nLabel.Move_Tab, _this.props.node.getName());
            _this.props.layout.dragStart(event, message, _this.props.node, _this.props.node.isEnableDrag(), _this.onClick, _this.onDoubleClick);
        };
        _this.onClick = function (event) {
            var node = _this.props.node;
            _this.props.layout.doAction(Actions_1.default.selectTab(node.getId()));
        };
        _this.onDoubleClick = function (event) {
            if (_this.props.node.isEnableRename()) {
                _this.setState({ editing: true });
                document.body.addEventListener("mousedown", _this.onEndEdit);
                document.body.addEventListener("touchstart", _this.onEndEdit);
            }
            else {
                var parentNode = _this.props.node.getParent();
                if (parentNode.isEnableMaximize()) {
                    _this.props.layout.maximize(parentNode);
                }
            }
        };
        _this.onEndEdit = function (event) {
            if (event.target !== _this.contentRef) {
                _this.setState({ editing: false });
                document.body.removeEventListener("mousedown", _this.onEndEdit);
                document.body.removeEventListener("touchstart", _this.onEndEdit);
            }
        };
        _this.onClose = function (event) {
            var node = _this.props.node;
            _this.props.layout.doAction(Actions_1.default.deleteTab(node.getId()));
        };
        _this.onCloseMouseDown = function (event) {
            event.stopPropagation();
        };
        _this.onTextBoxMouseDown = function (event) {
            // console.log("onTextBoxMouseDown");
            event.stopPropagation();
        };
        _this.onTextBoxKeyPress = function (event) {
            // console.log(event, event.keyCode);
            if (event.keyCode === 27) { // esc
                _this.setState({ editing: false });
            }
            else if (event.keyCode === 13) { // enter
                _this.setState({ editing: false });
                var node = _this.props.node;
                _this.props.layout.doAction(Actions_1.default.renameTab(node.getId(), event.target.value));
            }
        };
        _this.state = { editing: false };
        _this.onEndEdit = _this.onEndEdit;
        return _this;
    }
    TabButton.prototype.componentDidMount = function () {
        this.updateRect();
    };
    TabButton.prototype.componentDidUpdate = function () {
        this.updateRect();
        if (this.state.editing) {
            this.contentRef.select();
        }
    };
    TabButton.prototype.updateRect = function () {
        // record position of tab in node
        var clientRect = ReactDOM.findDOMNode(this.props.layout).getBoundingClientRect();
        var r = this.selfRef.getBoundingClientRect();
        this.props.node._setTabRect(new Rect_1.default(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
        this.contentWidth = this.contentRef.getBoundingClientRect().width;
    };
    TabButton.prototype.doRename = function (node, newName) {
        this.props.layout.doAction(Actions_1.default.renameTab(node.getId(), newName));
    };
    TabButton.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var classNames = cm("flexlayout__tab_button");
        var node = this.props.node;
        if (this.props.selected) {
            classNames += " " + cm("flexlayout__tab_button--selected");
        }
        else {
            classNames += " " + cm("flexlayout__tab_button--unselected");
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
        var content = React.createElement("div", { ref: function (ref) { return _this.contentRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_button_content") }, renderState.content);
        var leading = React.createElement("div", { className: cm("flexlayout__tab_button_leading") }, renderState.leading);
        if (this.state.editing) {
            var contentStyle = { width: this.contentWidth + "px" };
            content = React.createElement("input", { style: contentStyle, ref: function (ref) { return _this.contentRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_button_textbox"), type: "text", autoFocus: true, defaultValue: node.getName(), onKeyDown: this.onTextBoxKeyPress, onMouseDown: this.onTextBoxMouseDown, onTouchStart: this.onTextBoxMouseDown });
        }
        var closeButton;
        if (this.props.node.isEnableClose()) {
            closeButton = React.createElement("div", { className: cm("flexlayout__tab_button_trailing"), onMouseDown: this.onCloseMouseDown, onClick: this.onClose, onTouchStart: this.onCloseMouseDown });
        }
        return React.createElement("div", { ref: function (ref) { return _this.selfRef = (ref === null) ? undefined : ref; }, style: {
                visibility: this.props.show ? "visible" : "hidden",
                height: this.props.height
            }, className: classNames, onMouseDown: this.onMouseDown, onTouchStart: this.onMouseDown },
            leading,
            content,
            closeButton);
    };
    return TabButton;
}(React.Component));
exports.TabButton = TabButton;
// export default TabButton;
//# sourceMappingURL=TabButton.js.map