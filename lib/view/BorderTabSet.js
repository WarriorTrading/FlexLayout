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
var DockLocation_1 = require("../DockLocation");
var BorderButton_1 = require("./BorderButton");
/** @hidden @internal */
var BorderTabSet = /** @class */ (function (_super) {
    __extends(BorderTabSet, _super);
    function BorderTabSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderTabSet.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var border = this.props.border;
        var style = border.getTabHeaderRect().styleWithPosition({});
        var tabs = [];
        if (border.getLocation() !== DockLocation_1.default.LEFT) {
            for (var i = 0; i < border.getChildren().length; i++) {
                var isSelected = border.getSelected() === i;
                var child = border.getChildren()[i];
                tabs.push(React.createElement(BorderButton_1.BorderButton, { layout: this.props.layout, border: border.getLocation().getName(), node: child, key: child.getId(), selected: isSelected }));
            }
        }
        else {
            for (var i = border.getChildren().length - 1; i >= 0; i--) {
                var isSelected = border.getSelected() === i;
                var child = border.getChildren()[i];
                tabs.push(React.createElement(BorderButton_1.BorderButton, { layout: this.props.layout, border: border.getLocation().getName(), node: child, key: child.getId(), selected: isSelected }));
            }
        }
        var borderClasses = cm("flexlayout__border_" + border.getLocation().getName());
        if (this.props.border.getClassName() !== undefined) {
            borderClasses += " " + this.props.border.getClassName();
        }
        // allow customization of tabset right/bottom buttons
        var buttons = [];
        var renderState = { headerContent: {}, buttons: buttons };
        this.props.layout.customizeTabSet(border, renderState);
        buttons = renderState.buttons;
        var toolbar = React.createElement("div", { key: "toolbar", ref: function (toolbar2) { return _this.toolbarRef = (toolbar2 === null) ? undefined : toolbar2; }, className: cm("flexlayout__border_toolbar_" + border.getLocation().getName()) }, buttons);
        return React.createElement("div", { style: style, className: borderClasses },
            React.createElement("div", { className: cm("flexlayout__border_inner_" + border.getLocation().getName()) }, tabs),
            toolbar);
    };
    return BorderTabSet;
}(React.Component));
exports.BorderTabSet = BorderTabSet;
//# sourceMappingURL=BorderTabSet.js.map