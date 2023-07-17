import * as React from "react";
import { CLASSES } from "../Types";
/** @internal */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.debug(error);
        console.debug(errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (React.createElement("div", { className: CLASSES.FLEXLAYOUT__ERROR_BOUNDARY_CONTAINER },
                React.createElement("div", { className: CLASSES.FLEXLAYOUT__ERROR_BOUNDARY_CONTENT }, this.props.message)));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map