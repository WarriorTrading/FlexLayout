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
var __1 = require("..");
var Actions_1 = require("../model/Actions");
var PopupMenu_1 = require("../PopupMenu");
var TabButton_1 = require("./TabButton");
/** @hidden @internal */
var TabSet = /** @class */ (function (_super) {
    __extends(TabSet, _super);
    function TabSet(props) {
        var _this = _super.call(this, props) || this;
        _this.onOverflowClick = function (hiddenTabs) {
            // console.log("hidden tabs: " + hiddenTabs);
            var element = _this.overflowbuttonRef;
            PopupMenu_1.default.show(element, hiddenTabs, _this.onOverflowItemSelect, function (defaultClassName) {
                return _this.props.layout.getClassName(defaultClassName, _this.props.node);
            });
        };
        _this.onOverflowItemSelect = function (item) {
            _this.props.layout.doAction(Actions_1.default.selectTab(item.node.getId()));
        };
        _this.onMouseDown = function (event) {
            var name = _this.props.node.getName();
            if (name === undefined) {
                name = "";
            }
            else {
                name = ": " + name;
            }
            _this.props.layout.doAction(Actions_1.default.setActiveTabset(_this.props.node.getId()));
            var message = _this.props.layout.i18nName(__1.I18nLabel.Move_Tabset, name);
            _this.props.layout.dragStart(event, message, _this.props.node, _this.props.node.isEnableDrag(), function (event2) { return undefined; }, _this.onDoubleClick);
        };
        _this.onInterceptMouseDown = function (event) {
            event.stopPropagation();
        };
        _this.onMaximizeToggle = function () {
            if (_this.props.node.isEnableMaximize()) {
                _this.props.layout.maximize(_this.props.node);
            }
        };
        _this.onDoubleClick = function (event) {
            if (_this.props.node.isEnableMaximize()) {
                _this.props.layout.maximize(_this.props.node);
            }
        };
        _this.recalcVisibleTabs = true;
        _this.showOverflow = false;
        _this.showToolbar = true;
        _this.state = { hideTabsAfter: 999 };
        return _this;
    }
    TabSet.prototype.componentDidMount = function () {
        this.updateVisibleTabs();
    };
    TabSet.prototype.componentDidUpdate = function () {
        this.updateVisibleTabs();
    };
    TabSet.prototype.componentWillReceiveProps = function (nextProps) {
        this.showToolbar = true;
        this.showOverflow = false;
        this.recalcVisibleTabs = true;
        this.setState({ hideTabsAfter: 999 });
    };
    TabSet.prototype.updateVisibleTabs = function () {
        var node = this.props.node;
        if (node.isEnableTabStrip() && this.recalcVisibleTabs) {
            var toolbarWidth = this.toolbarRef.getBoundingClientRect()
                .width;
            var hideTabsAfter = 999;
            for (var i = 0; i < node.getChildren().length; i++) {
                var child = node.getChildren()[i];
                if (child.getTabRect().getRight() >
                    node.getRect().getRight() - (20 + toolbarWidth)) {
                    hideTabsAfter = Math.max(0, i - 1);
                    // console.log("tabs truncated to:" + hideTabsAfter);
                    this.showOverflow = node.getChildren().length > 1;
                    if (i === 0) {
                        // this.showToolbar = false;
                        if (child.getTabRect().getRight() >
                            node.getRect().getRight() - 20) {
                            this.showOverflow = false;
                        }
                    }
                    break;
                }
            }
            if (this.state.hideTabsAfter !== hideTabsAfter) {
                this.setState({ hideTabsAfter: hideTabsAfter });
            }
            this.recalcVisibleTabs = false;
        }
    };
    TabSet.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var style = node._styleWithPosition();
        if (this.props.node.isMaximized()) {
            style.zIndex = 100;
        }
        var tabs = [];
        var hiddenTabs = [];
        if (node.isEnableTabStrip()) {
            for (var i = 0; i < node.getChildren().length; i++) {
                var isSelected = this.props.node.getSelected() === i;
                var showTab = this.state.hideTabsAfter >= i;
                var child = node.getChildren()[i];
                if (this.state.hideTabsAfter === i &&
                    this.props.node.getSelected() > this.state.hideTabsAfter) {
                    hiddenTabs.push({ name: child.getName(), node: child, index: i });
                    child = node.getChildren()[this.props.node.getSelected()];
                    isSelected = true;
                }
                else if (!showTab && !isSelected) {
                    hiddenTabs.push({ name: child.getName(), node: child, index: i });
                }
                if (showTab) {
                    tabs.push(React.createElement(TabButton_1.TabButton, { layout: this.props.layout, node: child, key: child.getId(), selected: isSelected, show: showTab, height: node.getTabStripHeight() }));
                }
            }
        }
        // tabs.forEach(c => console.log(c.key));
        var buttons = [];
        // allow customization of header contents and buttons
        var renderState = { headerContent: node.getName(), buttons: buttons };
        this.props.layout.customizeTabSet(this.props.node, renderState);
        var headerContent = renderState.headerContent;
        buttons = renderState.buttons;
        var toolbar;
        if (this.showToolbar === true) {
            if (this.props.node.isEnableMaximize()) {
                buttons.push(React.createElement("button", { key: "max", className: cm("flexlayout__tab_toolbar_button-" +
                        (node.isMaximized() ? "max" : "min"), this.props.node), onClick: this.onMaximizeToggle }));
            }
            toolbar = (React.createElement("div", { key: "toolbar", ref: function (ref) { return (_this.toolbarRef = ref === null ? undefined : ref); }, className: cm("flexlayout__tab_toolbar", this.props.node), onMouseDown: this.onInterceptMouseDown }, buttons));
        }
        if (this.showOverflow === true) {
            tabs.push(React.createElement("button", { key: "overflowbutton", ref: function (ref) { return (_this.overflowbuttonRef = ref === null ? undefined : ref); }, className: cm("flexlayout__tab_button_overflow", this.props.node), onClick: this.onOverflowClick.bind(this, hiddenTabs), onMouseDown: this.onInterceptMouseDown }, hiddenTabs.length));
        }
        var showHeader = node.getName() !== undefined;
        var header;
        var tabStrip;
        var tabStripClasses = cm("flexlayout__tab_header_outer", this.props.node);
        if (this.props.node.getClassNameTabStrip() !== undefined) {
            tabStripClasses += " " + this.props.node.getClassNameTabStrip();
        }
        if (node.isActive() && !showHeader) {
            tabStripClasses +=
                " " + cm("flexlayout__tabset-selected", this.props.node);
        }
        if (node.isMaximized() && !showHeader) {
            tabStripClasses +=
                " " + cm("flexlayout__tabset-maximized", this.props.node);
        }
        if (showHeader) {
            var tabHeaderClasses = cm("flexlayout__tabset_header", this.props.node);
            if (node.isActive()) {
                tabHeaderClasses +=
                    " " + cm("flexlayout__tabset-selected", this.props.node);
            }
            if (node.isMaximized()) {
                tabHeaderClasses +=
                    " " + cm("flexlayout__tabset-maximized", this.props.node);
            }
            if (this.props.node.getClassNameHeader() !== undefined) {
                tabHeaderClasses += " " + this.props.node.getClassNameHeader();
            }
            header = (React.createElement("div", { className: tabHeaderClasses, style: { height: node.getHeaderHeight() + "px" }, onMouseDown: this.onMouseDown, onTouchStart: this.onMouseDown },
                headerContent,
                toolbar));
            tabStrip = (React.createElement("div", { className: tabStripClasses, style: {
                    height: node.getTabStripHeight() + "px",
                    top: node.getHeaderHeight() + "px"
                } },
                React.createElement("div", { ref: function (ref) { return (_this.headerRef = ref === null ? undefined : ref); }, className: cm("flexlayout__tab_header_inner", this.props.node) }, tabs)));
        }
        else {
            tabStrip = (React.createElement("div", { className: tabStripClasses, style: { top: "0px", height: node.getTabStripHeight() + "px" }, onMouseDown: this.onMouseDown, onTouchStart: this.onMouseDown },
                React.createElement("div", { ref: function (ref) { return (_this.headerRef = ref === null ? undefined : ref); }, className: cm("flexlayout__tab_header_inner", this.props.node) }, tabs),
                toolbar));
        }
        return (React.createElement("div", { style: style, className: cm("flexlayout__tabset", this.props.node) },
            header,
            tabStrip));
    };
    return TabSet;
}(React.Component));
exports.TabSet = TabSet;
// export default TabSet;
//# sourceMappingURL=TabSet.js.map