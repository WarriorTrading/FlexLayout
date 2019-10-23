"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var __1 = require("..");
var Actions_1 = require("../model/Actions");
var Rect_1 = require("../Rect");
var titleApis_1 = require("../titleApis");
/** @hidden @internal */
// tslint:disable-next-line: variable-name
exports.TabButton = function (props) {
    var layout = props.layout, show = props.show, height = props.height, node = props.node, selected = props.selected;
    var _a = React.useState(false), editing = _a[0], setEditing = _a[1];
    var selfRef = React.useRef(null);
    var contentRef = React.useRef(null);
    var updateRect = React.useCallback(function () {
        // record position of tab in node
        var clientRect = ReactDOM.findDOMNode(layout).getBoundingClientRect();
        var r = selfRef.current.getBoundingClientRect();
        node._setTabRect(new Rect_1.default(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
    }, [node, layout]);
    React.useLayoutEffect(function () {
        updateRect();
    });
    var cm = React.useMemo(function () { return layout.getClassName; }, [layout.getClassName]);
    var classNames = React.useMemo(function () {
        // tslint:disable-next-line: no-shadowed-variable
        var classNames = cm("flexlayout__tab_button", node);
        if (selected) {
            classNames += " " + cm("flexlayout__tab_button--selected", node);
        }
        else {
            classNames += " " + cm("flexlayout__tab_button--unselected", node);
        }
        if (node.getClassName() !== undefined) {
            classNames += " " + node.getClassName();
        }
        return classNames;
    }, [node, cm, selected]);
    var onEndEdit = React.useCallback(function (event) {
        if (event.target !== contentRef.current) {
            setEditing(false);
            document.body.removeEventListener("mousedown", onEndEdit);
            document.body.removeEventListener("touchstart", onEndEdit);
        }
    }, [contentRef]);
    var onClick = React.useCallback(function (event) {
        layout.doAction(Actions_1.default.selectTab(node.getId()));
    }, [layout, node]);
    var onDoubleClick = function (event) {
        if (node.isEnableRename()) {
            setEditing(true);
            document.body.addEventListener("mousedown", onEndEdit);
            document.body.addEventListener("touchstart", onEndEdit);
        }
        else {
            var parentNode = node.getParent();
            if (parentNode.isEnableMaximize()) {
                layout.maximize(parentNode);
            }
        }
    };
    var onMouseDown = React.useCallback(function (event) {
        var message = layout.i18nName(__1.I18nLabel.Move_Tab, node.getName());
        layout.dragStart(event, message, node, node.isEnableDrag(), onClick, onDoubleClick);
    }, [layout, node, onClick, onDoubleClick]);
    var leadingContent = React.useMemo(function () {
        if (node.getIcon() !== undefined) {
            return React.createElement("img", { src: node.getIcon(), alt: "leadingContent" });
        }
        else {
            return null;
        }
    }, [node]);
    var renderState = React.useMemo(function () {
        // tslint:disable-next-line: no-shadowed-variable
        var renderState = {
            leading: leadingContent,
            content: node.getName()
        };
        layout.customizeTab(node, renderState);
        return renderState;
    }, [layout, leadingContent, node]);
    var onTextBoxKeyPress = React.useCallback(function (event) {
        if (event.keyCode === 27) {
            // esc
            setEditing(false);
        }
        else if (event.keyCode === 13) {
            // enter
            setEditing(false);
            layout.doAction(Actions_1.default.renameTab(node.getId(), event.target.value));
        }
    }, [node, layout]);
    var onTextBoxMouseDown = React.useCallback(function (event) {
        event.stopPropagation();
    }, []);
    var onClose = React.useCallback(function (event) {
        layout.doAction(Actions_1.default.deleteTab(node.getId()));
    }, []);
    var onCloseMouseDown = React.useCallback(function (event) {
        event.stopPropagation();
    }, []);
    return (React.createElement("div", { ref: selfRef, style: {
            visibility: show ? "visible" : "hidden",
            height: height
        }, className: classNames, onMouseDown: onMouseDown, onTouchStart: onMouseDown },
        React.createElement(Leading, { cm: cm, node: node, renderState: renderState }),
        React.createElement(Content, { ref: contentRef, editing: editing, cm: cm, onTextBoxKeyPress: onTextBoxKeyPress, onTextBoxMouseDown: onTextBoxMouseDown, renderState: renderState, node: node }),
        React.createElement(CloseButton, { isEnableClose: node.isEnableClose(), cm: cm, node: node, onClose: onClose, onCloseMouseDown: onCloseMouseDown })));
};
// tslint:disable-next-line: variable-name
var Leading = function (props) {
    var cm = props.cm, node = props.node, renderState = props.renderState;
    return (React.createElement("div", { className: cm("flexlayout__tab_button_leading", node) }, renderState.leading));
};
// tslint:disable-next-line: variable-name
var Content = React.forwardRef(function (props, ref) {
    var editing = props.editing, cm = props.cm, node = props.node, onTextBoxKeyPress = props.onTextBoxKeyPress, onTextBoxMouseDown = props.onTextBoxMouseDown;
    var nodeId = React.useMemo(function () { return node.getId(); }, [node]);
    var contentRef = React.useRef(null);
    React.useImperativeHandle(ref, function () { return contentRef.current; });
    var contentStyle = React.useMemo(function () {
        if (contentRef.current == null || !editing) {
            return {
                width: 0
            };
        }
        return {
            width: contentRef.current.getBoundingClientRect().width
        };
    }, [editing, contentRef]);
    var _a = React.useState(titleApis_1.default.title(nodeId)), title = _a[0], setTitle = _a[1];
    React.useEffect(function () {
        var currentTitle = "";
        var unsubscribe = titleApis_1.default.subscribe(function (payload) {
            if (nodeId === payload.nodeId && currentTitle !== payload.title) {
                currentTitle = payload.title;
                setTitle(currentTitle);
            }
        });
        return function () {
            unsubscribe();
        };
    }, [nodeId]);
    return (React.createElement(React.Fragment, null, editing ? (React.createElement("input", { style: contentStyle, ref: contentRef, className: cm("flexlayout__tab_button_textbox"), type: "text", autoFocus: true, defaultValue: node.getName(), onKeyDown: onTextBoxKeyPress, onMouseDown: onTextBoxMouseDown, onTouchStart: onTextBoxMouseDown })) : (React.createElement("div", { ref: contentRef, className: cm("flexlayout__tab_button_content") }, title))));
});
// tslint:disable-next-line: variable-name
var CloseButton = function (props) {
    var isEnableClose = props.isEnableClose, cm = props.cm, node = props.node, onCloseMouseDown = props.onCloseMouseDown, onClose = props.onClose;
    return isEnableClose ? (React.createElement("div", { className: cm("flexlayout__tab_button_trailing", node), onMouseDown: onCloseMouseDown, onClick: onClose, onTouchStart: onCloseMouseDown })) : null;
};
//# sourceMappingURL=TabButton.js.map