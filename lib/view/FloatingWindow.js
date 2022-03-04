"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingWindow = void 0;
var React = require("react");
var react_dom_1 = require("react-dom");
var Types_1 = require("../Types");
/** @internal */
var FloatingWindow = function (props) {
    var title = props.title, id = props.id, url = props.url, rect = props.rect, onCloseWindow = props.onCloseWindow, onSetWindow = props.onSetWindow, children = props.children;
    var popoutWindow = React.useRef(null);
    var _a = React.useState(undefined), content = _a[0], setContent = _a[1];
    React.useLayoutEffect(function () {
        var r = rect;
        // Make a local copy of the styles from the current window which will be passed into
        // the floating window. window.document.styleSheets is mutable and we can't guarantee
        // the styles will exist when 'popoutWindow.load' is called below.
        var styles = Array.from(window.document.styleSheets).reduce(function (result, styleSheet) {
            var rules = undefined;
            try {
                rules = styleSheet.cssRules;
            }
            catch (e) {
                // styleSheet.cssRules can throw security exception
            }
            try {
                return __spreadArray(__spreadArray([], result, true), [
                    {
                        href: styleSheet.href,
                        type: styleSheet.type,
                        rules: rules ? Array.from(rules).map(function (rule) { return rule.cssText; }) : null,
                    }
                ], false);
            }
            catch (e) {
                return result;
            }
        }, []);
        popoutWindow.current = window.open(url, id, "left=".concat(r.x, ",top=").concat(r.y, ",width=").concat(r.width, ",height=").concat(r.height));
        if (popoutWindow.current !== null) {
            onSetWindow(id, popoutWindow.current);
            // listen for parent unloading to remove all popouts
            window.addEventListener("beforeunload", function () {
                if (popoutWindow.current) {
                    popoutWindow.current.close();
                    popoutWindow.current = null;
                }
            });
            popoutWindow.current.addEventListener("load", function () {
                var popoutDocument = popoutWindow.current.document;
                popoutDocument.title = title;
                var popoutContent = popoutDocument.createElement("div");
                popoutContent.className = Types_1.CLASSES.FLEXLAYOUT__FLOATING_WINDOW_CONTENT;
                popoutDocument.body.appendChild(popoutContent);
                copyStyles(popoutDocument, styles).then(function () {
                    setContent(popoutContent);
                });
                // listen for popout unloading (needs to be after load for safari)
                popoutWindow.current.addEventListener("beforeunload", function () {
                    onCloseWindow(id);
                });
            });
        }
        else {
            console.warn("Unable to open window ".concat(url));
            onCloseWindow(id);
        }
        return function () {
            // delay so refresh will close window
            setTimeout(function () {
                if (popoutWindow.current) {
                    popoutWindow.current.close();
                    popoutWindow.current = null;
                }
            }, 0);
        };
    }, []);
    if (content !== undefined) {
        return (0, react_dom_1.createPortal)(children, content);
    }
    else {
        return null;
    }
};
exports.FloatingWindow = FloatingWindow;
/** @internal */
function copyStyles(doc, styleSheets) {
    var head = doc.head;
    var promises = [];
    var _loop_1 = function (styleSheet) {
        if (styleSheet.href) {
            // prefer links since they will keep paths to images etc
            var styleElement_1 = doc.createElement("link");
            styleElement_1.type = styleSheet.type;
            styleElement_1.rel = "stylesheet";
            styleElement_1.href = styleSheet.href;
            head.appendChild(styleElement_1);
            promises.push(new Promise(function (resolve, reject) {
                styleElement_1.onload = function () { return resolve(true); };
            }));
        }
        else {
            if (styleSheet.rules) {
                var style = doc.createElement("style");
                for (var _a = 0, _b = styleSheet.rules; _a < _b.length; _a++) {
                    var rule = _b[_a];
                    style.appendChild(doc.createTextNode(rule));
                }
                head.appendChild(style);
            }
        }
    };
    for (var _i = 0, styleSheets_1 = styleSheets; _i < styleSheets_1.length; _i++) {
        var styleSheet = styleSheets_1[_i];
        _loop_1(styleSheet);
    }
    return Promise.all(promises);
}
//# sourceMappingURL=FloatingWindow.js.map