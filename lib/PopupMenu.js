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
/** @hidden @internal */
var PopupMenu = /** @class */ (function (_super) {
    __extends(PopupMenu, _super);
    function PopupMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.items = [];
        _this.hidden = true;
        _this.onDocMouseUp = function (event) {
            setTimeout(function () {
                _this.hide();
            }, 0);
        };
        _this.onDocMouseUp = _this.onDocMouseUp;
        _this.hidden = false;
        return _this;
    }
    PopupMenu.show = function (triggerElement, items, onSelect, classNameMapper) {
        var triggerRect = triggerElement.getBoundingClientRect();
        var docRect = document.body.getBoundingClientRect();
        var elm = document.createElement("div");
        elm.className = classNameMapper("flexlayout__popup_menu_container");
        elm.style.right = (docRect.right - triggerRect.right) + "px";
        elm.style.top = triggerRect.bottom + "px";
        document.body.appendChild(elm);
        var onHide = function () {
            ReactDOM.unmountComponentAtNode(elm);
            document.body.removeChild(elm);
        };
        ReactDOM.render(React.createElement(PopupMenu, { element: elm, onSelect: onSelect, onHide: onHide, items: items, classNameMapper: classNameMapper }), elm);
    };
    PopupMenu.prototype.componentDidMount = function () {
        document.addEventListener("mouseup", this.onDocMouseUp);
    };
    PopupMenu.prototype.componentWillUnmount = function () {
        document.removeEventListener("mouseup", this.onDocMouseUp);
    };
    PopupMenu.prototype.hide = function () {
        if (!this.hidden) {
            this.props.onHide();
            this.hidden = true;
        }
    };
    PopupMenu.prototype.onItemClick = function (item, event) {
        this.props.onSelect(item);
        this.hide();
        event.stopPropagation();
    };
    PopupMenu.prototype.render = function () {
        var _this = this;
        var items = this.props.items.map(function (item) { return React.createElement("div", { key: item.index, className: _this.props.classNameMapper("flexlayout__popup_menu_item"), onClick: _this.onItemClick.bind(_this, item) }, item.name); });
        return React.createElement("div", { className: this.props.classNameMapper("flexlayout__popup_menu") }, items);
    };
    return PopupMenu;
}(React.Component));
/** @hidden @internal */
exports.default = PopupMenu;
//# sourceMappingURL=PopupMenu.js.map