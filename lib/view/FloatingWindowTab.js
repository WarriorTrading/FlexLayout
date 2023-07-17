import * as React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { I18nLabel } from "../I18nLabel";
import { Fragment } from "react";
import { CLASSES } from "../Types";
/** @internal */
export const FloatingWindowTab = (props) => {
    const { layout, node, factory } = props;
    const cm = layout.getClassName;
    const child = factory(node);
    return (React.createElement("div", { className: cm(CLASSES.FLEXLAYOUT__FLOATING_WINDOW_TAB) },
        React.createElement(ErrorBoundary, { message: props.layout.i18nName(I18nLabel.Error_rendering_component) },
            React.createElement(Fragment, null, child))));
};
//# sourceMappingURL=FloatingWindowTab.js.map